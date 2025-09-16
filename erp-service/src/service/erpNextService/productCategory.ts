// services/product-category.service.ts
import { ERPNextClient } from "./client";
import { ProductCategory, ERPNextItemGroup, SyncResult, ERPNextResponse } from "./types";

export class ProductCategoryService {
  constructor(private erpClient: ERPNextClient) {}

  async createProductCategory(categoryData: ProductCategory): Promise<ERPNextResponse<ERPNextItemGroup>> {
    const erpCategoryData: ERPNextItemGroup = {
      doctype: "Item Group",
      item_group_name: categoryData.name,
      parent_item_group: categoryData.parent_category || "All Item Groups",
      is_group: categoryData.is_group ? 1 : 0,
      image: categoryData.image,
      custom_external_id: categoryData.id,
    };

    return await this.erpClient.create<ERPNextItemGroup>("Item Group", erpCategoryData);
  }

  async updateProductCategory(categoryName: string, categoryData: ProductCategory): Promise<ERPNextResponse<ERPNextItemGroup>> {
    const erpCategoryData: Partial<ERPNextItemGroup> = {
      item_group_name: categoryData.name,
      parent_item_group: categoryData.parent_category || "All Item Groups",
      is_group: categoryData.is_group ? 1 : 0,
      image: categoryData.image,
    };

    return await this.erpClient.update<ERPNextItemGroup>("Item Group", categoryName, erpCategoryData);
  }

  async syncAllProductCategories(categories: ProductCategory[]): Promise<SyncResult[]> {
    const results: SyncResult[] = [];

    for (const category of categories) {
      try {
        const existingCategory = await this.erpClient.findByExternalId<ERPNextItemGroup>("Item Group", category.id);

        if (existingCategory) {
          results.push({ item: category.name, action: "exists", success: true });
        } else {
          const result = await this.createProductCategory(category);
          results.push({ item: category.name, action: "created", success: true, data: result });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        results.push({ item: category.name, action: "failed", success: false, error: errorMessage });
      }
    }

    return results;
  }
}
