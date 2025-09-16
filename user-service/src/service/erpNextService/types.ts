import { OrderStatus } from "@prisma/client";

// types/erpnext.types.ts
export interface Customer {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
  type?: "Individual" | "Company";
  group?: string;
  territory?: string;
  erpnext_customer_name?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ERPNextCustomer {
  doctype: "Customer";
  customer_name: string;
  customer_type: "Individual" | "Company";
  customer_group: string;
  territory: string;
  custom_mobile?: string;
  custom_email?: string;
  custom_id?: string;
  custom_external_id?: string;
  name?: string;
}

export interface ERPNextResponse<T = any> {
  data: T;
  message?: string;
}

export interface ERPNextListResponse<T = any> {
  data: T[];
  message?: string;
}

// export interface SyncResult {
//   customer: string;
//   action: "created" | "updated" | "exists" | "failed";
//   success: boolean;
//   data?: any;
//   error?: string;
//   [type: string]: any;
// }

export interface CustomerServiceResult {
  success: boolean;
  customer?: Customer;
  erpResult?: ERPNextResponse;
  error?: string;
}

// config/erpnext.config.ts
export interface ERPNextConfig {
  baseUrl: string;
  apiKey: string;
  apiSecret: string;
  defaultCustomerGroup: string;
  defaultTerritory: string;
}

export const erpNextConfig: ERPNextConfig = {
  baseUrl: process.env.ERPNEXT_BASE_URL || "https://your-erpnext-instance.com",
  apiKey: process.env.ERPNEXT_API_KEY || "14a5a44946d90f2",
  apiSecret: process.env.ERPNEXT_API_SECRET || "your-api-secret",
  defaultCustomerGroup: process.env.ERPNEXT_DEFAULT_CUSTOMER_GROUP || "Individual",
  defaultTerritory: process.env.ERPNEXT_DEFAULT_TERRITORY || "India",
};

// types/erpnext.types.ts
export interface Customer {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
  type?: "Individual" | "Company";
  group?: string;
  territory?: string;
  erpnext_customer_name?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Address {
  id: string;
  address_title?: string;
  address_type: "Billing" | "Shipping" | "Office" | "Personal" | "Plant" | "Postal" | "Shop" | "Subsidiary" | "Warehouse" | "Other";
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  country: string;
  pincode?: string;
  phone?: string;
  email_id?: string;
  is_primary_address?: boolean;
  is_shipping_address?: boolean;
  custom_external_id?: string;
  linked_doctype?: string; // 'Customer', 'Supplier', etc.
  linked_name?: string; // Customer name
  erpnext_address_name?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Contact {
  id: string;
  first_name: string;
  last_name?: string;
  email_id?: string;
  phone?: string;
  mobile_no?: string;
  designation?: string;
  department?: string;
  company_name?: string;
  is_primary_contact?: boolean;
  linked_doctype?: string; // 'Customer', 'Supplier', etc.
  linked_name?: string; // Customer name
  erpnext_contact_name?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  parent_category?: string;
  is_group?: boolean;
  image?: string;
  erpnext_item_group_name?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Product {
  id: string;
  name: string;
  item_code?: string;
  description?: string;
  item_group: string; // Product Category
  stock_uom: string; // Unit of Measure
  is_stock_item?: boolean;
  is_sales_item?: boolean;
  is_purchase_item?: boolean;
  standard_rate?: number;
  image?: string;
  brand?: string;
  manufacturer?: string;
  weight_per_unit?: number;
  weight_uom?: string;
  erpnext_item_name?: string;
  created_at?: Date;
  updated_at?: Date;
  hsnCode?: string; // GST HSN Code
}

export interface OrderItem {
  item_code: string;
  item_name: string;
  description?: string;
  qty: number;
  rate: number;
  amount: number;
  uom?: string;
}

export interface Order {
  id: string;
  customer_id: string;
  customer_name?: string;
  order_date: Date;
  delivery_date?: Date;
  status: OrderStatus;
  currency: string;
  items: OrderItem[];
  total_qty: number;
  total: number;
  taxes_and_charges_template?: string;
  tax_amount?: number;
  grand_total: number;
  billing_address?: string;
  shipping_address?: string;
  contact_person?: string;
  erpnext_sales_order_name?: string;
  created_at?: Date;
  updated_at?: Date;
}

// ERPNext API Types
export interface ERPNextAddress {
  doctype: "Address";
  address_title?: string;
  address_type: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  country: string;
  pincode?: string;
  phone?: string;
  email_id?: string;
  is_primary_address?: 0 | 1;
  is_shipping_address?: 0 | 1;
  links?: Array<{
    link_doctype: string;
    link_name: string;
  }>;
  custom_external_id?: string;
  name?: string;
}

export interface ERPNextContact {
  doctype: "Contact";
  first_name: string;
  last_name?: string;
  email_id?: string;
  phone?: string;
  mobile_no?: string;
  designation?: string;
  department?: string;
  company_name?: string;
  is_primary_contact?: 0 | 1;
  links?: Array<{
    link_doctype: string;
    link_name: string;
  }>;
  custom_external_id?: string;
  name?: string;
}

export interface ERPNextItemGroup {
  doctype: "Item Group";
  item_group_name: string;
  parent_item_group?: string;
  is_group?: 0 | 1;
  image?: string;
  custom_external_id?: string;
  name?: string;
}

export interface ERPNextItem {
  doctype: "Item";
  item_code: string;
  item_name: string;
  description?: string;
  item_group: string;
  stock_uom: string;
  is_stock_item?: 0 | 1;
  is_sales_item?: 0 | 1;
  is_purchase_item?: 0 | 1;
  standard_rate?: number;
  image?: string;
  brand?: string;
  manufacturer?: string;
  weight_per_unit?: number;
  weight_uom?: string;
  custom_external_id?: string;
  name?: string;
  gst_hsn_code?: string; // GST HSN Code
}

export interface ERPNextSalesOrder {
  doctype: "Sales Order";
  customer: string;
  order_date: string;
  delivery_date?: string;
  status?: string;
  currency: string;
  items: Array<{
    item_code: string;
    item_name: string;
    description?: string;
    qty: number;
    rate: number;
    amount: number;
    uom?: string;
  }>;
  total_qty: number;
  total: number;
  taxes_and_charges_template?: string;
  total_taxes_and_charges?: number;
  grand_total: number;
  customer_address?: string;
  shipping_address_name?: string;
  contact_person?: string;
  custom_external_id?: string;
  name?: string;
}

export interface ERPNextResponse<T = any> {
  data: T;
  message?: string;
}

export interface ERPNextListResponse<T = any> {
  data: T[];
  message?: string;
}

export interface SyncResult {
  item: string;
  action: "created" | "updated" | "exists" | "failed";
  success: boolean;
  data?: any;
  error?: string;
  [type: string]: any;
}
