export interface InventoryStats {
  totalProducts: number;
  inStock: number;
  outOfStock: number;
  lowStock: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}
