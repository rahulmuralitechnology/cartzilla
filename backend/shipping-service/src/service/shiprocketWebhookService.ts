// services/webhook.service.ts
import { WebhookPayload, OrderStatus, TrackingEvent } from "./interface/shiprocketType";
import { EventEmitter } from "events";

export class WebhookService extends EventEmitter {
  private orderStatusMap: Map<string, OrderStatus> = new Map();

  constructor() {
    super();
  }

  processWebhook(payload: WebhookPayload): OrderStatus {
    const orderStatus: OrderStatus = {
      orderId: payload.order_id,
      shipmentId: payload.shipment_id,
      awbCode: payload.awb,
      courierName: payload.courier,
      status: payload.status,
      statusCode: payload.shipment_status_id,
      currentStatus: payload.current_status,
      deliveredDate: payload.delivered_date,
      rtoInitiatedDate: payload.rto_initiated_date,
      rtoDeliveredDate: payload.rto_delivered_date,
      pickupDate: payload.pickup_date,
      trackingData: payload.track || [],
      lastUpdated: new Date(),
    };

    // Store the updated status
    this.orderStatusMap.set(payload.order_id, orderStatus);

    // Emit event for real-time updates
    this.emit("statusUpdate", orderStatus);

    // Log the status update
    console.log(`Order ${payload.order_id} status updated to: ${payload.current_status}`);

    return orderStatus;
  }

  getOrderStatus(orderId: string): OrderStatus | undefined {
    return this.orderStatusMap.get(orderId);
  }

  getAllOrderStatuses(): OrderStatus[] {
    return Array.from(this.orderStatusMap.values());
  }

  // Method to send email notifications based on status
  async sendStatusNotification(orderStatus: OrderStatus): Promise<void> {
    try {
      const { orderId, currentStatus, courierName, awbCode } = orderStatus;

      // Email template based on status
      const emailTemplates = {
        SHIPPED: `Your order ${orderId} has been shipped via ${courierName}. AWB: ${awbCode}`,
        "IN TRANSIT": `Your order ${orderId} is in transit. Track with AWB: ${awbCode}`,
        "OUT FOR DELIVERY": `Your order ${orderId} is out for delivery. Expect delivery today!`,
        DELIVERED: `Great news! Your order ${orderId} has been delivered successfully.`,
        "RTO INITIATED": `Your order ${orderId} return process has been initiated.`,
        "RTO DELIVERED": `Your order ${orderId} has been returned to the seller.`,
        CANCELLED: `Your order ${orderId} has been cancelled.`,
      };

      const message = emailTemplates[currentStatus as keyof typeof emailTemplates];

      if (message) {
        // Here you would integrate with your email service (SendGrid, SES, etc.)
        console.log(`Email notification sent for order ${orderId}: ${message}`);

        // Example integration with nodemailer or any email service
        // await this.emailService.send({
        //   to: customerEmail,
        //   subject: `Order Update - ${orderId}`,
        //   text: message
        // });
      }
    } catch (error) {
      console.error("Failed to send status notification:", error);
    }
  }
}
