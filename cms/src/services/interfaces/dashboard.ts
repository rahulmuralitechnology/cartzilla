export interface DashboardStats {
  totalClients: number;
  storesPerClient: Array<{ username: string; numberOfStores: number; numberOfProducts: number }>;
  totalProducts: number;
  totalOrders?: number;
  totalCategories: number;
  storeCount: number;
  clientGrowthData: { month: string; count: number }[];
  totalStores: any;
  totalOrderRevenue?: number;
  deliveredOrderCount?: number;
}
