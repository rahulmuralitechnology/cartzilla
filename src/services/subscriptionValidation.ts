import { IStore } from "./storeService";

interface ISubscriptionFeatures {
  sku_limit: number;
  order_tracking: boolean;
  free_cod_payment: boolean;
  discounts_offers: boolean;
  inventory_management: boolean;
  customer_profiles: boolean;
  basic_analytics: boolean;
  theme_customization: "limited" | "full";
  security_authentication: boolean;
  abandoned_cart_recovery: boolean;
  wishlist_product_search: boolean;

  advanced_analytics: boolean;
  custom_pages_theme: boolean;
  role_based_access: boolean;
  shipping_options_packing: boolean;
  customer_wallet: boolean;
  automated_abandoned_cart: boolean;
  seo_sitemap_integration: boolean;
  product_tags_stickers: boolean;
  invoice_order_status: boolean;
  email_campaigns: boolean;
  sms_management: boolean;
  mobile_notifications: boolean;
  delivery_scheduling_agent_management: boolean;
}

export interface IFeaturesValidation {
  abandoned_cart_recovery: boolean;
  account_manager: boolean;
  advanced_seo: boolean;
  advanced_ux: boolean;
  blog_enabled: boolean;
  cod_enabled: boolean;
  coupons_enabled: boolean;
  custom_features: boolean;
  customer_targeting: boolean;
  delivery_integration: boolean;
  durationDays: number;
  early_feature_access: boolean;
  google_business_profile: boolean;
  inventory_management: {
    level: "basic" | string;
    enabled: boolean;
  };
  knowledge_base_access: boolean;
  multi_language: boolean;
  online_payment: boolean;
  pages_limit: number;
  payment_gateways: number;
  product_limit: number;
  reports: {
    performance: "monthly" | string;
  };
  reviews_enabled: boolean;
  seo_enabled: boolean;
  seo_level: "basic" | string;
  social_media_management: {
    enabled: boolean;
    platforms: number;
    setup_only: boolean;
  };
  strategy_call_minutes: number;
  support: {
    chat: boolean;
    email: {
      enabled: boolean;
      response_time_hours: number;
    };
    phone: boolean;
  };
  training_hours: number;
  trial_days: number;
}

export type SubscriptionPlan = {
  id?: string;
  name: string;
  price: number;
  features: ISubscriptionFeatures;
  featuresValidation: IFeaturesValidation;
  durationDays: number;
};

export type UserSubscription = {
  paymentStatus: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  subscriptionPlan: SubscriptionPlan;
};

export interface IFeatureCheckResult {
  message: string;
  available: boolean;
}

export const isUserSubscribed = (userSubscription: IStore): boolean => {
  if (!userSubscription?.subscriptionPlan && !userSubscription.paymentStatus) return false;

  const { paymentStatus, subscriptionEndDate } = userSubscription;
  if (!paymentStatus) return false; // User must have an active subscription
  if (paymentStatus !== "ACTIVE") return false; // User must have an active subscription

  const today = new Date();
  const expiryDate = new Date(subscriptionEndDate as string);

  return today <= expiryDate; // Returns true if the subscription is still valid
};

// export const checkSubscriptionFeature = (planId: string, feature: string): IFeatureCheckResult | string => {
//   const plan = subscriptionPlans.find((p) => p.id === planId);
//   if (!plan) return `Invalid subscription plan: ${planId}`;

//   const hasFeature = plan.features.includes(feature);
//   return hasFeature
//     ? { message: `Feature '${feature}' is available in '${plan.name}'`, available: true }
//     : { message: `Feature '${feature}' is not available in '${plan.name}'`, available: false };
// };

// Dummy Data
// const userSubscription: UserSubscription = {
//   paymentStatus: "ACTIVE",
//   subscriptionStartDate: "2025-02-25T11:04:34.190Z",
//   subscriptionEndDate: "2025-03-27T11:04:34.190Z",
//   subscriptionPlan: {
//     id: "basic",
//     name: "Basic Plan",
//     price: 10,
//     features: ["Online Store (50 SKU)", "Order Tracking", "Free COD & Payment Integration", "Discounts & Offers"],
//     durationDays: 30,
//   },
// };

// console.log(isUserSubscribed(userSubscription)); // ✅ True if subscription is valid

// console.log(checkSubscriptionFeature(userSubscription.subscriptionPlan.id, "Advanced Analytics"));
// // ❌ Feature 'Advanced Analytics' is not available in 'Basic Plan'.
