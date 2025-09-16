import { ERPNextClient } from "./client";
import { ErpSyncService } from "./erpSyncService";
import prisma from "../../service/prisma";
import { OrderStatus, ProductStatus } from "@prisma/client";
import { SourceKey } from "../../controllers/authController";

export class ERPSyncService {
  private static instances: Map<string, ErpSyncService> = new Map();

  static async getInstance(storeId: string): Promise<ErpSyncService> {
    if (!this.instances.has(storeId)) {
      const store = await prisma.store.findUnique({
        where: { id: storeId },
        include: { StoreErpNext: true },
      });

      if (!store?.StoreErpNext?.[0]) {
        throw new Error ("ERP configuration not found for store");
      }

      const erpConfig = store.StoreErpNext[0];
      const instance = new ErpSyncService({
        storeId,
        tables: [], // Will be set per operation
        batchSize: 50,
      });

      this.instances.set(storeId, instance);
    }
    return this.instances.get(storeId)!;
  }

  static async syncAll(storeId: string) {
    const service = await this.getInstance(storeId);
    return service.syncTables(["products", "customers", "orders"]);
  }

  static async syncProductsToERP(storeId: string, productIds?: string[]) {
    const service = await this.getInstance(storeId);
    
    if (productIds) {
      const products = await prisma.product.findMany({
        where: { id: { in: productIds }, storeId },
      });
      return Promise.all(products.map(product => 
        service.syncProductToERP(product)
      ));
    }
    
    return service.syncProducts();
  }

  static async syncOrdersToERP(storeId: string, orderIds?: string[]) {
    const service = await this.getInstance(storeId);
    
    if (orderIds) {
      const orders = await prisma.order.findMany({
        where: { id: { in: orderIds }, storeId },
        include: { orderItems: true, shippingAddress: true, billingAddress: true }
      });
      return Promise.all(orders.map(order => 
        service.syncOrderToERP(order)
      ));
    }
    
    return service.syncOrders();
  }

  static async handleERPWebhook(storeId: string, payload: any) {
    const service = await this.getInstance(storeId);
    const { doctype, name, action } = payload;
    
    switch (doctype) {
      case 'Item':
        return service.handleProductUpdateFromERP(name, payload);
      case 'Sales Order':
        return service.handleOrderUpdateFromERP(name, payload);
      case 'Delivery Note':
        return service.handleDeliveryUpdateFromERP(name, payload);
      default:
        throw new Error(`Unsupported ERP doctype: ${doctype}`);
    }
  }
}
