// ShipRocket API Types

import { OrderItem } from "./common";

export interface ShipmentData {
  pickupPostcode: string;
  deliveryPostcode: string;
  weight: number;
  cod: 0 | 1;
  order_id?: string;
}

export interface IShippingServiceability {
  air_max_weight: string;
  assured_amount: number;
  base_courier_id: number | null;
  base_weight: string;
  blocked: number;
  call_before_delivery: string;
  charge_weight: number;
  city: string;
  cod: number;
  cod_charges: number;
  cod_multiplier: number;
  cost: string;
  courier_company_id: number;
  courier_name: string;
  courier_type: string;
  coverage_charges: number;
  cutoff_time: string;
  delivery_boy_contact: string;
  delivery_performance: number;
  description: string;
  edd: string;
  edd_fallback: { [key: string]: string };
  entry_tax: number;
  estimated_delivery_days: string;
  etd: string;
  etd_hours: number;
  freight_charge: number;
  id: number;
  is_custom_rate: number;
  is_hyperlocal: boolean;
  is_international: number;
  is_rto_address_available: boolean;
  is_surface: boolean;
  local_region: number;
  metro: number;
  min_weight: number;
  mode: number;
  new_edd: number;
  odablock: boolean;
  other_charges: number;
  others: string;
  pickup_availability: string;
  pickup_performance: number;
  pickup_priority: string;
  pickup_supress_hours: number;
  pod_available: string;
  postcode: string;
  qc_courier: number;
  rank: string;
  rate: number;
  rating: number;
  realtime_tracking: string;
  region: number;
  rto_charges: number;
  rto_performance: number;
  seconds_left_for_pickup: number;
  secure_shipment_disabled: boolean;
  ship_type: number;
  state: string;
  suppress_date: string;
  suppress_text: string;
  suppression_dates: { action_on: string; blocked_fm: string; blocked_lm: string };
  surface_max_weight: string;
  tracking_performance: number;
  volumetric_max_weight: number | null;
  weight_cases: number;
  zone: string;
}

export interface ShiprocketOrderResponse {
  order_id: number;
  shipment_id: number;
  status: string;
  status_code: number;
  onboarding_completed_now: number;
  awb_code?: string;
  courier_company_id?: number;
  courier_name?: string;
}

export interface ShiprocketOrderItem {
  name: string;
  sku: string;
  units: number;
  selling_price: number;
  discount?: string;
  tax?: string;
  hsn?: number;
}

export interface CreateOrderRequest {
  order_id: string;
  order_date: string;
  pickup_location: string;
  channel_id?: string;
  comment?: string;
  billing_customer_name: string;
  billing_last_name?: string;
  billing_address: string;
  billing_address_2?: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing: boolean;
  shipping_customer_name?: string;
  shipping_last_name?: string;
  shipping_address?: string;
  shipping_address_2?: string;
  shipping_city?: string;
  shipping_pincode?: string;
  shipping_country?: string;
  shipping_state?: string;
  shipping_email?: string;
  shipping_phone?: string;
  order_items: ShiprocketOrderItem[];
  payment_method: string;
  shipping_charges?: number;
  giftwrap_charges?: number;
  transaction_charges?: number;
  total_discount?: number;
  sub_total: number;
  length: number;
  breadth: number;
  height: number;
  weight: number;
  courierCompanyId: number;
  courierName: string;
  courierRate: number;
}

export interface TrackingData {
  tracking_data: {
    track_status: number;
    shipment_status: number;
    shipment_track: Array<{
      date: string;
      activity: string;
      location: string;
    }>;
    shipment_track_activities: Array<{
      date: string;
      status: string;
      activity: string;
      location: string;
    }>;
  };
}

export interface ShipmentLabel {
  label_url: string;
  label_created: boolean;
  message?: string;
}

export interface Invoice {
  invoice_url: string;
  is_invoice_created: boolean;
  message?: string;
}

export interface ShipRocketError {
  message: string;
  status_code?: number;
}

export interface OrderStatusType {
  id: number;
  name: string;
  color: string;
}

export const OrderStatuses: Record<number, OrderStatusType> = {
  1: { id: 1, name: "New Order", color: "#3B82F6" },
  2: { id: 2, name: "Pending", color: "#F97316" },
  3: { id: 3, name: "Ready to Ship", color: "#8B5CF6" },
  4: { id: 4, name: "Shipped", color: "#10B981" },
  5: { id: 5, name: "Delivered", color: "#047857" },
  6: { id: 6, name: "Cancelled", color: "#EF4444" },
  7: { id: 7, name: "Returned", color: "#6B7280" },
};

export interface ShiprocketTrackingActivity {
  date: string;
  status: string;
  activity: string;
  location: string;
  "sr-status": string;
}

export interface ShiprocketShipmentTrack {
  id: number;
  awb_code: string;
  courier_company_id: number;
  shipment_id: number;
  order_id: number;
  pickup_date: string | null;
  delivered_date: string | null;
  weight: string;
  packages: number;
  current_status: string;
  delivered_to: string;
  destination: string;
  consignee_name: string;
  origin: string;
  courier_agent_details: any;
  edd: string;
}

export interface ShiprocketTrackingData {
  track_status: number;
  shipment_status: number;
  shipment_track: ShiprocketShipmentTrack[];
  shipment_track_activities: ShiprocketTrackingActivity[];
  track_url: string;
  etd: string;
}
