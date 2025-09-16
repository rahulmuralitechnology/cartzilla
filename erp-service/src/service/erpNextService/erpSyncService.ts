import { ERPNextClient } from "./client";
import prisma from "../prisma";
import { ProductService } from "./productService";
import { ProductCategoryService } from "./productCategory";
import { OrderService } from "./orderService";
import { OrderStatus, ProductStatus } from "@prisma/client";
import { SourceKey } from "../../controllers/authController";
import { UserRole } from "@prisma/client";
import { ERPNextCustomerService } from "./customerService";
import { AddressService } from "./addressService";
import { Address, ERPNextAddress, SyncResult } from "./types";

export interface SyncConfig {
  storeId: string;
  tables: string[];
  batchSize?: number;
}

export class ErpSyncService {
  private erpClient: ERPNextClient | null = null;
  private storeId: string;
  private batchSize: number;
  public getErpConfig: any;

  constructor(config: SyncConfig) {
    this.storeId = config.storeId;
    this.batchSize = config.batchSize || 100;
  }

  public async initializeERPClient() {
    try {
      const store = await prisma.store.findUnique({
        where: { id: this.storeId },
        include: { StoreErpNext: true },
      });

      if (!store?.StoreErpNext?.[0]) {
        throw new Error("ERP configuration not found for store");
      }

      const erpConfig = store.StoreErpNext[0];
      this.getErpConfig = erpConfig;
      this.erpClient = new ERPNextClient({
        apiKey: erpConfig.apiKey,
        baseUrl: erpConfig.baseUrl,
        apiSecret: erpConfig.apiSecret,
        defaultCustomerGroup: store.name!,
        defaultTerritory: store.name!,
      });
    } catch (error: any) {
      throw new Error(`Failed to initialize ERP client: ${error.message}`);
    }
  }

  public async syncProducts() {
    try {
      const products = await prisma.product.findMany({
        where: { storeId: this.storeId },
        take: this.batchSize,
        orderBy: { createdAt: "desc" },
      });

      if (!this.erpClient) throw new Error("ERP client not initialized");
      const productService = new ProductService(this.erpClient);

      await Promise.all(
        products.map((product) =>
          productService.createProduct({
            item_code: product.id!,
            name: product.title!,
            description: product.description,
            item_group: product.category!,
            stock_uom: product.umo!,
            standard_rate: product.price!,
            image: product.images?.[0],
            brand: "",
            id: product.id,
          })
        )
      );

      return products.length;
    } catch (error: any) {
      throw new Error(`Failed to sync products: ${error.message}`);
    }
  }

  private async syncProductCategories() {
    try {
      const categories = await prisma.productCategory.findMany({
        where: { storeId: this.storeId },
        take: this.batchSize,
        orderBy: { createdAt: "desc" },
      });

      if (!this.erpClient) throw new Error("ERP client not initialized");
      const categoryService = new ProductCategoryService(this.erpClient);

      await Promise.all(
        categories.map((category) =>
          categoryService.createProductCategory({
            name: category.name!,
            image: category.categoryImage || "",
            id: category.id,
          })
        )
      );

      return categories.length;
    } catch (error: any) {
      throw new Error(`Failed to sync product categories: ${error.message}`);
    }
  }

  private async syncCustomers() {
    try {
      const customers = await prisma.user.findMany({
        where: { storeId: this.storeId, role: UserRole.CUSTOMER, source: SourceKey.Template },
        take: this.batchSize,
        orderBy: { createdAt: "desc" },
      });

      if (!this.erpClient) throw new Error("ERP client not initialized");
      const customerService = new ERPNextCustomerService(this.getErpConfig);

      await Promise.all(
        customers.map((customer) =>
          customerService.createCustomer({
            name: customer.username!,
            group: customer.source!,
            mobile: customer.phone!,
            email: customer.email!,
            id: customer.id,
          })
        )
      );
      return customers.length;
    } catch (error: any) {
      throw new Error(`Failed to sync customers: ${error.message}`);
    }
  }

  public async syncOrders() {
    // Implement order sync logic here
    throw new Error("Order sync not implemented yet");
  }

  public async syncTables(tables: string[]) {
    try {
      await this.initializeERPClient();
      const results: Record<string, any> = {};

      for (const table of tables) {
        switch (table.toLowerCase()) {
          case "products":
            results.products = await this.syncProducts();
            break;
          case "categories":
            results.categories = await this.syncProductCategories();
            break;
          case "customers":
            results.customers = await this.syncCustomers();
            break;
          case "orders":
            results.orders = await this.syncOrders();
            break;
          case "hsn-codes":
            results.hsnCodes = await this.syncHsnCodes();
            break;
          case "addresses":
            results.addresses = await this.syncAddresses();
            break;
          default:
            throw new Error(`Unsupported table type: ${table}`);
        }
      }

      return results;
    } catch (error: any) {
      throw new Error(`Sync failed: ${error.message}`);
    }
  }

  async syncProductToERP(product: any) {
    await this.initializeERPClient();
    if (!this.erpClient) throw new Error("ERP client not initialized");

    const productService = new ProductService(this.erpClient);
    return productService.createProduct({
      item_code: product.id,
      name: product.title,
      description: product.description,
      item_group: product.category || "Products",
      stock_uom: product.umo || "Nos",
      standard_rate: product.price || 0,
      image: product.images?.[0],
      brand: product.brand || "",
      id: product.id,
    });
  }

  async syncOrderToERP(order: any) {
    await this.initializeERPClient();
    if (!this.erpClient) throw new Error("ERP client not initialized");

    const orderService = new OrderService(this.erpClient);
    return orderService.createOrder({
      customer_name: order.shippingAddress?.name,
      customer_id: order.userId,
      order_date: order.orderDate,
      delivery_date: new Date(new Date(order.orderDate).getTime() + 5 * 24 * 60 * 60 * 1000),
      currency: "INR",
      items: order.orderItems.map((item: any) => ({
        item_code: item.productId,
        item_name: item.productName,
        description: item.productName,
        qty: item.quantity,
        rate: item.price,
        amount: item.totalPriceWithGST,
        uom: "Nos",
      })),
      total_qty: order.orderItems.length,
      total: order.totalAmount,
      taxes_and_charges_template: "0",
      tax_amount: 0,
      grand_total: order.totalAmount,
      billing_address: `${order.billingAddress?.name}-${order.billingAddress?.addressType}`,
      shipping_address: `${order.shippingAddress?.name}-${order.shippingAddress?.addressType}`,
      contact_person: order.shippingAddress?.phone,
      status: order.status,
      id: order.id,
    });
  }

  async handleProductUpdateFromERP(erpItemName: string, payload: any) {
    await this.initializeERPClient();
    if (!this.erpClient) throw new Error("ERP client not initialized");

    // Get full item details from ERPNext
    const erpItem = await this.erpClient.get<any>("Item", erpItemName);
    
    // Find matching product in bloomi5
    const product = await prisma.product.findFirst({
      where: { 
        OR: [
          { id: erpItem.data.custom_external_id },
          { hsnCode: erpItem.data.gst_hsn_code }
        ],
        storeId: this.storeId
      }
    });

    if (!product) {
      throw new Error("Product not found in bloomi5");
    }

    // Check for conflicts (if bloomi5 has more recent updates)
    if (product.updatedAt > new Date(erpItem.data.modified)) {
      throw new Error("Conflict: bloomi5 has more recent version");
    }

    // Update product in bloomi5
    return prisma.product.update({
      where: { id: product.id },
      data: {
        title: erpItem.data.item_name,
        description: erpItem.data.description,
        price: erpItem.data.standard_rate,
        stock: erpItem.data.actual_qty || 0,
        status: erpItem.data.disabled ? ProductStatus.ARCHIVED : ProductStatus.PUBLISHED,
        updatedAt: new Date(erpItem.data.modified),
      }
    });
  }

  async handleOrderUpdateFromERP(erpOrderName: string, payload: any) {
    await this.initializeERPClient();
    if (!this.erpClient) throw new Error("ERP client not initialized");

    const erpOrder = await this.erpClient.get<any>("Sales Order", erpOrderName);
    const orderId = erpOrder.data.custom_external_id;

    if (!orderId) {
      throw new Error("Order ID not found in ERP data");
    }

    // Map ERPNext status to bloomi5 status
    const statusMap: Record<string, OrderStatus> = {
      "Packed": OrderStatus.PACKED,
      "Shipped": OrderStatus.SHIPPED,
      "Delivered": OrderStatus.DELIVERED,
      "Cancelled": OrderStatus.CANCELLED,
    };

    return prisma.order.update({
      where: { id: orderId },
      data: {
        status: payload.action ? statusMap[payload.data.workflow_state] || OrderStatus.PROCESSING : statusMap[erpOrder.data.status] || OrderStatus.PROCESSING,
      }
    });
  }

  async handleDeliveryUpdateFromERP(erpDeliveryName: string, payload: any) {
    await this.initializeERPClient();
    if (!this.erpClient) throw new Error("ERP client not initialized");

    const erpDelivery = await this.erpClient.get<any>("Delivery Note", erpDeliveryName);
    const orderId = erpDelivery.data.custom_external_id;

    if (!orderId) {
      throw new Error("Order ID not found in ERP delivery data");
    }

    return prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.DELIVERED,
        // deliveredAt: new Date(erpDelivery.data.posting_date),
      }
    });
  }
   async syncHsnCodes() {
    try {
      if (!this.erpClient) throw new Error("ERP client not initialized");
      const productService = new ProductService(this.erpClient);

      // Get all products with HSN codes from the database
      const products = await prisma.product.findMany({
        where: { 
          storeId: this.storeId,
          hsnCode: { not: null }
        },
        select: {
          hsnCode: true,
          gstRate: true
        },
        distinct: ['hsnCode']
      });

      // Sync each unique HSN code
      const results = [];
      for (const product of products) {
        if (!product.hsnCode) continue;

        try {
          const result = await productService.createHSNCodeIfNotExists({
            hsn_code: product.hsnCode,
            description: `HSN Code ${product.hsnCode}`,
            tax_rate: product.gstRate || 0
          });

          results.push({
            hsnCode: product.hsnCode,
            success: true,
            action: result.message?.includes('already exists') ? 'exists' : 'created',
            message: result.message
          });
        } catch (error) {
          results.push({
            hsnCode: product.hsnCode,
            success: false,
            action: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      return results;
    } catch (error: any) {
      throw new Error(`Failed to sync HSN codes: ${error.message}`);
    }
  }

  async syncAddresses() {
    try {
      if (!this.erpClient) throw new Error("ERP client not initialized");
      const addressService = new AddressService(this.erpClient);

      // Get all addresses from the database
      const addresses = await prisma.address.findMany({
        where: { 
          user: { storeId: this.storeId }
        },
        include: {
          user: true
        }
      });

      const erpAddresses: Address[] = addresses.map(address => ({
        id: address.id,
        address_title: address.name || `${address.city} Address`,
        address_type: this.mapAddressType(address.addressType),
        address_line1: address.line1,
        address_line2: address.line2 || '',
        city: address.city,
        state: address.state,
        country: address.country,
        pincode: address.zip,
        phone: address.phone,
        email_id: address.user.email,
        is_primary_address: address.isDefault,
        is_shipping_address: address.addressType !== 'BILLING',
        linked_doctype: 'Customer',
        linked_name: address.user.username || address.user.email,
        custom_external_id: address.id,
        created_at: address.createdAt,
        updated_at: address.updatedAt
      }));

      return await addressService.syncAllAddresses(erpAddresses);
    } catch (error: any) {
      throw new Error(`Failed to sync addresses: ${error.message}`);
    }
  }

  // Helper method to map address types
  private mapAddressType(addressType?: string | null): "Billing" | "Shipping" | "Other" {
    if (!addressType) return "Other";

    switch (addressType.toUpperCase()) {
      case 'BILLING':
        return "Billing";
      case 'SHIPPING':
        return "Shipping";
      default:
        return "Other";
    }
  }
}
