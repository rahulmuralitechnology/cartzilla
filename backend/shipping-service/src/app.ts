import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import config from "./config";
import CustomError from "./utils/customError";
import errorHandler from "./middleware/errorHandler";
import shippingRoute from "./routes/shiprocketRoute";
import webhookRoutes from "./routes/shiprocketWebhookRoute";
import shippingInfoRoutes from "./routes/shippingRoute";
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


app.use(`${config.appConstant.VERSION_ENDPOINT}/shipping`, shippingRoute);
app.use(`${config.appConstant.VERSION_ENDPOINT}/webhook`, webhookRoutes);
app.use(`${config.appConstant.VERSION_ENDPOINT}/shipping-info`, shippingInfoRoutes);


app.use(APIRatelimit);

// Apply error handling last
app.use("*", (req: Request, res: Response, next) => {
  next(new CustomError(`Can't find ${req.originalUrl} on the server!`, 404, "NotFound"));
});
app.use(errorHandler);

if (require.main === module) {
  const port = 3008;
  app.listen(port, () => {
    console.log(`Shipping Service running on port ${port}`);
  });
}

export default app;
