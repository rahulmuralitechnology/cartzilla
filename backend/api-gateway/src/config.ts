interface Config {
  nodeEnv: 'development' | 'production' | 'test';
  port: number;
  apiPrefix: string;
  
  // Service URLs
  authServiceUrl: string;
  userServiceUrl: string;
  productServiceUrl: string;
  orderServiceUrl: string;
  storeServiceUrl: string;
  contentServiceUrl: string;
  configServiceUrl: string;
  shippingServiceUrl: string;
  erpServiceUrl: string;
  utilityServiceUrl: string;
  
  clientOrigins: {
    development: string;
    production: string;
    test?: string;
  };
  jwtSecret: string;
  rateLimit: {
    windowMs: number;
    max: number;
  };
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV as 'development' | 'production' | 'test' || 'development',
  port: parseInt(process.env.PORT || '3000'),
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  
  // Service URLs - Update these to point to your microservices
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  userServiceUrl: process.env.USER_SERVICE_URL || 'http://localhost:3002',
  productServiceUrl: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3003',
  orderServiceUrl: process.env.ORDER_SERVICE_URL || 'http://localhost:3004',
  storeServiceUrl: process.env.STORE_SERVICE_URL || 'http://localhost:3005',
  contentServiceUrl: process.env.CONTENT_SERVICE_URL || 'http://localhost:3006',
  configServiceUrl: process.env.CONFIG_SERVICE_URL || 'http://localhost:3007',
  shippingServiceUrl: process.env.SHIPPING_SERVICE_URL || 'http://localhost:3008',
  erpServiceUrl: process.env.ERP_SERVICE_URL || 'http://localhost:3009',
  utilityServiceUrl: process.env.UTILITY_SERVICE_URL || 'http://localhost:3010',
  
  clientOrigins: {
    development: process.env.DEV_ORIGIN || 'http://localhost:3000',
    production: process.env.PROD_ORIGIN || 'https://yourdomain.com'
  },
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100')
  }
};

export default config;