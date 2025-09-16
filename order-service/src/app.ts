import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import config from "./config";
import CustomError from "./utils/customError";
import errorHandler from "./middleware/errorHandler";
// Import Routes
import cartRoutes from "./routes/cartRoute";
import orderRoute from "./routes/orderRoute";
import portalCouponRoute from "./routes/portalCouponRoute";

import APIRatelimit from "./utils/exporessRateLimit";
const app = express();

// Apply most middleware first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    // @ts-ignore
    origin: config.clientOrigins[config.nodeEnv],
  })
);
app.use(helmet());
app.use(morgan("tiny"));

// Apply routes before error handling
app.use(`${config.appConstant.VERSION_ENDPOINT}/cart`, cartRoutes);
app.use(`${config.appConstant.VERSION_ENDPOINT}/order`, orderRoute);
app.use(`${config.appConstant.VERSION_ENDPOINT}/portal-coupon`, portalCouponRoute);

app.use(APIRatelimit);

// Apply error handling last
app.use("*", (req: Request, res: Response, next) => {
  next(new CustomError(`Can't find ${req.originalUrl} on the server!`, 404, "NotFound"));
});
app.use(errorHandler);

if (require.main === module) {
  const port = 3004;
  app.listen(port, () => {
    console.log(`Order Service running on port ${port}`);
  });
}
export default app;
