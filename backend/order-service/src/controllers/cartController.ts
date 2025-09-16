import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { validationErrorHandler } from "../middleware/errorHandler";
import CustomError from "../utils/customError";
import prisma from "../service/prisma";
// Import CartStatus from Prisma client
import { CartStatus, DiscountType } from ".prisma/client"; // Or use const { CartStatus } = prisma;

export class CartController {
  async addOrUpdateCart(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const { userId, storeId, productId, quantity, price, name, images } = req.body;

      // Validate required fields
      if (!userId || !productId || quantity === undefined || !price || !storeId) {
        return res.status(400).json({
          success: "FAILED",
          message: "User ID, Product ID, Quantity, and Price are required.",
        });
      }

      // Fetch user details
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({
          success: "FAILED",
          message: "User not found.",
        });
      }

      // Fetch product details to get GST rate
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return res.status(404).json({
          success: "FAILED",
          message: "Product not found.",
        });
      }

      const gstRate = product.gstRate || 0;
      const gstAmount = (gstRate / 100) * (price * quantity);
      const totalPriceWithGST = price * quantity + gstAmount;

      // Check for an active cart
      const activeCart = await prisma.cart.findFirst({
        where: {
          userId,
          status: CartStatus.ACTIVE,
        },
        include: {
          items: true,
        },
      });

      if (!activeCart) {
        // Create a new cart if quantity > 0
        if (quantity > 0) {
          const newCartId = `cart-${userId}-${Date.now()}`;

          const cart = await prisma.cart.create({
            data: {
              cartId: newCartId,
              userId,
              storeId,
              totalPrice: totalPriceWithGST,
              status: CartStatus.ACTIVE,

              items: {
                create: {
                  productId,
                  quantity,
                  price,
                  totalPrice: quantity * price,
                  gstRate,
                  gstAmount,
                  totalPriceWithGST,
                  name,
                  images,
                },
              },
            },
            include: {
              items: true,
              user: true,
            },
          });

          return res.status(201).json({
            success: "SUCCESS",
            data: { cart },
            message: "Cart created successfully",
          });
        } else {
          return res.status(400).json({
            success: "FAILED",
            message: "Cart cannot be created with zero quantity.",
          });
        }
      } else {
        // Update existing cart
        const existingItemIndex = activeCart.items.findIndex((item: any) => item.productId === productId);

        if (existingItemIndex >= 0) {
          // Update existing item
          const existingItem = activeCart.items[existingItemIndex];

          if (quantity > 0) {
            // Update quantity
            await prisma.cartItem.update({
              where: { id: existingItem.id },
              data: {
                quantity,
                totalPrice: quantity * price,
                gstRate,
                gstAmount,
                totalPriceWithGST,
              },
            });
          } else {
            // Remove item if quantity is 0
            await prisma.cartItem.delete({
              where: { id: existingItem.id },
            });
          }
        } else if (quantity > 0) {
          // Add new item
          await prisma.cartItem.create({
            data: {
              cartId: activeCart.id,
              productId,
              quantity,
              price,
              totalPrice: quantity * price,
              gstRate,
              gstAmount,
              totalPriceWithGST,
              name,
              images,
            },
          });
        } else {
          return res.status(400).json({
            success: "FAILED",
            message: "Cannot subtract quantity from a non-existing product.",
          });
        }

        // Recalculate cart total
        const updatedItems = await prisma.cartItem.findMany({
          where: { cartId: activeCart.id },
        });

        const newTotalPrice = updatedItems.reduce((acc: number, item: any) => acc + item.totalPriceWithGST, 0);

        // Update cart total
        const updatedCart = await prisma.cart.update({
          where: { id: activeCart.id },
          data: {
            totalPrice: newTotalPrice,
            updatedAt: new Date(),
          },
          include: {
            items: true,
            user: true,
          },
        });

        return res.status(200).json({
          success: "SUCCESS",
          data: { cart: updatedCart },
          message: "Cart updated successfully",
        });
      }
    } catch (error: any) {
      return next(new CustomError(`Error updating cart: ${error.message}`, 500));
    }
  }

  async getCartByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const whereClause: any = { userId, status: CartStatus.ACTIVE };

      const cart = await prisma.cart.findFirst({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
          user: true,
        },
      });

      if (!cart) {
        return res.status(404).json({
          success: "FAILED",
          message: "No active cart found for this user.",
        });
      }

      res.json({
        success: "SUCCESS",
        data: { activeCart: cart },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching cart: ${error.message}`, 500));
    }
  }

  async removeCartItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { cartItemId } = req.params;

      const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
        include: {
          cart: true,
        },
      });

      if (!cartItem) {
        return res.status(404).json({
          success: "FAILED",
          message: "Cart item not found.",
        });
      }

      // Delete the cart item
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });

      // Recalculate and update cart total
      const remainingItems = await prisma.cartItem.findMany({
        where: { cartId: cartItem.cartId },
      });

      const newTotalPrice = remainingItems.reduce((acc: number, item: any) => acc + item.totalPriceWithGST, 0);

      const updatedCart = await prisma.cart.update({
        where: { id: cartItem.cartId },
        data: {
          totalPrice: newTotalPrice,
          updatedAt: new Date(),
        },
        include: {
          items: true,
          user: true,
        },
      });

      res.json({
        success: "SUCCESS",
        data: { cart: updatedCart },
        message: "Item removed from cart successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error removing cart item: ${error.message}`, 500));
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { cartId } = req.params;

      const cart = await prisma.cart.findUnique({
        where: { id: cartId },
      });

      if (!cart) {
        return res.status(404).json({
          success: "FAILED",
          message: "Cart not found.",
        });
      }

      // Delete all items in the cart
      await prisma.cartItem.deleteMany({
        where: { cartId },
      });

      // Update cart total to 0
      const updatedCart = await prisma.cart.update({
        where: { id: cartId },
        data: {
          totalPrice: 0,
          updatedAt: new Date(),
        },
        include: {
          items: true,
          user: true,
        },
      });

      res.json({
        success: "SUCCESS",
        data: { cart: updatedCart },
        message: "Cart cleared successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error clearing cart: ${error.message}`, 500));
    }
  }

  async updateCartStatus(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));
    try {
      const { cartId } = req.params;
      const { status } = req.body;

      if (!Object.values(CartStatus).includes(status as CartStatus)) {
        return res.status(400).json({
          success: "FAILED",
          message: "Invalid cart status.",
        });
      }

      const cart = await prisma.cart.findUnique({
        where: { id: cartId },
      });

      if (!cart) {
        return res.status(404).json({
          success: "FAILED",
          message: "Cart not found.",
        });
      }

      const updatedCart = await prisma.cart.update({
        where: { id: cartId },
        data: {
          status: status as CartStatus,
          updatedAt: new Date(),
        },
        include: {
          items: true,
          user: true,
        },
      });

      res.json({
        success: "SUCCESS",
        data: { cart: updatedCart },
        message: "Cart status updated successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating cart status: ${error.message}`, 500));
    }
  }

  async getAbandonedCarts(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;

      if (!storeId) {
        return res.status(400).json({
          success: "FAILED",
          message: "Store ID is required.",
        });
      }

      // Define the 24-hour threshold for abandonment
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      // Query abandoned carts
      const abandonedCarts = await prisma.cart.findMany({
        where: {
          storeId,
          status: { not: CartStatus.COMPLETED },
          OR: [{ createdAt: { lt: oneDayAgo } }, { updatedAt: { lt: oneDayAgo } }],
        },
        include: {
          items: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      });

      if (abandonedCarts.length === 0) {
        return res.status(404).json({
          success: "FAILED",
          message: "No abandoned carts found for this store.",
        });
      }

      return res.status(200).json({
        success: "SUCCESS",
        data: { abandonedCarts: abandonedCarts },
        message: "Abandoned carts fetched successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching abandoned carts: ${error.message}`, 500));
    }
  }

  async getCartsByStoreId(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;

      if (!storeId) {
        return res.status(400).json({
          success: "FAILED",
          message: "Store ID is required.",
        });
      }

      // Query all carts by storeId
      const carts = await prisma.cart.findMany({
        where: {
          storeId,
          status: CartStatus.ACTIVE,
        },
        include: {
          items: true,
          user: true,
        },
      });

      if (carts.length === 0) {
        return res.status(404).json({
          success: "FAILED",
          message: "No carts found for the store.",
        });
      }

      return res.status(200).json({
        success: "SUCCESS",
        data: { carts },
        message: "Carts fetched successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching carts: ${error.message}`, 500));
    }
  }

  async getActiveCartByStoreId(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;

      if (!storeId) {
        return res.status(400).json({
          success: "FAILED",
          message: "StoreId ID is required.",
        });
      }

      // Query to fetch the active cart for the given userId
      const activeCart = await prisma.cart.findMany({
        where: {
          storeId,
          status: CartStatus.ACTIVE,
        },
        include: {
          items: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      });

      if (!activeCart) {
        return res.status(404).json({
          success: "FAILED",
          message: "No active cart found for the given user.",
        });
      }

      return res.status(200).json({
        success: "SUCCESS",
        data: { carts: activeCart },
        message: "Active cart fetched successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error retrieving active cart: ${error.message}`, 500));
    }
  }

  async clearCartByUserId(req: any, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));
    try {
      const userId = req?.user?.id;

      // Find the most recent active cart for the user
      const cart = await prisma.cart.findFirst({
        where: {
          userId,
          status: CartStatus.ACTIVE,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!cart) {
        return res.status(404).json({
          success: "FAILED",
          message: "No active cart found for the user.",
        });
      }

      // Delete all items in the cart
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      // Update cart total to 0
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          totalPrice: 0,
          updatedAt: new Date(),
        },
      });

      return res.status(200).json({
        success: "SUCCESS",
        message: "Cart cleared successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error clearing cart: ${error.message}`, 500));
    }
  }

  async removeProductFromCart(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));
    try {
      const { userId, productId, quantity } = req.body;

      if (!userId || !productId) {
        return res.status(400).json({
          success: "FAILED",
          message: "User ID and Product ID are required.",
        });
      }

      // Query the most recent active cart for the user
      const cart = await prisma.cart.findFirst({
        where: {
          userId,
          status: CartStatus.ACTIVE,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          items: true,
        },
      });

      if (!cart) {
        return res.status(404).json({
          success: "FAILED",
          message: "No active cart found for the user.",
        });
      }

      // Find the product in the cart
      const productIndex = cart.items.findIndex((item) => item.productId === productId);

      if (productIndex === -1) {
        return res.status(404).json({
          success: "FAILED",
          message: "Product not found in the cart.",
        });
      }

      const cartItem = cart.items[productIndex];

      if (quantity && quantity > 0) {
        // Update the quantity if specified
        await prisma.cartItem.update({
          where: { id: cartItem.id },
          data: {
            quantity,
            totalPrice: quantity * cartItem.price,
            totalPriceWithGST: quantity * cartItem.price + (cartItem.gstRate / 100) * (cartItem.price * quantity),
          },
        });
      } else {
        // Remove the product completely
        await prisma.cartItem.delete({
          where: { id: cartItem.id },
        });
      }

      // Recalculate cart total
      const updatedItems = await prisma.cartItem.findMany({
        where: { cartId: cart.id },
      });

      if (updatedItems.length === 0) {
        // If no items are left, delete the cart
        await prisma.cart.delete({
          where: { id: cart.id },
        });

        return res.status(200).json({
          success: "SUCCESS",
          message: "Cart is empty and has been deleted.",
        });
      }

      // Calculate new total price
      const newTotalPrice = updatedItems.reduce((acc, item) => acc + item.totalPriceWithGST, 0);

      // Update cart total
      const updatedCart = await prisma.cart.update({
        where: { id: cart.id },
        data: {
          totalPrice: newTotalPrice,
          updatedAt: new Date(),
        },
        include: {
          items: true,
          user: true,
        },
      });

      return res.status(200).json({
        success: "SUCCESS",
        data: { cart: updatedCart },
        message: "Product removed from cart successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error removing product from cart: ${error.message}`, 500));
    }
  }

  async updateAddressInCart(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));
    try {
      const { userId, addressId, addressType } = req.body;

      if (!userId || !addressId || !addressType) {
        return res.status(400).json({
          success: "FAILED",
          message: "User ID, Address ID, and Address Type are required.",
        });
      }

      // Query to find the most recent cart for the user
      const cart = await prisma.cart.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      if (!cart) {
        return res.status(404).json({
          success: "FAILED",
          message: "No cart found for the given user.",
        });
      }

      // Fetch the existing address
      const address = await prisma.address.findUnique({
        where: { id: addressId },
      });

      if (!address) {
        return res.status(404).json({
          success: "FAILED",
          message: "Address not found.",
        });
      }

      // Update the cart with address information
      // Note: Since the Prisma schema doesn't have billingAddress and shippingAddress fields,
      // we'll need to modify the schema or store this information differently
      // For now, we'll assume we're adding this as a JSON field

      const updatedCart = await prisma.cart.update({
        where: { id: cart.id },
        data: {
          // This is a placeholder - you'll need to modify your schema to support addresses
          // or store them as JSON in a new field
          updatedAt: new Date(),
        },
        include: {
          items: true,
          user: true,
        },
      });

      return res.status(200).json({
        success: "SUCCESS",
        data: { cart: updatedCart },
        message: `${addressType} address updated successfully.`,
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating address in cart: ${error.message}`, 500));
    }
  }

  // Discount-related methods

  async addDiscount(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));
    try {
      const {
        name,
        description,
        code,
        showOnCheckout,
        storeId,
        products,
        discountType,
        value,
        minOrderAmount,
        maxDiscountAmount,
        expiryDate,
        customerUsageLimit,
        include,
        exclude,
        active,
        limited,
      } = req.body;

      // If the discount is limited, customerUsageLimit must be provided
      if (limited && (!customerUsageLimit || customerUsageLimit <= 0)) {
        return res.status(400).json({
          success: "FAILED",
          message: "For limited discounts, customerUsageLimit must be greater than 0.",
        });
      }

      // Validate include/exclude (they must be arrays if provided)
      if (include && !Array.isArray(include)) {
        return res.status(400).json({
          success: "FAILED",
          message: "Include must be an array.",
        });
      }

      if (exclude && !Array.isArray(exclude)) {
        return res.status(400).json({
          success: "FAILED",
          message: "Exclude must be an array.",
        });
      }

      // Check if discount code already exists
      // Note: This assumes you have a Discount model in your Prisma schema
      // You'll need to add this model to your schema
      const existingDiscount = await prisma.discount.findUnique({
        where: { code },
      });

      if (existingDiscount) {
        return res.status(400).json({
          success: "FAILED",
          message: "Discount code already exists.",
        });
      }

      // Create discount object
      const newDiscount = await prisma.discount.create({
        data: {
          name,
          description: description || "",
          code,
          showOnCheckout,
          storeId: storeId || null,
          products: products || [],
          discountType,
          value,
          minOrderAmount: minOrderAmount || 0,
          maxDiscountAmount: maxDiscountAmount || null,
          expiryDate: new Date(expiryDate),
          customerUsageLimit: limited ? customerUsageLimit : null,
          include: include || [],
          exclude: exclude || [],
          active: active !== undefined ? active : true,
          limited,
          createdAt: new Date(),
        },
      });

      return res.status(201).json({
        success: "SUCCESS",
        data: { newDiscount },
        message: "Discount added successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error adding discount: ${error.message}`, 500));
    }
  }

  async deleteDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.params;

      if (!code) {
        return res.status(400).json({
          success: "FAILED",
          message: "Discount code is required.",
        });
      }

      // Check if discount exists
      const discount = await prisma.discount.findUnique({
        where: { code },
      });

      if (!discount) {
        return res.status(404).json({
          success: "FAILED",
          message: "Discount not found.",
        });
      }

      // Delete discount
      await prisma.discount.delete({
        where: { code },
      });

      return res.status(200).json({
        success: "SUCCESS",
        deletedDiscount: discount,
        message: "Discount deleted successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error deleting discount: ${error.message}`, 500));
    }
  }

  async fetchDiscounts(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: "FAILED",
          message: "User ID is required.",
        });
      }

      const cart = await prisma.cart.findFirst({
        where: {
          userId,
          status: CartStatus.ACTIVE,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          items: true,
        },
      });

      if (!cart) {
        return res.status(404).json({
          success: "FAILED",
          message: "No active cart found for the user.",
        });
      }

      const { totalPrice, items } = cart;

      if (!totalPrice || !items || items.length === 0) {
        return res.status(400).json({
          success: "FAILED",
          message: "Cart has missing data (total amount or products).",
        });
      }

      const productIds = items.map((item) => item.productId);
      const currentDate = new Date();

      // Fetch valid discounts
      const discounts = await prisma.discount.findMany({
        where: {
          active: true,
          expiryDate: {
            gte: currentDate,
          },
          OR: [
            {
              minOrderAmount: {
                lte: totalPrice,
              },
            },
            {
              minOrderAmount: null,
            },
          ],
        },
      });

      // Filter applicable discounts
      const applicableDiscounts = discounts.filter((discount) => {
        const { include, exclude } = discount;

        // Check if any included products are in the cart
        if (include && include.length > 0) {
          const hasIncludedProduct = include.some((p) => productIds.includes(p));
          if (!hasIncludedProduct) return false;
        }

        // Check if any excluded products are in the cart
        if (exclude && exclude.length > 0) {
          const hasExcludedProduct = exclude.some((p) => productIds.includes(p));
          if (hasExcludedProduct) return false;
        }

        return true;
      });

      return res.status(200).json({
        success: "SUCCESS",
        discounts: applicableDiscounts,
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching discounts: ${error.message}`, 500));
    }
  }

  async fetchDiscountsByStore(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;

      if (!storeId) {
        return res.status(400).json({
          success: "FAILED",
          message: "Missing storeId parameter.",
        });
      }

      // Fetch discounts where storeId matches or is global (null)
      const discounts = await prisma.discount.findMany({
        where: {
          OR: [{ storeId }, { storeId: null }],
        },
      });

      return res.status(200).json({
        success: "SUCCESS",
        data: discounts,
        message: "Discounts fetched successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching discounts: ${error.message}`, 500));
    }
  }

  async updateDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, ...updateFields } = req.body;

      if (!code) {
        return res.status(400).json({
          success: "FAILED",
          message: "Discount code is required.",
        });
      }

      // Check if discount exists
      const existingDiscount = await prisma.discount.findUnique({
        where: { code },
      });

      if (!existingDiscount) {
        return res.status(404).json({
          success: "FAILED",
          message: "Discount not found.",
        });
      }

      // Remove undefined fields
      const updateData: any = {};
      Object.entries(updateFields).forEach(([key, val]) => {
        if (val !== undefined) updateData[key] = val;
      });

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: "FAILED",
          message: "No valid fields to update.",
        });
      }

      updateData.updatedAt = new Date();

      // Update discount
      await prisma.discount.update({
        where: { code },
        data: updateData,
      });

      return res.status(200).json({
        success: "SUCCESS",
        message: "Discount updated successfully.",
        data: updateData,
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating discount: ${error.message}`, 500));
    }
  }

  async applyDiscountToCart(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));
    try {
      const { userId, discountCode } = req.body;

      if (!userId || !discountCode) {
        return res.status(400).json({
          success: "FAILED",
          message: "User ID and Discount Code are required.",
        });
      }

      // Find active cart
      const cart = await prisma.cart.findFirst({
        where: {
          userId,
          status: CartStatus.ACTIVE,
        },
        include: {
          items: true,
        },
      });

      if (!cart) {
        return res.status(404).json({
          success: "FAILED",
          message: "No active cart found for this user.",
        });
      }

      // Find valid discount
      const currentDate = new Date();
      const discount = await prisma.discount.findFirst({
        where: {
          code: discountCode,
          active: true,
          expiryDate: {
            gte: currentDate,
          },
          OR: [
            {
              minOrderAmount: {
                lte: cart.totalPrice,
              },
            },
            {
              minOrderAmount: null,
            },
          ],
        },
      });

      if (!discount) {
        return res.status(400).json({
          success: "FAILED",
          message: "Invalid or expired discount code.",
        });
      }

      // Calculate discount amount
      let discountAmount = 0;
      if (discount.discountType === DiscountType.PERCENTAGE) {
        discountAmount = (discount.value / 100) * cart.totalPrice;
      } else if (discount.discountType === DiscountType.FIXED) {
        discountAmount = discount.value;
      }

      // Apply maximum discount limit if specified
      if (discount.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, discount.maxDiscountAmount);
      }

      // Update cart with discount
      const updatedCart = await prisma.cart.update({
        where: { id: cart.id },
        data: {
          totalPrice: cart.totalPrice - discountAmount,
          updatedAt: new Date(),
        },
        include: {
          items: true,
          user: true,
        },
      });

      return res.status(200).json({
        success: "SUCCESS",
        data: {
          cart: updatedCart,
          appliedDiscount: {
            code: discount.code,
            type: discount.discountType,
            value: discount.value,
            discountAmount,
          },
        },
        message: "Discount applied successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error applying discount: ${error.message}`, 500));
    }
  }
}
