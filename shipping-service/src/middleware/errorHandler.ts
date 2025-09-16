import config from "../config";
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

import CustomError from "../utils/customError";
import logger from "./logger";
import dayjs from "dayjs";
// import systemLogger from "../helpers/systemLogger";

const devErrors = (res: Response, error: ICustomError) => {
  return res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    error: error,
  });
};

const castErrorHandler = (err: any): ICustomError => {
  const msg = `Invalid value for ${err.path}: ${err.value}!`;
  return new CustomError(msg, 400) as ICustomError;
};

export const validationErrorHandler = (err: any) => {
  const errors = Object.values(err.errors).map((val: any) => val.msg);
  const errorMessages = errors.join(". \n");
  const msg = `Invalid input data: ${errorMessages}`;

  return new CustomError(msg, 400) as ICustomError;
};

const dbErrorHandler = (err: any) => {
  const errors = err.errors.map((m: any) => m.message).join(". \n");
  const msg = `DB error: ${errors}`;
  return new CustomError(msg, 400) as ICustomError;
};

const prodErrors = (res: Response, error: ICustomError) => {
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

interface ICustomError extends Error {
  statusCode: number;
  status: string;
  isOperational?: boolean;
}

const errorHandler = (error: ICustomError, req: Request, res: Response, next: NextFunction) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  console.log(error, "Error handler"  );
  logger.info({ message: error.message, timestamp: dayjs(new Date()).format("YYYY-MM-DD:HH:mm"),status: error.status,statusCode: error.statusCode,path:req.url });
  if (config.nodeEnv === "development") {
    devErrors(res, error);
  } else if (config.nodeEnv === "production") {
    prodErrors(res, error);
  }
};

export default errorHandler;
