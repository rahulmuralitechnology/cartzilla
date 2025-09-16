export interface ShiprocketAuth {
  email: string;
  password: string;
}

export interface ShiprocketToken {
  token: string;
  first_name: string;
  last_name: string;
  company_id: number;
}

export interface OrderItem {
  name: string;
  sku: string;
  units: number;
  selling_price: number;
  discount?: number;
  tax?: number;
  hsn?: number;
}

export interface ShippingAddress {
  name: string;
  company?: string;
  address: string;
  address_2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
  email: string;
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
  order_items: OrderItem[];
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
  courierName: string;
  courierRate: number;
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

export interface CourierServiceability {
  available_courier_companies: Array<{
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
  }>;
}

export interface TrackingEvent {
  date: string;
  status: string;
  activity: string;
  location: string;
  srStatus: number;
}

export interface WebhookPayload {
  awb: string;
  courier: string;
  status: string;
  current_status: string;
  delivered_date?: string;
  rto_initiated_date?: string;
  rto_delivered_date?: string;
  pickup_date?: string;
  shipment_status: string;
  shipment_status_id: number;
  order_id: string;
  shipment_id: string;
  track?: TrackingEvent[];
}

export interface OrderStatus {
  orderId: string;
  shipmentId: string;
  awbCode: string;
  courierName: string;
  status: string;
  statusCode: number;
  currentStatus: string;
  deliveredDate?: string;
  rtoInitiatedDate?: string;
  rtoDeliveredDate?: string;
  pickupDate?: string;
  trackingData?: TrackingEvent[];
  lastUpdated: Date;
}

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

export interface PickupLocation {
  id: number;
  pickup_location: string;
  address_type: string | null;
  address: string;
  address_2: string;
  updated_address: boolean;
  old_address: string;
  old_address2: string;
  tag: string;
  tag_value: string;
  instruction: string;
  city: string;
  state: string;
  country: string;
  pin_code: string;
  email: string;
  is_first_mile_pickup: number;
  phone: string;
  name: string;
  company_id: number;
  gstin: string | null;
  vendor_name: string | null;
  status: number;
  phone_verified: number;
  lat: string;
  long: string;
  open_time: string | null;
  close_time: string | null;
  warehouse_code: string | null;
  alternate_phone: string;
  rto_address_id: number;
  lat_long_status: number;
  new: number;
  associated_rto_address: any;
  is_primary_location: number;
}
