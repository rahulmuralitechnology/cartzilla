import { User } from "@prisma/client";
import { Request } from "express";

export interface IUser {
  id: number;
  email: string;
  password: string;
  name?: string;
  isEmailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  createdAt: Date;
  updatedAt: Date;
  googleId?: string;
  googleAccessToken?: string;
}
export interface IDecodeToken {
  userId: string;
  email: string;
  role: IUserRole;
}

export type IUserRole = "admin" | "subAdmin" | "user";
export type PLAN_NAME = "BASIC" | "PREMIUM" | "ADVANCE";
export type PlanMonth = 1 | 12;

export interface AuthRequest extends Request {
  user?: User;
}
