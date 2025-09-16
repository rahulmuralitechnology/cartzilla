// services/order.service.ts
import { ERPNextClient } from "./client";
import { Order, ERPNextSalesOrder, SyncResult, ERPNextResponse } from "./types";

export class OrderService {
  constructor(private erpClient: ERPNextClient) {}

  async createOrder(orderData: Order): Promise<ERPNextResponse<ERPNextSalesOrder>> {
    const erpOrderData: ERPNextSalesOrder = {
      doctype: "Sales Order",
      customer: orderData.customer_name || orderData.customer_id,
      order_date: orderData.order_date.toISOString().split("T")[0],
      delivery_date: orderData.delivery_date?.toISOString().split("T")[0],
      currency: orderData.currency,
      items: orderData.items.map((item) => ({
        item_code: item.item_code,
        item_name: item.item_name,
        description: item.description,
        qty: item.qty,
        rate: item.rate,
        amount: item.amount,
        uom: item.uom || "Nos",
      })),
      total_qty: orderData.total_qty,
      total: orderData.total,
      taxes_and_charges_template: orderData.taxes_and_charges_template,
      total_taxes_and_charges: orderData.tax_amount,
      grand_total: orderData.grand_total,
      customer_address: orderData.billing_address,
      shipping_address_name: orderData.shipping_address,
      // contact_person: orderData.contact_person,
      custom_external_id: orderData.id,
    };

    return await this.erpClient.create<ERPNextSalesOrder>("Sales Order", erpOrderData);
  }

  async updateOrder(orderName: string, orderData: Order): Promise<ERPNextResponse<ERPNextSalesOrder>> {
    const erpOrderData: Partial<ERPNextSalesOrder> = {
      customer: orderData.customer_name || orderData.customer_id,
      order_date: orderData.order_date.toISOString().split("T")[0],
      delivery_date: orderData.delivery_date?.toISOString().split("T")[0],
      currency: orderData.currency,
      items: orderData.items.map((item) => ({
        item_code: item.item_code,
        item_name: item.item_name,
        description: item.description,
        qty: item.qty,
        rate: item.rate,
        amount: item.amount,
        uom: item.uom || "Nos",
      })),
      total_qty: orderData.total_qty,
      total: orderData.total,
      taxes_and_charges_template: orderData.taxes_and_charges_template,
      total_taxes_and_charges: orderData.tax_amount,
      grand_total: orderData.grand_total,
      customer_address: orderData.billing_address,
      shipping_address_name: orderData.shipping_address,
      contact_person: orderData.contact_person,
    };

    return await this.erpClient.update<ERPNextSalesOrder>("Sales Order", orderName, erpOrderData);
  }

  async findOrderByExternalId(id: string){
    const existingOrder = await this.erpClient.findByExternalId<ERPNextSalesOrder>("Sales Order", id);
    return existingOrder
  }

  async updateOrderStatus( name: string, data: any){
    const existingOrder = await this.erpClient.get<ERPNextSalesOrder>("Sales Order", name);
    if (existingOrder.data.status === 'Draft') {
    await this.erpClient.submitDoc('Sales Order', name);
    }
    else {
    const action = data.Status === "PACKED" ? "Pack" : data.Status === "SHIPPED" ? "Ship" : data.Status === "DELIVERED" ? "Deliver" : data.Status === "CANCELLED" ? "Cancel" : data.Status;
    const updateOrder = await this.erpClient.action<ERPNextSalesOrder>(existingOrder.data, action);
    return updateOrder
    }

  }
  async syncAllOrders(orders: Order[]): Promise<SyncResult[]> {
    const results: SyncResult[] = [];

    for (const order of orders) {
      try {
        const existingOrder = await this.erpClient.findByExternalId<ERPNextSalesOrder>("Sales Order", order.id);

        if (existingOrder) {
          results.push({ item: `Order ${order.id}`, action: "exists", success: true });
        } else {
          const result = await this.createOrder(order);
          results.push({ item: `Order ${order.id}`, action: "created", success: true, data: result });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        results.push({ item: `Order ${order.id}`, action: "failed", success: false, error: errorMessage });
      }
    }

    return results;
  }

  async createPayment(orderId: string, party: string, paymentData: {
    paymentId: string;
    amount: number;
    currency: string;
    source_exchange_rate: number;
    paymentMethod: string;
    status: string;
    date: Date;
  }): Promise<ERPNextResponse<any>> {
    const postingDate = paymentData.date.toISOString().split("T")[0];

    const erpPaymentData = {
      doctype: "Payment Entry",
      payment_type: "Receive",
      party_type: "Customer",
      party: party, // Customer ID in ERPNext
      paid_from: "Debtors - A",                // ✅ Account from which money is received
      paid_from_account_currency: paymentData.currency, // ✅ Currency of 'paid_from' account
      paid_to: "Bank Account - A",                     // ✅ Account where money is deposited
      paid_to_account_currency: paymentData.currency,   // ✅ Currency of 'paid_to' account
      paid_amount: paymentData.amount,
      received_amount: paymentData.amount,
      reference_no: paymentData.paymentId,
      reference_date: postingDate,
      mode_of_payment: paymentData.paymentMethod,
      company: "Alazka",
      posting_date: postingDate,
      currency: paymentData.currency,
      source_exchange_rate: paymentData.source_exchange_rate,
      target_exchange_rate: paymentData.source_exchange_rate,
      references: [{
        reference_doctype: "Sales Order",
        reference_name: orderId,
        allocated_amount: paymentData.amount
      }]
    };

    return await this.erpClient.create("Payment Entry", erpPaymentData);
  }

  async syncOrderWithPayment(order: Order, paymentData?: {
    paymentId: string;
    amount: number;
    currency: string;
    source_exchange_rate: number;
    paymentMethod: string;
    status: string;
    date: Date;
  }) {
    try {
      // First sync the order
      const orderResult = await this.createOrder(order);

      // If payment data is provided, sync payment
      if (paymentData) {
        const paymentResult = await this.createPayment(
          orderResult.data.name || order.id,
          order.customer_id,
          paymentData
        );

        return {
          order: orderResult,
          payment: paymentResult
        };
      }

      return { order: orderResult };
    } catch (error) {
      console.error("Error syncing order with payment:", error);
      throw error;
    }
  }
}
