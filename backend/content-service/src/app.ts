import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import config from "./config";
import CustomError from "./utils/customError";
import errorHandler from "./middleware/errorHandler";
import robotsTxtRoute from "./routes/robotxTextRoute";
import template from "./routes/templateRoute";
import blogRoute from "./routes/blogRoute";
import sitemapRoute from "./routes/sitemapRoute";
import APIRatelimit from "./utils/exporessRateLimit";
import sectionBuilderRoute from "./routes/sectionBuilderRoute";

const app = express();

// Apply most middleware first.
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
app.use(`${config.appConstant.VERSION_ENDPOINT}/template`, template);
app.use(`${config.appConstant.VERSION_ENDPOINT}/blog`, blogRoute);
app.use(`${config.appConstant.VERSION_ENDPOINT}/sitemap`, sitemapRoute);
app.use(`${config.appConstant.VERSION_ENDPOINT}/section`, sectionBuilderRoute);
app.use(`${config.appConstant.VERSION_ENDPOINT}/robot-txt`, robotsTxtRoute);


app.use(APIRatelimit);

// Apply error handling last
app.use("*", (req: Request, res: Response, next) => {
  next(new CustomError(`Can't find ${req.originalUrl} on the server!`, 404, "NotFound"));
});
app.use(errorHandler);

if (require.main === module) {
  const port = 3006;
  app.listen(port, () => {
    console.log(`Content Service running on port ${port}`);
  });
}

export default app;
