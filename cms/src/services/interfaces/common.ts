export type ISiteType = "website" | "webapp" | "portfolio";

export interface IResponse {
  success: boolean;
  message?: string;
  error?: string;
  info?: string;
  status?: number;
  // Add other properties as needed based on your API response
}

export enum TemplateType {
  webapp = "webapp",
  website = "website",
  portfolio = "portfolio",
}

export type WebAppType =
  | "ecom_interior_template"
  | "ecom_grocery_template"
  | "ecom_clothing_template"
  | "ecom_electronics_template"
  | "ecom_cosmetics_template";
export type WebsiteType =
  | "website_realestate_template"
  | "website_restaurant_template"
  | "website_interiors_template"
  | "ecom_petstore_template"
  | "landing-page-bloomi5";

export interface IWebsiteType {
  title: string;
  key: ISiteType;
  image: string;
}

export interface ScriptItem {
  name: string;
  content: string;
  injectLocation: string;
}

export interface Discount {
  id?: string;
  name: string;
  description: string;
  code: string;
  showOnCheckout: boolean;
  storeId: string | null;
  products: string[];
  discountType: "percentage" | "fixed";
  value: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  expiryDate: string; // ISO format date
  customerUsageLimit: number | null;
  include: string[];
  exclude: string[];
  active: boolean;
  limited: string;
  createdAt: string;
}

export interface TemplateVersion {
  id: string;
  type: ISiteType;
  storeCategory: WebAppType | WebsiteType;
  repoDirName: string;
  latestVersion: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  totalPrice: number;
  name: string;
  images: string[];
  storeId: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  productName: string;
  productImages: string[];
  price: number;
  createdAt: string; // ISO 8601 date string
}

export interface AbandonedCart {
  id: string;
  userId: string;
  storeId: string;
  items: CartItem[];
  totalCartPrice: number;
  status: string;
  createdAt: string;
  user: any;
}

export interface ActiveCart {
  id: string;
  userId: string;
  storeId: string;
  items: CartItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
  addressId: string;
  updatedAt: string;
  processedAt: string;
  user: any;
}

export interface PendingPaymentOrder {
  id: string;
  userId: string;
  storeId: string;
  totalAmount: number | null;
  paymentMode: string;
  paymentStatus: string;
  orderDate: string;
  status: string;
  createdAt: string;
  username: string;
  address: null | {
    // Define address structure if needed
  };
  userAgent: string;
  deviceType: string;
  orderItems: OrderItem[];
  user: any;
}

export interface IRequestCustomTheme {
  id: string;
  userId: string;
  createdAt?: string;
  businessName: string;
  additionalInfo: string;
  references: string;
  email: string;
  storeCategory: string;
}
