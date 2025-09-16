// Import necessary libraries and types
import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import CustomError from "../utils/customError";
import config from "../config";
import { IDecodeToken } from "../service/interface";
import prisma from "../service/prisma";
import { Store, User, UserRole } from "@prisma/client";

// Augment the Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Middleware function to check if the route is private and validate the token
export default async (req: Request, res: Response, next: NextFunction) => {
  // Get the token from the request header
  let authHeader = req.header("x-auth-token") || req.header("authorization");
  // console.log("auth",authHeader)

  // Check if the Authorization header is missing
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new CustomError(`Access denied. Invalid or missing token.`, 401));
  }

  const { storeId } = req.query;

  // Extract the token from the Bearer token format
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, config.appConstant.JWT_LOGIN_SECRET_KEY) as IDecodeToken;
    let user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        Store:
          storeId === "null"
            ? {
                select: {
                  subscriptionPlan: {
                    select: {
                      featuresValidation: true,
                    },
                  },
                },
              }
            : false,
      },
    });

    // Chect is user exist or not
    if (!user) return next(new CustomError(`User not found.`, 404));

    let storeInfo: any = user?.Store;
    if (storeId && storeId !== "null") {
      storeInfo = [
        await prisma.store.findUnique({
          where: { id: storeId as string },
          include: {
            subscriptionPlan: {
              select: {
                featuresValidation: true,
              },
            },
          },
        }),
      ];
    }

    // console.log("stoer", JSON.stringify(storeInfo[0]));

    if (
      storeInfo &&
      storeInfo[0]?.subscriptionEndDate < new Date() &&
      user?.role !== UserRole.SUPERADMIN &&
      user?.role !== UserRole.CUSTOMER
    ) {
      return res.status(403).json({
        message: `Your subscription has expired. Please contact us to renew your subscription.`,
        subscriptionEndDate: storeInfo[0]?.subscriptionEndDate,
        siteExpired: true,
        status: false,
      });
    }

    // @ts-ignore
    delete user.password;
    const updateUser = { ...user, Store: storeInfo };

    // Attach the user information to the request object
    // @ts-ignore
    req.user = updateUser;

    // Check is user's email verified or not
    if (!user.verified) return next(new CustomError(`Your email not verified, Please verify your email.`, 404));

    // Chect is user active or not
    if (!user.isActive)
      return next(new CustomError(`Your account is In-Active. Please Contact Us: ${config.appConstant.BUSINESS_EMAIL}`, 403));

    return next();
  } catch (error) {
    // Handle token verification errors
    if (error instanceof TokenExpiredError) {
      return next(new CustomError(`Token has expired.`, 401));
    } else {
      return next(new CustomError(`Invalid token.`, 401));
    }
  }
};
