import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import { StatusCodes } from "http-status-codes";
import axios from "axios";
import config from "./config";
import { logger } from "./utils/logger";
import { metricsMiddleware, getMetrics } from "./utils/metrics";

const app = express();

// ======================
// Middleware Setup
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions: cors.CorsOptions = {
  origin: config.clientOrigins[config.nodeEnv],
  credentials: true
};
app.use(cors(corsOptions));

app.use(helmet());
app.use(morgan("combined"));
app.use(metricsMiddleware);

// ======================
// Proxy Configuration
// ======================
const createServiceProxy = (serviceUrl: string) => createProxyMiddleware({
  target: serviceUrl,
  changeOrigin: true,
  onProxyReq: fixRequestBody,
  onError: (err: Error, req: Request, res: Response) => {
    logger.error(`Proxy error for ${req.originalUrl}: ${err.message}`);
    res.status(StatusCodes.BAD_GATEWAY).json({
      error: "Service temporarily unavailable",
      status: "ServiceError",
      timestamp: new Date().toISOString()
    });
  }
});

// ======================
// Route Proxies (Complete Monolithic API Mapping)
// ======================

// Auth Service
app.use(`${config.apiPrefix}/auth`, createServiceProxy(config.authServiceUrl));

// User Service
app.use(`${config.apiPrefix}/user`, createServiceProxy(config.userServiceUrl));
app.use(`${config.apiPrefix}/customer`, createServiceProxy(config.userServiceUrl));
app.use(`${config.apiPrefix}/address`, createServiceProxy(config.userServiceUrl));

// Product Service
app.use(`${config.apiPrefix}/product`, createServiceProxy(config.productServiceUrl));
app.use(`${config.apiPrefix}/product-category`, createServiceProxy(config.productServiceUrl));
app.use(`${config.apiPrefix}/invetory`, createServiceProxy(config.productServiceUrl));
app.use(`${config.apiPrefix}/stock`, createServiceProxy(config.productServiceUrl));

// Order Service
app.use(`${config.apiPrefix}/order`, createServiceProxy(config.orderServiceUrl));
app.use(`${config.apiPrefix}/cart`, createServiceProxy(config.orderServiceUrl));
app.use(`${config.apiPrefix}/portal-coupon`, createServiceProxy(config.orderServiceUrl));

// Store Service
app.use(`${config.apiPrefix}/store`, createServiceProxy(config.storeServiceUrl));
app.use(`${config.apiPrefix}/restaurant`, createServiceProxy(config.storeServiceUrl));

// Content Service
app.use(`${config.apiPrefix}/blog`, createServiceProxy(config.contentServiceUrl));
app.use(`${config.apiPrefix}/template`, createServiceProxy(config.contentServiceUrl));
app.use(`${config.apiPrefix}/section`, createServiceProxy(config.contentServiceUrl));
app.use(`${config.apiPrefix}/robot-txt`, createServiceProxy(config.contentServiceUrl));
app.use(`${config.apiPrefix}/sitemap`, createServiceProxy(config.contentServiceUrl));

// Config Service
app.use(`${config.apiPrefix}/site`, createServiceProxy(config.configServiceUrl));
app.use(`${config.apiPrefix}/customscript`, createServiceProxy(config.configServiceUrl));
app.use(`${config.apiPrefix}/theme`, createServiceProxy(config.configServiceUrl));
app.use(`${config.apiPrefix}/plan`, createServiceProxy(config.configServiceUrl));

// Shipping Service
app.use(`${config.apiPrefix}/shipping`, createServiceProxy(config.shippingServiceUrl));
app.use(`${config.apiPrefix}/shipping-info`, createServiceProxy(config.shippingServiceUrl));
app.use(`${config.apiPrefix}/webhook`, createServiceProxy(config.shippingServiceUrl));

// ERP Service
app.use(`${config.apiPrefix}/erp-config`, createServiceProxy(config.erpServiceUrl));
app.use(`${config.apiPrefix}/erp-data`, createServiceProxy(config.erpServiceUrl));
app.use(`${config.apiPrefix}/erp`, createServiceProxy(config.erpServiceUrl));

// Utility Service
app.use(`${config.apiPrefix}/common`, createServiceProxy(config.utilityServiceUrl));
app.use(`${config.apiPrefix}/email`, createServiceProxy(config.utilityServiceUrl));
app.use(`${config.apiPrefix}/dashboard`, createServiceProxy(config.utilityServiceUrl));

// API Documentation
app.use("/api-docs", createServiceProxy(config.utilityServiceUrl));

// ======================
// Special Routes
// ======================

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).send("Welcome to Bloomi5 API Gateway");
});

// Health check endpoint
app.get("/health", async (req: Request, res: Response) => {
  const services = {
    auth: config.authServiceUrl,
    user: config.userServiceUrl,
    product: config.productServiceUrl,
    order: config.orderServiceUrl,
    store: config.storeServiceUrl,
    content: config.contentServiceUrl,
    config: config.configServiceUrl,
    shipping: config.shippingServiceUrl,
    erp: config.erpServiceUrl,
    utility: config.utilityServiceUrl
  };

  const results: Record<string, any> = {};

  await Promise.all(
    Object.entries(services).map(async ([name, url]) => {
      try {
        const response = await axios.get(`${url}/health`, { timeout: 3000 });
        results[name] = {
          status: response.status === 200 ? "UP" : "DOWN",
          details: response.data || null
        };
      } catch (err: any) {
        results[name] = {
          status: "DOWN",
          error: err.message
        };
      }
    })
  );

  res.status(StatusCodes.OK).json({
    status: "UP",
    timestamp: new Date().toISOString(),
    services: results
  });
});

// Metrics endpoint
app.get("/metrics", async (req: Request, res: Response) => {
  res.set("Content-Type", "text/plain");
  res.send(await getMetrics());
});

// ======================
// Error Handling
// ======================
app.use("*", (req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    error: `Can't find ${req.originalUrl} on the server!`,
    status: "NotFound"
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: "Internal server error",
    status: "ServerError"
  });
});

// ======================
// Server Startup
// ======================
app.listen(3000, () => {
  logger.info(`API Gateway running on port 3000`);
  logger.info(`API Prefix: ${config.apiPrefix}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`CORS Origin: ${config.clientOrigins[config.nodeEnv]}`);
});

export default app;