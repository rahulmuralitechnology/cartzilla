import { IUser } from "../authService";
import { Order } from "../orderService";

export interface Address {
  id: string;
  userId: string;
  addressType: string;
  isDefault: boolean;
  name: string;
  line1: string;
  line2: string;
  landmark: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  instructions: string;
  createdAt: string;
  updatedAt: string;
}

interface Payment {
  id: string;
  amount: number;
  date: string;
  method: string;
  status: string;
}

export interface CustomerProfile {
  profile: IUser;
  address: any[];
  lastOrders: Order[];
  payments: Payment[];
}

export interface CustomerOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImages: string[];
  quantity: number;
  price: number;
  gstRate: number;
  gstAmount: number;
  totalPriceWithGST: number;
  createdAt: string;
  order: {
    status: string;
    totalAmount: number;
    shippingAddress: null | any; // Could be more specific based on actual address structure
    username: string;
  };
}
