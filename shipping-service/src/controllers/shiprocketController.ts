import { Request, Response } from "express";
import { ShiprocketService } from "../service/shiprocketService";
import { CreateOrderRequest } from "../service/interface/shiprocketType";
import { AuthRequest } from "../service/interface";
import { OrderStatus } from "@prisma/client";
import prisma from "../service/prisma";
import config from "../config";

export class ShippingController {
  private shiprocketService: ShiprocketService;

  constructor() {
    this.shiprocketService = new ShiprocketService();
    this.initializeShiprocket();
  }

  private async initializeShiprocket() {
    try {
      await this.shiprocketService.authenticate({
        email: config.appConstant.SHIPROCKET_API_EMMAI,
        password: config.appConstant.SHIPROCKET_API_PASSWORD,
      });
      console.log("Shiprocket authentication successful");
    } catch (error) {
      console.error("Shiprocket authentication failed:", error);
    }
  }

  async createShipment(req: AuthRequest, res: Response) {
    try {
      const orderData: CreateOrderRequest = req.body;

      // Validate required fields
      if (!orderData.order_id || !orderData.billing_customer_name || !orderData.billing_phone) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      const warehouseAddress = await this.shiprocketService.getPickupLocations();
      if (warehouseAddress.length && warehouseAddress[0]?.pickup_location) {
        orderData.pickup_location = warehouseAddress[0]?.pickup_location;
      }
      const result = await this.shiprocketService.createOrder({ ...orderData });

      // Assuming you have a ShippingOrder model to save the order details
      const existShippingOrder = await prisma.shippingOrder.findUnique({ where: { shippingOrderId: result.order_id } });
      if (existShippingOrder) {
        await prisma.shippingOrder.update({
          where: {
            id: existShippingOrder.id,
          },
          data: {
            courierCompanyId: req.body.courierCompanyId,
            onboardingCompletedNow: result.onboarding_completed_now,
            awbCode: result.awb_code,
            courierName: req.body.courierName,
            courierRate: req.body.courierRate,
            status: result.status,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      } else {
        await prisma.shippingOrder.create({
          data: {
            orderId: orderData.order_id as string,
            userId: req.user?.id as string,
            shippingShipmentId: result.shipment_id,
            shippingOrderId: result.order_id,
            courierCompanyId: req.body.courierCompanyId,
            onboardingCompletedNow: result.onboarding_completed_now,
            awbCode: result.awb_code,
            courierName: req.body.courierName,
            courierRate: req.body.courierRate,
            status: result.status,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }

      await prisma.order.update({
        where: { id: orderData.order_id },
        data: {
          status: OrderStatus.SHIPPED,
          trackingNo: String(result.shipment_id),
          deliveryPartner: String(req.body.courierName),
          updatedAt: new Date(),
        },
      });

      res.status(200).json({
        success: true,
        message: "Shipment created successfully",
        data: {
          shiprocket_order_response: result,
        },
      });
    } catch (error: any) {
      console.log("Error creating shipment:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async checkServiceability(req: Request, res: Response) {
    try {
      const { pickupPostcode, deliveryPostcode, weight } = req.body;

      if (!pickupPostcode || !deliveryPostcode || !weight) {
        return res.status(400).json({
          success: false,
          message: "Missing required parameters",
        });
      }

      const result = await this.shiprocketService.checkServiceability(pickupPostcode as string, deliveryPostcode as string, Number(weight));

      res.status(200).json({
        success: true,
        data: {
          available_shipping_companies: result.available_courier_companies,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async trackShipment(req: Request, res: Response) {
    try {
      const { shipmentId } = req.params;
      const result = await this.shiprocketService.trackShipment(shipmentId);

      res.status(200).json({
        success: true,
        data: {
          trackingData: result,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async generateAWB(req: Request, res: Response) {
    try {
      const { shipmentId, courierCompanyId } = req.body;

      if (!shipmentId || !courierCompanyId) {
        return res.status(400).json({
          success: false,
          message: "Missing shipment ID or courier company ID",
        });
      }

      const result = await this.shiprocketService.generateAWB(shipmentId, courierCompanyId);

      res.json({
        success: true,
        message: "AWB generated successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async cancelOrder(req: Request, res: Response) {
    try {
      const { orderIds } = req.body;

      if (!orderIds || !Array.isArray(orderIds)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order IDs",
        });
      }

      const result = await this.shiprocketService.cancelOrder(orderIds);

      res.json({
        success: true,
        message: "Orders cancelled successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getPickupLocations(req: Request, res: Response) {
    try {
      const result = await this.shiprocketService.getPickupLocations();

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
