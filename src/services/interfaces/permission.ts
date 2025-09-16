// Feature access permissions
export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: "view:dashboard",

  // Users
  VIEW_USERS: "view:users",
  CREATE_USER: "create:user",
  EDIT_USER: "edit:user",
  DELETE_USER: "delete:user",

  // Products
  VIEW_PRODUCTS: "view:products",
  CREATE_PRODUCT: "create:product",
  EDIT_PRODUCT: "edit:product",
  DELETE_PRODUCT: "delete:product",

  // Orders
  VIEW_ORDERS: "view:orders",
  CREATE_ORDER: "create:order",
  EDIT_ORDER: "edit:order",
  DELETE_ORDER: "delete:order",

  // Settings
  VIEW_SETTINGS: "view:settings",
  EDIT_SETTINGS: "edit:settings",

  // Reports
  VIEW_REPORTS: "view:reports",
  GENERATE_REPORT: "generate:report",

  // Customers
  VIEW_CUSTOMERS: "view:customers",
  EDIT_CUSTOMER: "edit:customer",
};

// Role-based permission mappings
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPERADMIN: Object.values(PERMISSIONS),
  ADMIN: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.EDIT_USER,
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.CREATE_PRODUCT,
    PERMISSIONS.EDIT_PRODUCT,
    PERMISSIONS.DELETE_PRODUCT,
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.EDIT_ORDER,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.EDIT_SETTINGS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.GENERATE_REPORT,
    PERMISSIONS.VIEW_CUSTOMERS,
    PERMISSIONS.EDIT_CUSTOMER,
  ],
  CLIENT: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.CREATE_ORDER,
    PERMISSIONS.VIEW_CUSTOMERS,
  ],
  CUSTOMER: [PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.VIEW_PRODUCTS, PERMISSIONS.VIEW_ORDERS, PERMISSIONS.CREATE_ORDER],
  USER: [PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.VIEW_PRODUCTS, PERMISSIONS.VIEW_ORDERS],
};

export const PERMISSION_GROUPS: any = {
  Dashboard: [PERMISSIONS.VIEW_DASHBOARD],
  Users: [PERMISSIONS.VIEW_USERS, PERMISSIONS.CREATE_USER, PERMISSIONS.EDIT_USER, PERMISSIONS.DELETE_USER],
  Products: [PERMISSIONS.VIEW_PRODUCTS, PERMISSIONS.CREATE_PRODUCT, PERMISSIONS.EDIT_PRODUCT, PERMISSIONS.DELETE_PRODUCT],
  Orders: [PERMISSIONS.VIEW_ORDERS, PERMISSIONS.CREATE_ORDER, PERMISSIONS.EDIT_ORDER, PERMISSIONS.DELETE_ORDER],
  Settings: [PERMISSIONS.VIEW_SETTINGS, PERMISSIONS.EDIT_SETTINGS],
  Reports: [PERMISSIONS.VIEW_REPORTS, PERMISSIONS.GENERATE_REPORT],
};

export const PERMISSION_DISPLAY_NAMES: Record<string, string> = {
  // Dashboard
  "view:dashboard": "View Dashboard",

  // Users
  "view:users": "View Users",
  "create:user": "Create User",
  "edit:user": "Edit User",
  "delete:user": "Delete User",

  // Products
  "view:products": "View Products",
  "create:product": "Create Product",
  "edit:product": "Edit Product",
  "delete:product": "Delete Product",

  // Orders
  "view:orders": "View Orders",
  "create:order": "Create Order",
  "edit:order": "Edit Order",
  "delete:order": "Delete Order",

  // Settings
  "view:settings": "View Settings",
  "edit:settings": "Edit Settings",

  // Reports
  "view:reports": "View Reports",
  "generate:report": "Generate Report",

  // Customers
  "view:customers": "View Customers",
  "edit:customer": "Edit Customer",
};
