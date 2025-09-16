import dotenv from "dotenv";
dotenv.config();

const NODE_ENV = process.env["NODE_ENV"] ?? "development";

const appConstant: any = {
  ENV: NODE_ENV,
  BOT_BASE_URL: process.env.BOT_BASE_URL,
  MAIL_SEND_EMAIL: process.env.SMTP_EMAIL,
  MAIN_SEND_PASS: process.env.SMTP_EMAIL_PASSWORD,
  CLINET_URL: process.env.FRONTEND_URL,
  SHIPROCKET_API_EMMAI: "shadab24it@gmail.com",
  SHIPROCKET_API_PASSWORD: "CIl%6knj^8Y6IO21",
  VERSION_ENDPOINT: "/api/v1",
  BUSINESS_EMAIL: "DoNotReply@bloomi5.com",
  BLOOMI5_EMAIL: "no-reply@bloomi5.com",
  COOKIE_KEY: "alazka@12#cookie",
  COOKIE_NAME: "alazka-ai-tool",
  JWT_SECRET_KEY: process.env.JWT_SECRET,
  JWT_PS_RESET_SECRET: "bloomi5@12#token",
  JWT_LOGIN_SECRET_KEY: "alazka@12#login",
  JWT_CONFIRM_EMAIL_KEY: "alazka-email-verify",
  JWT_FORGOT_EMAIL_KEY: "alazka-ps-forgot",
  JWT_INVITATION_SECRET: "alazka-invitation@12#",
  LOGIN_EXPIRE: "7d",
  VERIFY_EMAIL_EXPIRE: "30m",
  FORGOT_EMAIL_EXPIRE: "5m",
  FREE_TRIAL_DAYS: 3,
  subdomain_domain: "mybloomi5.com",
  plan: {
    BASIC: 3,
    PREMIUM: 6,
    ADVANCE: 12,
  },
  DEFAULT_ROLES: {
    ADMIN: "admin",
    SUBADMIN: "subAdmin",
    USER: "user",
  },
  azure: {
    storageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || "",
    containerName: process.env.AZURE_STORAGE_CONTAINER_NAME || "uploads",
  },
};

const SMPT_CONFIG = {
  port: 587,
  host: "smtp.gmail.com",
  secure: false,
  auth: {
    user: appConstant.MAIL_SEND_EMAIL,
    pass: appConstant.MAIN_SEND_PASS,
  },
  from: `"Bloomi5 TEAM" <${appConstant.MAIL_SEND_EMAIL}>`,
};

const config = {
  appConstant: appConstant,
  smpt_config: SMPT_CONFIG,
  nodeEnv: NODE_ENV,
  name: "CSPS",
  version: "1.0.1",
  port: process.env["PORT"] ?? 3006,
  clientOrigins: {
    development: process.env["DEV_ORIGIN"] ?? "*",
    production: process.env["PROD_ORIGIN"] ?? "none",
  },
};

export default config;
