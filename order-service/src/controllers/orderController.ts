import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { validationErrorHandler } from "../middleware/errorHandler";
import CustomError from "../utils/customError";
import prisma from "../service/prisma";
import { OrderItem, OrderStatus, type PaymentMode, PaymentStatus } from "@prisma/client";
import crypto from "crypto";
import Razorpay from "razorpay";
import axios from "axios";
import { generateOrderInvoice, generateOrderShippingLabel } from "../service/orderTemplate";
import pdf from "html-pdf";
import emailServer from "../service/emailServer";
import { generateOrderNo } from "../utils/helper";
import { SourceKey } from "./authController";
import { ERPNextClient } from "../service/erpNextService/client";
import { OrderService } from "../service/erpNextService/orderService";
import { ERPNextCustomerService } from "../service/erpNextService/customerService";
import { AddressService } from "../service/erpNextService/addressService";

// Helper function to determine device type
function getDeviceType(userAgent: string): string {
  const mobileRegex = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i;
  return mobileRegex.test(userAgent) ? "Mobile" : "Desktop";
}

export class OrderController {
  /**
   * Create a new order
   */
  async createOrder(req: any, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const {
        userId,
        paymentMode,
        storeId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        billingAddressId,
        shippingAddressId,
        shippingCost = 0,
        dbOrderId,
      } = req.body;

      const {
        source,
        storeId: stId,
        Storeid,
        storeid,
      } = req.headers as {
        source: SourceKey;
        storeId?: string;
        storeid?: string;
        Storeid?: string;
      };
      // Initialize Razorpay

      // Map payment mode to ensure it matches the enum
      const paymentModeMap: Record<string, PaymentMode> = {
        cash: "CASH" as PaymentMode,
        razorpay: "RAZORPAY",
        upi: "UPI",
        pickup: "PICKUP",
      };

      // Convert payment mode to proper enum value
      const validatedPaymentMode = paymentModeMap[paymentMode] || paymentMode;

      // Get user agent information
      const userAgent = req.headers["user-agent"] || "Unknown";
      const deviceType = getDeviceType(userAgent);

      // Validate user
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({
          success: "FAILED",
          message: "User not found.",
        });
      }

      // Find active cart
      const cart = await prisma.cart.findFirst({
        where: {
          userId,
          status: "ACTIVE",
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          billingAddress: true,
          shippingAddress: true,
        },
      });

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          success: "FAILED",
          message: "Cart is empty or not found.",
        });
      }

      // Check if cart is already processed
      if (cart.status === "COMPLETED") {
        return res.status(400).json({
          success: "FAILED",
          message: "This cart has already been processed.",
        });
      }

      // Check inventory
      for (const item of cart.items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          return res.status(400).json({
            success: "FAILED",
            message: `Product not found: ${item.name}.`,
          });
        }
        //will be used later on!!
        // if (
        //   (!product.sellEvenInZeroQuantity && Number(product.stock)) ||
        //   0 < item.quantity
        // ) {
        //   return res.status(400).json({
        //     success: "FAILED",
        //     message: `Insufficient stock for product: ${item.name}.`,
        //   });
        // }
        if (
          !product.sellEvenInZeroQuantity &&
          (product?.stock ?? 0) < item.quantity
        ) {
          return res.status(400).json({
            success: "FAILED",
            message: `Insufficient stock for product: ${
              item.name
            }. Available: ${product?.stock ?? 0}, Requested: ${item.quantity}`,
          });
        }
      }

      let totalAmount = cart.totalPrice; // Convert to paise

      if (shippingCost && Number(shippingCost) > 0) {
        totalAmount += Number(shippingCost);
      }

      // Create order items
      const orderItems = cart.items.map((item) => {
        const gstAmount = (item?.gstRate / 100) * (item.price * item.quantity);
        const totalPriceWithGST = item.price * item.quantity + gstAmount;

        // Add shipping charges if applicable

        return {
          productId: item.productId,
          productName: item.name,
          productImages: item.images,
          quantity: item.quantity,
          price: item.price,
          gstRate: item.gstRate,
          gstAmount,
          totalPriceWithGST,
        };
      });

      const lastOrder = await prisma.order.findFirst({ orderBy: { createdAt: "desc" }, select: { orderId: true } });
      const storeInfo = await prisma.store.findUnique({ where: { id: storeId as string }, select: { name: true } });
      const newOrderId = generateOrderNo(storeInfo?.name as string, lastOrder?.orderId || "OD5000");

      let order;

      if (!dbOrderId) {
        order = await await prisma.order.create({
          data: {
            userId,
            storeId,
            orderId: newOrderId,
            totalAmount,
            paymentMode: validatedPaymentMode as PaymentMode,
            paymentStatus: PaymentStatus.PAYMENT_PENDING,
            status: OrderStatus.PROCESSING,
            username: user.email,
            billingAddressId,
            shippingAddressId,
            shippingCost: Number(shippingCost) || 0,
            userAgent,
            deviceType,
            orderItems: {
              create: orderItems,
            },
            orderLog: {
              create: {
                latestStatus: OrderStatus.PROCESSING,
                statusHistory: [
                  {
                    status: OrderStatus.PROCESSING,
                    updatedAt: new Date().toISOString(),
                  },
                ],
              },
            },
          },
          include: {
            orderItems: true,
            billingAddress: true,
            shippingAddress: true,
            orderLog: true,
            store: {
              select: {
                name: true,
                logo: true,
                SiteConfig: {
                  select: {
                    siteConfig: true,
                  },
                },
              },
            },
          },
        });
      } else {
        order = await prisma.order.findUnique({
          where: { id: dbOrderId },
          include: {
            orderItems: true,
            billingAddress: true,
            shippingAddress: true,
            orderLog: true,
            store: {
              select: {
                name: true,
                logo: true,
                SiteConfig: {
                  select: {
                    siteConfig: true,
                  },
                },
              },
            },
          },
        });

        if (!order) {
          return res.status(404).json({
            success: "FAILED",
            message: "Order not found for update.",
          });
        }
      }


      // Create the order
      // const order = await prisma.order.create({
      //   data: {
      //     userId,
      //     storeId,
      //     orderId: newOrderId,
      //     totalAmount,
      //     paymentMode: validatedPaymentMode as PaymentMode,
      //     paymentStatus: PaymentStatus.PAYMENT_PENDING,
      //     status: OrderStatus.PROCESSING,
      //     username: user.email,
      //     billingAddressId,
      //     shippingAddressId,
      //     shippingCost: Number(shippingCost) || 0,
      //     userAgent,
      //     deviceType,
      //     orderItems: {
      //       create: orderItems,
      //     },
      //     orderLog: {
      //       create: {
      //         latestStatus: OrderStatus.PROCESSING,
      //         statusHistory: [
      //           {
      //             status: OrderStatus.PROCESSING,
      //             updatedAt: new Date().toISOString(),
      //           },
      //         ],
      //       },
      //     },
      //   },
      //   include: {
      //     orderItems: true,
      //     billingAddress: true,
      //     shippingAddress: true,
      //     orderLog: true,
      //     store: {
      //       select: {
      //         name: true,
      //         logo: true,
      //         SiteConfig: {
      //           select: {
      //             siteConfig: true,
      //           },
      //         },
      //       },
      //     },
      //   },
      // });

      // Handle Razorpay payment creation if needed
      if (paymentMode === "RAZORPAY" && (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature)) {
        try {
          const paymentModeConfig = (await prisma.paymentMethod.findUnique({
            where: { storeId: storeId },
            select: { razorpay: true },
          })) as any;

          const razorpayConfig: any = {
            keyId: paymentModeConfig?.razorpay.keyId,
            keySecret: paymentModeConfig?.razorpay?.keySecret,
          };

          const razorpay = new Razorpay({
            key_id: razorpayConfig?.keyId,
            key_secret: razorpayConfig?.keySecret,
          });
          // console.log("Razorpay Order Response:", response.data);
          const razorpayOrder = await razorpay.orders.create({
            amount: totalAmount * 100, // Amount in paise
            currency: "INR",
            receipt: `order-${Date.now()}`,
            notes: {
              storeId: storeId,
            },
          });

          return res.status(200).json({
            success: "PENDING",
            razorpayOrderId: razorpayOrder.id,
            dbOrderId: order.id,
            razorpayKeyId: razorpayConfig.keyId,
            totalAmount,
            message: "Razorpay order created. Complete the payment to proceed.",
          });
        } catch (error: any) {
          console.error("Razorpay Error:", error);
          return next(new CustomError("Failed to create Razorpay order.", 500));
        }
      }

      // Verify Razorpay payment if provided
      if (paymentMode === "RAZORPAY" && razorpayPaymentId && razorpayOrderId && razorpaySignature && dbOrderId) {
        const paymentModeConfig = (await prisma.paymentMethod.findUnique({
          where: { storeId: storeId },
          select: { razorpay: true },
        })) as any;
        const generatedSignature = crypto
          .createHmac("sha256", paymentModeConfig?.razorpay?.keySecret || "")
          .update(razorpayOrderId + "|" + razorpayPaymentId)
          .digest("hex");

        if (generatedSignature !== razorpaySignature) {
          return res.status(400).json({
            success: "FAILED",
            message: "Invalid payment verification.",
          });
        }

        // update the order
        const order = await prisma.order.update({
          where: { id: dbOrderId },
          data: {
            paymentStatus: PaymentStatus.PAID,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            status: OrderStatus.CONFIRMED,

            orderLog: {
              update: {
                latestStatus: OrderStatus.CONFIRMED,
                statusHistory: [
                  {
                    status: OrderStatus.CONFIRMED,
                    updatedAt: new Date().toISOString(),
                  },
                ],
              },
            },
          },
          include: {
            orderItems: true,
            billingAddress: true,
            shippingAddress: true,
            orderLog: true,
          },
        });

        // Save payment
        const payment = await prisma.payment.create({
          data: {
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
            merchantAccountId: storeId,
            amount: totalAmount,
            currency: "INR",
            status: "captured",
            paymentMethod: "unknown",
            email: req?.user.email,
            contact: "",
            notes: {
              storeId: storeId,
            },
          },
        });

        //
        //
        //  // Log payment verification
        await prisma.paymentLog.create({
          data: {
            paymentId: razorpayPaymentId,
            event: "payment_verified",
            payload: req.body,
          },
        });
      }

      // Update product inventory
      for (const item of cart.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Mark cart as processed
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          status: "COMPLETED",
        },
      });

      const siteConfig = await prisma.siteConfig.findFirst({
        where: { storeId: storeId as string },
      });

      const parseSiteConfing = JSON.parse((siteConfig?.siteConfig as any) || "{}");

      // Send  order confirmation email
      await emailServer.emailController("ORDER_PLACED_NOTIFICATION", {
        toEmail: req?.user?.email,
        storeName: `${order?.store?.name}`,
        shippingCost: Number(order?.shippingCost) || 0,
        storeEmail: parseSiteConfing?.contact?.email,
        firstName: req?.user?.username as string,
        orderInfo: {
          orderStatus: order.status,
          orderNumber: (order.orderId as string) || order.id,
          orderItems: orderItems.map((item) => ({
            name: item.productName,
            quantity: item.quantity,
            price: item.price,
          })),
          orderTotal: order.totalAmount,
        },
      });

      await emailServer.emailController("ORDER_PLACED_NOTIFICATION_TO_ADMIN", {
        toEmail: req?.user?.email,
        storeName: order?.store?.name,
        shippingCost: Number(order?.shippingCost) || 0,
        storeEmail: parseSiteConfing?.contact?.email,
        firstName: req?.user?.username as string,
        shippingAddress: order.shippingAddress,
        orderInfo: {
          orderStatus: order.status,
          orderNumber: (order.orderId as string) || order.id,
          orderItems: orderItems.map((item) => ({
            name: item.productName,
            quantity: item.quantity,
            price: item.price,
          })),
          orderTotal: order.totalAmount,
        },
      });
      let erpSyncStatus = {
        success: false,
        message: "ERP sync not attempted",
        erpOrderId: null,
      };
      try {
        const store = await prisma.store.findUnique({ where: { id: storeId }, include: { StoreErpNext: true } });
        const erpConfig: any = store?.StoreErpNext?.[0];
        let customerAdd
        if (erpConfig?.apiKey) {
          console.log("Hit2");

          const erpClient = new ERPNextClient({
            apiKey: erpConfig.apiKey,
            baseUrl: erpConfig.baseUrl,
            apiSecret: erpConfig.apiSecret,
            defaultCustomerGroup: store?.name!,
            defaultTerritory: store?.name!,
          });
          console.log("ERP Config:", {
            baseURL: erpConfig.baseUrl, // Should be full URL like "https://erp.example.com"
            apiKey: erpConfig.apiKey, // Should be a valid API key
            apiSecret: erpConfig.apiSecret, // Should be a valid API secret
          });
          const customerService = new ERPNextCustomerService(erpConfig);
          const erpCustomer = await customerService.findCustomerByExternalId(order.userId);

          if (!erpCustomer) {
            const user = await prisma.user.findUnique({ where: { id: order.userId } });
  
            if (!user) {
              throw new Error(`User with ID ${order.userId} not found`);
            }

            customerAdd = await customerService.createCustomer({
              name: user.username || "", // Provide fallback for null username
              mobile: user.phone || "", // Provide fallback for null phone
              id: user.id,
              group: "Individual",
              territory: "All Territories",
            });
          }

          const addressService = new AddressService(erpClient);

          // Helper function to convert null to undefined
          const nullToUndefined = (value: string | null | undefined): string | undefined => {
            return value === null ? undefined : value;
          };

          let billingAddressResult;
          let shippingAddressResult;
          // Sync billing address if it exists
          if (order.billingAddress) {
            billingAddressResult = await addressService.createAddress({
              id: order.billingAddress.id,
              address_title: customerAdd?.data?.name || `Billing Address ${order.billingAddress.id.substring(0, 8)}`,
              address_type: "Billing",
              address_line1: order.billingAddress.line1,
              address_line2: nullToUndefined(order.billingAddress.line2),
              city: order.billingAddress.city,
              state: order.billingAddress.state,
              country: order.billingAddress.country || "India",
              pincode: order.billingAddress.zip,
              phone: order.billingAddress.phone,
              email_id: nullToUndefined(order.username), // Convert null to undefined
              is_primary_address: true,
              is_shipping_address: false,
              linked_doctype: "Customer",
              linked_name: customerAdd?.data?.name,
              // custom_external_id: order.billingAddress.id
            });
          }

          // Sync shipping address if it exists
          if (order.shippingAddress) {
            shippingAddressResult = await addressService.createAddress({
              id: order.shippingAddress.id,
              address_title: customerAdd?.data?.name || `Shipping Address ${order.shippingAddress.id.substring(0, 8)}`,
              address_type: "Shipping",
              address_line1: order.shippingAddress.line1,
              address_line2: nullToUndefined(order.shippingAddress.line2),
              city: order.shippingAddress.city,
              state: order.shippingAddress.state,
              country: order.shippingAddress.country || "India",
              pincode: order.shippingAddress.zip,
              phone: order.shippingAddress.phone,
              email_id: nullToUndefined(order.username),
              is_primary_address: false,
              is_shipping_address: true,
              linked_doctype: "Customer",
              linked_name: customerAdd?.data?.name,
              // custom_external_id: order.shippingAddress.id
            });
          }

          const result = await new OrderService(erpClient).createOrder({
            customer_name: customerAdd?.data?.name,
            order_date: order.orderDate,
            delivery_date: new Date(new Date(order.orderDate).getTime() + 5 * 24 * 60 * 60 * 1000),
            currency: "INR",
            items: order.orderItems.map((item) => ({
              item_code: item.productName,
              item_name: item.productName,
              description: item.productName,
              qty: item.quantity,
              rate: item.price,
              amount: item.totalPriceWithGST,
            })),
            total_qty: order.orderItems.length,
            total: order.totalAmount,
            taxes_and_charges_template: "0",
            tax_amount: 0,
            grand_total: order.totalAmount,
            billing_address: billingAddressResult?.data.name,
            shipping_address: shippingAddressResult?.data.name,
            contact_person: order.shippingAddress?.phone,
            customer_id: order.shippingAddress?.userId!,
            status: order.status,
            id: order.id,
          });

          const status = await new OrderService(erpClient).updateOrderStatus(
              result?.data?.name || "",
              {
                Status: "CONFIRM",
              }
            );
          
            const pay = await new OrderService(erpClient).createPayment(result?.data?.name || "", customerAdd?.data?.name || "", {
              paymentId: paymentMode === "RAZORPAY"? razorpayPaymentId :  `manual-${order.id}-${Date.now()}`,
              amount: totalAmount,
              currency: "INR",
              source_exchange_rate: 1,
              paymentMethod: validatedPaymentMode,
              status: "captured",
              date: new Date()
            });
        }
      } catch (error: unknown) {
        console.log("Error while creating order on ERPNext", error);
      erpSyncStatus = {
        success: false,
        message: `Error while create order on ERPNext: ${JSON.stringify(error)}`,
        erpOrderId: null,
      };
      }

      return res.status(201).json({
        success: "SUCCESS",
        message: "Order placed successfully.",
        data: { 
          order: null,
          erpSync: erpSyncStatus
         },
      });
    } catch (error: any) {
      return next(new CustomError(`Error creating order: ${error.message}`, 500));
    }
  }

  /**
   * List orders for a specific user
   */
  async listOrders(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));
    try {
      const { userId } = req.params;
      const { page = 1, pageSize = 10 } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: "FAILED",
          message: "User ID is missing.",
        });
      }

      const orders = await prisma.order.findMany({
        skip: (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
        where: { userId },
        include: {
          orderItems: true,
          billingAddress: true,
          shippingAddress: true,
          orderLog: true,
        },
        orderBy: { createdAt: "desc" },
      });

      if (orders.length === 0) {
        return res.status(404).json({
          success: "FAILED",
          message: "No orders found for this user.",
        });
      }

      return res.status(200).json({
        success: "SUCCESS",
        data: orders,
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching orders: ${error.message}`, 500));
    }
  }
  /**
   * Get orders by store ID
   */
  async getOrdersByStoreId(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));
    try {
      const { storeId } = req.params;

      const orders = await prisma.order.findMany({
        where: { storeId },
        include: {
          orderItems: true,
          billingAddress: true,
          shippingAddress: true,
          orderLog: true,
          user: {
            select: {
              email: true,
              username: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({
        success: "SUCCESS",
        message: "Orders fetched successfully.",
        data: orders,
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching orders: ${error.message}`, 500));
    }
  }

  /**
   * Generate invoice for an order
   */
  async generateInvoice(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));
    try {
      const { orderId } = req.body;

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: true,
          billingAddress: true,
          shippingAddress: true,
          user: true,
        },
      });

      if (!order) {
        return next(new CustomError("Order not found", 404));
      }

      // HTML Invoice Generation
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice - ${orderId}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 30px; background-color: #f5f5f5; }
                .invoice-box { width: 100%; max-width: 850px; margin: auto; background: #fff; padding: 25px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); }
                .header { text-align: center; font-size: 26px; font-weight: bold; color: #333; margin-bottom: 30px; }
                .details { display: flex; justify-content: space-between; font-size: 16px; margin-bottom: 30px; }
                .details div { width: 48%; }
                .table-container { margin-top: 30px; }
                table { width: 100%; border-collapse: collapse; font-size: 15px; margin-top: 15px; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #f8f8f8; font-weight: bold; }
                .total-box { text-align: right; font-size: 20px; font-weight: bold; margin-top: 30px; padding: 15px; background: #f8f8f8; border-radius: 10px; }
                .footer { text-align: center; font-size: 14px; margin-top: 30px; color: #777; padding-top: 15px; border-top: 1px solid #ddd; }
            </style>
        </head>
        <body>
            <div class="invoice-box">
                <div class="header">Order Invoice</div>

                <div class="details">
                    <div>
                        <strong>Customer Details:</strong>
                        <p>${order.shippingAddress?.name || "N/A"} (${order.username || "N/A"})</p>
                        <p>${order.shippingAddress?.line1 || "N/A"}, ${order.shippingAddress?.line2 || ""}</p>
                        <p>${order.shippingAddress?.city || "N/A"}, ${order.shippingAddress?.state || "N/A"}, ${
        order.shippingAddress?.zip || "N/A"
      }</p>
                        <p>${order.shippingAddress?.country || "N/A"}</p>
                        <p><strong>📞 Phone:</strong> ${order.shippingAddress?.phone || "N/A"}</p>
                    </div>
                    <div>
                        <strong>Order Details:</strong>
                        <p><strong>Order ID:</strong> ${orderId}</p>
                        <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
                        <p><strong>Payment Mode:</strong> ${order.paymentMode}</p>
                        <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
                        <p><strong>Order Status:</strong> ${order.status}</p>
                    </div>
                </div>

                <div class="table-container">
                    <table>
                        <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price (₹)</th>
                            <th>GST (%)</th>
                            <th>GST Amount (₹)</th>
                            <th>Total (₹)</th>
                        </tr>
                        ${
                          order.orderItems.length > 0
                            ? order.orderItems
                                .map(
                                  (item, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.productName || "N/A"}</td>
                            <td>${item.quantity || 0}</td>
                            <td>₹${(item.price || 0).toFixed(2)}</td>
                            <td>${item.gstRate || 0}%</td>
                            <td>₹${(item.gstAmount || 0).toFixed(2)}</td>
                            <td>₹${(item.totalPriceWithGST || 0).toFixed(2)}</td>
                        </tr>`
                                )
                                .join("")
                            : `<tr><td colspan="7" style="text-align: center;">No items found</td></tr>`
                        }
                    </table>
                </div>

                <div class="total-box">
                    <p>Subtotal: ₹${(order.totalAmount - order.orderItems.reduce((sum, item) => sum + item.gstAmount, 0)).toFixed(2)}</p>
                    <p>GST: ₹${order.orderItems.reduce((sum, item) => sum + item.gstAmount, 0).toFixed(2)}</p>
                    <p><strong>Grand Total: ₹${order.totalAmount.toFixed(2)}</strong></p>
                </div>

                <div class="footer">
                    <p>Thank you for your purchase!</p>
                    <p>For any queries, contact support@example.com</p>
                </div>
            </div>
        </body>
        </html>
      `;

      // Set content type to HTML
      res.setHeader("Content-Type", "text/html");
      return res.status(200).send(invoiceHTML);
    } catch (error: any) {
      return next(new CustomError(`Error generating invoice: ${error.message}`, 500));
    }
  }

  /**
   * Change order status
   */
  async changeOrderStatus(req: any, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const { orderId, newStatus, paymentStatus, trackingNo, deliveryPartner } = req.body;

      // Validate input
      if (!orderId || !newStatus) {
        return res.status(400).json({
          success: "ERROR",
          message: "Missing required fields: orderId and newStatus.",
        });
      }

      // Check if order exists
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: true,
          store: {
            select: {
              name: true,
              id: true,
              StoreErpNext: true,
            },
          },
        },
      });

      if (!order) {
        return res.status(404).json({
          success: "ERROR",
          message: "Order not found.",
        });
      }

      // Prepare status update
      const updatedAt = new Date();
      const statusEntry = {
        status: newStatus,
        paymentStatus: paymentStatus,
        updatedAt: updatedAt.toISOString(),
      };

      // Update order status
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: newStatus as OrderStatus,
          paymentStatus: paymentStatus as PaymentStatus,
          trackingNo: trackingNo,
          deliveryPartner: deliveryPartner,
          updatedAt,
        },
      });

      // Update order log
      await prisma.orderLog.upsert({
        where: { orderId },
        create: {
          orderId,
          latestStatus: newStatus as OrderStatus,
          statusHistory: [statusEntry],
        },
        update: {
          latestStatus: newStatus as OrderStatus,
          statusHistory: {
            push: statusEntry,
          },
        },
      });

      // ERPNext Sync
      try {
        const erpConfig: any = order.store.StoreErpNext?.[0];

        if (erpConfig?.apiKey) {
          const erpClient = new ERPNextClient({
            apiKey: erpConfig.apiKey,
            baseUrl: erpConfig.baseUrl,
            apiSecret: erpConfig.apiSecret,
            defaultCustomerGroup: order.store.name,
            defaultTerritory: order.store.name,
          });

          const externalOrder = await new OrderService(
            erpClient
          ).findOrderByExternalId(orderId);
          console.log(externalOrder, "externalOrder");
          if (externalOrder) {
            const status = await new OrderService(erpClient).updateOrderStatus(
              externalOrder?.name || "",
              {
                Status: newStatus,
              }
            );
            console.log(
              "ERPNext Order Status Update Response:",
              status,
              newStatus
            );
          } else {
            console.error("ERPNext Order not found for ID:", orderId);
          }
        }
      } catch (error: any) {
        console.error("ERPNext Sync Error:", error);
      }

      if (order.status !== newStatus) {
        // Send order status update email
        const siteConfig = await prisma.siteConfig.findFirst({
          where: { storeId: order.store.id as string },
        });

        const parseSiteConfing = JSON.parse((siteConfig?.siteConfig as any) || "{}");
        await emailServer.emailController("ORDER_NOTIFICATION", {
          toEmail: order?.username as string,
          storeName: order?.store?.name,
          storeEmail: parseSiteConfing?.contact?.email,
          shippingCost: Number(order?.shippingCost) || 0,
          firstName: order.username as string,
          orderInfo: {
            orderStatus: newStatus,
            orderNumber: (order.orderId as string) || order.id,
            orderItems: order.orderItems.map((item) => ({
              name: item.productName,
              quantity: item.quantity,
              price: item.price,
            })),
            orderTotal: order.totalAmount,
          },
        });
      }

      if (order.status === "CANCELLED" && newStatus !== "CANCELLED") {
        // Update product inventory
        for (const item of order.orderItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: Number(item.quantity) } },
          });
        }
      }

      // Update product inventory
      if (newStatus === "CANCELLED") {
        for (const item of order.orderItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: Number(item.quantity) } },
          });
        }
      }

      return res.status(200).json({
        success: "SUCCESS",
        message: "Order status updated successfully.",
        data: { orderId, status: newStatus },
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating order status: ${error.message}`, 500));
    }
  }

  /**
   * Get order items by order ID
   */
  async getOrderItemsByOrderId(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const { orderId } = req.params;

      // Find order items
      const orderItems = await prisma.orderItem.findMany({
        where: { orderId },
        include: {
          order: {
            select: {
              status: true,
              totalAmount: true,
              shippingAddress: true,
              username: true,
            },
          },
        },
      });

      return res.status(200).json({
        success: "SUCCESS",
        message: "Order items fetched successfully.",
        data: orderItems,
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching order items: ${error.message}`, 500));
    }
  }

  /**
   * Get pending payment orders
   */
  async getPendingPaymentOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;

      const orders = await prisma.order.findMany({
        where: {
          storeId,
          paymentStatus: PaymentStatus.PAYMENT_PENDING,
        },
        include: {
          orderItems: true,
          billingAddress: true,
          shippingAddress: true,
          orderLog: true,
          user: {
            select: {
              email: true,
              username: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({
        success: "SUCCESS",
        message: "Pending payment orders fetched successfully.",
        data: orders,
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching pending payment orders: ${error.message}`, 500));
    }
  }

  /**
   * Track order status
   */
  async trackOrder(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));
    try {
      const { orderId } = req.params;

      // Validate input
      if (!orderId) {
        return res.status(400).json({
          success: "ERROR",
          message: "Missing required parameter: orderId.",
        });
      }

      // Find order log
      const orderLog = await prisma.orderLog.findUnique({
        where: { orderId },
        include: {
          order: {
            include: {
              orderItems: true,
              billingAddress: true,
              shippingAddress: true,
            },
          },
        },
      });

      if (!orderLog) {
        return res.status(404).json({
          success: "ERROR",
          message: "Order not found in tracking logs.",
        });
      }

      return res.status(200).json({
        success: "SUCCESS",
        message: "Order tracking details fetched successfully.",
        data: orderLog,
      });
    } catch (error: any) {
      return next(new CustomError(`Error tracking order: ${error.message}`, 500));
    }
  }

  /**
   * Verify payment
   */
  async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { order_id, payment_id, signature, merchant_account_id, amount, currency, email, contact, notes } = req.body;

      const generatedSignature = crypto.createHmac("sha256", "").update(`${order_id}|${payment_id}`).digest("hex");

      if (generatedSignature !== signature) {
        return res.status(400).json({ success: "FAILED", message: "Invalid signature" });
      }

      // Save payment
      const payment = await prisma.payment.create({
        data: {
          orderId: order_id,
          paymentId: payment_id,
          merchantAccountId: "11111",
          amount,
          currency,
          status: "captured",
          paymentMethod: "unknown",
          email,
          contact,
          notes,
        },
      });

      // Log payment verification
      await prisma.paymentLog.create({
        data: {
          paymentId: payment_id,
          event: "payment_verified",
          payload: req.body,
        },
      });

      return res.status(200).json({
        success: "SUCCESS",
        message: "Payment verified successfully",
        payment,
      });
    } catch (error: any) {
      return next(new CustomError(`Payment verification failed: ${error.message}`, 500));
    }
  }

  /**
   * Get order information including company details and address
   */
  async getShippingLabel(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const { orderId, storeId } = req.params;

      // Get order details with related information
      const orderInfo = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: true,
          billingAddress: true,
          shippingAddress: true,
          user: {
            select: {
              username: true,
            },
          },
          store: {
            select: {
              name: true,
              logo: true,
            },
          },
        },
      });

      // if (orderInfo?.status !== "SHIPPED") {
      //   return res.status(400).json({
      //     success: "FAILED",
      //     message: "Please wait for order status to be shipped before generating shipping label.",
      //   });
      // }

      const siteConfig = await prisma.siteConfig.findFirst({
        where: { storeId: storeId as string },
      });

      const parseSiteConfing = JSON.parse((siteConfig?.siteConfig as any) || "{}");

      const shippingLabelTemplate = generateOrderShippingLabel({
        storeAddress: parseSiteConfing.contact.address,
        storePhone: parseSiteConfing.contact.phone,
        companyName: orderInfo?.store.name as string,
        companyLogo: orderInfo?.store.logo as string,
        customerName: orderInfo?.user.username as string,
        customerAddress: orderInfo?.shippingAddress?.line1 as string,
        customerPhone: orderInfo?.shippingAddress?.phone as string,
        orderNumber: (orderInfo?.orderId as string) || (orderInfo?.id as string),
        orderDate: orderInfo?.createdAt.toLocaleString() as string,
      });

      pdf.create(shippingLabelTemplate, { format: "A4" }).toBuffer((err, buffer) => {
        if (err) {
          return res.status(500).send("Failed to create PDF");
        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=shipping-label.pdf");
        res.status(200).send(buffer);
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching order information: ${error.message}`, 500));
    }
  }
  async getOrderInvoice(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const { orderId, storeId } = req.params;

      // Get order details with related information
      const orderInfo = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: true,
          billingAddress: true,
          shippingAddress: true,
          user: {
            select: {
              username: true,
            },
          },
          store: {
            select: {
              name: true,
              logo: true,
            },
          },
        },
      });

      const siteConfig = await prisma.siteConfig.findFirst({
        where: { storeId: storeId as string },
      });

      const parseSiteConfing = JSON.parse((siteConfig?.siteConfig as any) || "{}");

      const invoiceTemplate = generateOrderInvoice({
        items: orderInfo?.orderItems as OrderItem[],
        store: orderInfo?.store as any,
        storeAddress: parseSiteConfing?.contact?.address as string,
        storePhone: parseSiteConfing?.contact?.phone as string,
        shippingAddress: orderInfo?.shippingAddress as any,
        customerName: orderInfo?.user.username as string,
        customerAddress: orderInfo?.shippingAddress?.line1 as string,
        customerPhone: orderInfo?.shippingAddress?.phone as string,
        totalAmount: orderInfo?.totalAmount as number,
        orderNumber: (orderInfo?.orderId as string) || (orderInfo?.id as string),
        orderDate: orderInfo?.createdAt.toLocaleString() as string,
        shippingCost: orderInfo?.shippingCost || 0,
      });

      pdf.create(invoiceTemplate, { format: "A4" }).toBuffer((err, buffer) => {
        if (err) {
          return res.status(500).send("Failed to create PDF");
        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=orderInvoice-${orderInfo?.id}.pdf`);
        res.status(200).send(buffer);
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching order information: ${error.message}`, 500));
    }
  }

  /**
   * Get order by orderId
   */
  async getOrderById(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const { orderId } = req.params;

      if (!orderId) {
        return res.status(400).json({
          success: "FAILED",
          message: "Missing required parameter: orderId.",
        });
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: true,
          billingAddress: true,
          shippingAddress: true,
          orderLog: true,
          user: {
            select: {
              email: true,
              username: true,
            },
          },
          store: {
            select: {
              name: true,
              logo: true,
            },
          },
        },
      });

      return res.status(200).json({
        success: "SUCCESS",
        data: order,
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching order: ${error.message}`, 500));
    }
  }
}
