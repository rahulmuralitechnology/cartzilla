import dotenv from "dotenv";
import config from "../config";
import { transporter } from "./emailServer";

dotenv.config();

interface ContactEmailDetails {
  fromEmail: string;
  toEmail: string;
  subject: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}
// Function to send OTP email
interface EmailDetails {
  fromEmail: string;
  toEmail: string;
  subject: string;
  name: string;
  otp: string;
}

export async function sendOtpEmail(body: EmailDetails): Promise<void> {
  const { fromEmail, toEmail, subject, name, otp } = body;

  try {
    // Define the email message
    const emailMessage = {
      content: {
        subject: subject,
        plainText: `Hello ${name},\n\nYour OTP code is: ${otp}\n\nThis code is valid for a short time. Do not share it with anyone.`,
        html: `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f9;
                  margin: 0;
                  padding: 0;
                }
                .email-container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  text-align: center;
                }
                h1 {
                  color: #00bcd4;
                  font-size: 24px;
                  margin-bottom: 20px;
                }
                p {
                  font-size: 16px;
                  color: #555555;
                }
                .otp-code {
                  font-size: 22px;
                  font-weight: bold;
                  color:white;
                  background-color: #00bcd4;
                  padding: 10px;
                  display: inline-block;
                  margin: 10px 0;
                }
                .footer {
                  font-size: 12px;
                  color: #888888;
                  margin-top: 10px;
                }
              </style>
            </head>
            <body>
              <div class="email-container">
                <h1>OTP Verification</h1>
                <p>Hello <strong>${name}</strong>,</p>
                <p>Your OTP for verification is:</p>
                <div class="otp-code">${otp}</div>
                <p>This code is valid for 10 min. Do not share it with anyone.</p>
                <div class="footer">
                  <p>If you did not request this, please ignore this email.</p>
                </div>
              </div>
            </body>
          </html>`,
      },
    };

    const info = await transporter.sendMail({
      from: `Bloomi5 TEAM <${config.appConstant.BLOOMI5_EMAIL}>`,
      to: toEmail,
      subject: subject,
      html: emailMessage.content.html,
    });

    console.log("Sending OTP email to:", toEmail);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
}

export async function sendContactEmail(body: ContactEmailDetails): Promise<void> {
  const { fromEmail, toEmail, subject, name, email, phone, message } = body;

  try {
    // Define the email message
    const emailMessage = {
      content: {
        html: `
                <html>
                  <head>
                    <style>
                      body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f9;
                        margin: 0;
                        padding: 0;
                      }
                      .email-container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                      }
                      h1 {
                        color: #00bcd4;
                        font-size: 24px;
                        margin-bottom: 20px;
                      }
                      p {
                        font-size: 16px;
                        color: #555555;
                        line-height: 1.5;
                      }
                      .info-section {
                        background-color: #f9f9f9;
                        padding: 15px;
                        border-radius: 5px;
                        margin: 15px 0;
                      }
                      .message-section {
                        background-color: #f0f8ff;
                        padding: 15px;
                        border-radius: 5px;
                        margin: 15px 0;
                        border-left: 4px solid #00bcd4;
                      }
                      .footer {
                        font-size: 12px;
                        color: #888888;
                        margin-top: 20px;
                        text-align: center;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="email-container">
                      <h1>New Contact Form Submission</h1>
                      <div class="info-section">
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${phone}</p>
                      </div>
                      <div class="message-section">
                        <p><strong>Message:</strong></p>
                        <p>${message.replace(/\n/g, "<br>")}</p>
                      </div>
                      <div class="footer">
                        <p>This is an automated notification from your website contact form.</p>
                      </div>
                    </div>
                  </body>
                </html>`,
      },
    };

    const info = await transporter.sendMail({
      from: `Bloomi5 TEAM <${config.appConstant.BLOOMI5_EMAIL}>`,
      to: toEmail,
      subject: subject,
      html: emailMessage.content.html,
    });

    console.log("Sending contact form notification to:", toEmail);
  } catch (error) {
    console.error("Error sending contact email:", error);
    throw error;
  }
}
