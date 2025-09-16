import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import config from "./config";
import CustomError from "./utils/customError";
import errorHandler from "./middleware/errorHandler";
import siteConfigRoute from "./routes/siteConfigRoute";
import customScriptRoute from "./routes/customScriptRoute";
import AddPlanRoute from "./routes/planRoute";
import themeRequestRoute from "./routes/customThemeRoute";
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

app.use(`${config.appConstant.VERSION_ENDPOINT}/site`, siteConfigRoute);
app.use(`${config.appConstant.VERSION_ENDPOINT}/customscript`, customScriptRoute);
app.use(`${config.appConstant.VERSION_ENDPOINT}/plan`, AddPlanRoute);
app.use(`${config.appConstant.VERSION_ENDPOINT}/theme`, themeRequestRoute);

app.use(APIRatelimit);

// Apply error handling last
app.use("*", (req: Request, res: Response, next) => {
  next(new CustomError(`Can't find ${req.originalUrl} on the server!`, 404, "NotFound"));
});
app.use(errorHandler);

if (require.main === module) {
  const port = 3007;
  app.listen(port, () => {
    console.log(`Config Service running on port ${port}`);
  });
}

export default app;
