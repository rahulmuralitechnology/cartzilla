import { ERPNextClient } from "./client";
import { Product, ERPNextItem, SyncResult } from "./types";
import { ERPNextResponse } from "./types";

export class ProductService {
  constructor(private erpClient: ERPNextClient) {}

  async createProduct(productData: Product): Promise<ERPNextResponse<ERPNextItem>> {
    const erpProductData: ERPNextItem = {
      doctype: "Item",
      item_code: productData.item_code || productData.name.replace(/[^a-zA-Z0-9]/g, "-").toUpperCase(),
      item_name: productData.name,
      description: productData.description,
      item_group: productData.item_group,
      stock_uom: productData.stock_uom,
      is_stock_item: productData.is_stock_item ? 1 : 0,
      is_sales_item: productData.is_sales_item ? 1 : 0,
      is_purchase_item: productData.is_purchase_item ? 1 : 0,
      standard_rate: productData.standard_rate,
      image: productData.image,
      brand: productData.brand,
      manufacturer: productData.manufacturer,
      weight_per_unit: productData.weight_per_unit,
      weight_uom: productData.weight_uom,
      custom_external_id: productData.id,
      gst_hsn_code: productData.hsnCode || "",
    };

    return await this.erpClient.create<ERPNextItem>("Item", erpProductData);
  }

  async updateProduct(productName: string, productData: Product): Promise<ERPNextResponse<ERPNextItem>> {
    const erpProductData: Partial<ERPNextItem> = {
      item_name: productData.name,
      description: productData.description,
      item_group: productData.item_group,
      stock_uom: productData.stock_uom,
      is_stock_item: productData.is_stock_item ? 1 : 0,
      is_sales_item: productData.is_sales_item ? 1 : 0,
      is_purchase_item: productData.is_purchase_item ? 1 : 0,
      standard_rate: productData.standard_rate,
      image: productData.image,
      brand: productData.brand,
      manufacturer: productData.manufacturer,
      weight_per_unit: productData.weight_per_unit,
      weight_uom: productData.weight_uom,
    };

    return await this.erpClient.update<ERPNextItem>("Item", productName, erpProductData);
  }

  async syncAllProducts(products: Product[]): Promise<SyncResult[]> {
    const results: SyncResult[] = [];

    for (const product of products) {
      try {
        const existingProduct = await this.erpClient.findByExternalId<ERPNextItem>("Item", product.id);

        if (existingProduct) {
          results.push({ item: product.name, action: "exists", success: true });
        } else {
          const result = await this.createProduct(product);
          results.push({ item: product.name, action: "created", success: true, data: result });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        results.push({ item: product.name, action: "failed", success: false, error: errorMessage });
      }
    }

    return results;
  }

  async createHSNCodeIfNotExists(hsnData: {
    hsn_code: string;
    description: string;
    tax_rate: number;
  }): Promise<ERPNextResponse<any>> {
    try {
      try {
    const exists = await this.erpClient.get(
      "GST HSN Code",
      hsnData.hsn_code
    );
    return { 
      data: {}, // Empty object or null
      message: "HSN code already exists" 
    };
  }
  catch (error) {
    return await this.erpClient.create("GST HSN Code", {
        hsn_code: hsnData.hsn_code,
        description: hsnData.description,
        tax_rate: hsnData.tax_rate
      });
    }
  } catch (error: any) {
    if (error.message.includes('Authentication Failed')) {
      console.error('ERPNext Authentication Error - Skipping HSN Code creation');
      return { 
        data: {}, // Empty object or null
        message: "Skipped due to authentication error" 
      };
    }
    console.error("Error in createHSNCodeIfNotExists:", error);
    throw error;
  }
  }

  async createItemGroupIfNotExists(itemGroupData: {
    name: string;
    parent_item_group: string;
  }): Promise<ERPNextResponse<any>> {
    try {
      try{
        const existingGroup = await this.erpClient.get(
        "Item Group", itemGroupData.name
      );
      return { data: existingGroup, message: "Item group already exists" };
      }
      catch (error) {
        return await this.erpClient.create("Item Group", {
          item_group_name: itemGroupData.name,
          parent_item_group: itemGroupData.parent_item_group,
          is_group: 0
        });
      }
    } catch (error) {
      console.error("Error in createItemGroupIfNotExists:", error);
      throw error;
    }
  }
}
