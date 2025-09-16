import nodemailer from "nodemailer";
import config from "../config";
import emailTemplate, { ContactUs, IEMIL_TYPE, IMailData } from "./emailTemplate";
import { User } from "@prisma/client";
import logger from "../middleware/logger";

export const transporter = nodemailer.createTransport({
  host: config.smpt_config.host, // hostname
  port: config.smpt_config.port,
  secure: config.smpt_config.secure, // true for 465, false for other ports
  auth: config.smpt_config.auth,
});

export interface IEmail {
  to: string;
  subject: string;
  html: string;
  text?: string;
  storeName?: string;
}
const sendEmail = async ({ to, subject, html, text, storeName }: IEmail) => {
  try {
    const info = await transporter.sendMail({
      from: `${storeName || "Bloomi5"} <${config.appConstant.BLOOMI5_EMAIL}>`,
      to: to,
      subject: subject,
      html: html,
    });

    logger.info(`Email sent to ${to}, Subject: ${subject}, info: %s`, info?.messageId, info.response);
  } catch (error: any) {
    throw Error(error.message);
  }
};

const emailController = async (emailType: IEMIL_TYPE, emailData: IMailData) => {
  let template;
  if (emailType === "PasswordReset") {
    template = await emailTemplate.resetPassword({
      toEmail: emailData.toEmail,
      token: emailData.token,
      type: emailType,
      firstName: emailData?.user?.username as string,
      user: emailData.user,
      clientUrl: emailData.clientUrl,
    });
  } else if (emailType === "AccountVerification") {
    template = await emailTemplate.accountVerification({
      toEmail: emailData.toEmail,
      link: emailData.token,
      type: emailType,
      firstName: emailData?.user?.username as string,
    });
  } else if (emailType === "TrialCongratulations") {
    template = await emailTemplate.freeTrialCongratulation({
      toEmail: emailData.toEmail,
      link: emailData.token,
      type: emailType,
      firstName: emailData?.user?.username as string,
    });
  } else if (emailType === "CONTACT_US") {
    template = await emailTemplate.contactUsTemplate({
      ...(emailData.contactUs as ContactUs),
    });
  } else if (emailType === "SITE_PUBLISH_NOTIFICATION") {
    template = await emailTemplate.sitePublishNotification({
      toEmail: emailData.toEmail,
      link: emailData.link,
      firstName: emailData?.user?.username as string,
    });
  } else if (emailType === "ORDER_NOTIFICATION") {
    template = await emailTemplate.orderStatusEmail({
      ...emailData,
    });
  } else if (emailType === "ClientUserInvitation") {
    template = await emailTemplate.registerUserInvitation({
      ...emailData,
    });
  } else if (emailType === "ORDER_PLACED_NOTIFICATION") {
    template = await emailTemplate.orderPlacedEmail({
      ...emailData,
    });
  } else if (emailType === "ORDER_PLACED_NOTIFICATION_TO_ADMIN") {
    template = await emailTemplate.orderPlacedAdminEmail({
      ...emailData,
    });
  } else {
    throw new Error("Invalid email type");
  }
  await sendEmail({ ...template, storeName: emailData?.storeName } as IEmail);
};

export default { sendEmail, emailController };
