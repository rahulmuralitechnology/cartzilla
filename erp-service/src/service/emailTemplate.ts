import { Order, OrderStatus, User } from "@prisma/client";
import config from "../config";

export type IEMIL_TYPE =
  | "PasswordReset"
  | "AccountActivation"
  | "AccountVerification"
  | "TrialCongratulations"
  | "CONTACT_US"
  | "SITE_PUBLISH_NOTIFICATION"
  | "ClientUserInvitation"
  | "ORDER_PLACED_NOTIFICATION"
  | "ORDER_PLACED_NOTIFICATION_TO_ADMIN"
  | "ORDER_NOTIFICATION";

export interface IMailData {
  toEmail: string;
  link?: string;
  type?: IEMIL_TYPE;
  user?: User;
  firstName?: string;
  shippingCost?: number;
  organizationName?: string;
  storeName?: string;
  storeEmail?: string;
  token?: string;
  clientUrl?: string;
  contactUs?: any;
  customerPhone?: string;
  shippingAddress?: any;
  orderInfo?: {
    orderStatus?: OrderStatus;
    orderNumber: string;
    orderTotal: number;
    orderItems: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  };
}

const accountVerification = async (data: IMailData) => {
  let verificationLink = `${config.appConstant.CLINET_URL}/user/verify/email?token=${data.link}`;
  return {
    to: `${data.toEmail}`, // list of receivers (who receives)
    subject: "Bloomi5 - Email Verification ", // Subject line
    text: "", // plaintext body
    html: `
	<!DOCTYPE html>
<html lang="en">

<head>
	<title>Bloomi5</title>
	</head>
<body class="body">
	<div style="text-align: left; max-width: 800px;padding:20px">
	<h1 style="font-size: 1.5rem;color: #000"">
	  You are receiving this email so we can <br />
	  confirm this email address for your Bloomi5 ID.
	</h1>


	<p style="font-size: 1rem; color: #000">Please click below to verify your email address:</p>
	<div>
	  <a
		href="${verificationLink}"
		style="
		  font-size: 1rem;
		  background-color: #576fdb;
		  padding: 10px 15px;
		  border-radius: 8px;
		  text-decoration: none;
		  color: #fff;
		  top: 15px;
		"
		>Click here to verify your email</a
	  >
	</div>
	<br />
	<p style="font-size: 1rem; color: #000">
	  If clicking on the above button does not work, please copy and paste the URL below in a browser to verify your email address:
	</p>
	<p style="font-size: 1rem; color: #000">${verificationLink}</p>

	<p style="font-size: 1rem; color: #000"><b>IMPORTANT : </b>The above link is valid for 30 mins.</p>
  </div>
  </body>
  </html>
	`,
  };
};
export const freeTrialCongratulation = async (data: IMailData) => {
  return {
    to: `${data.toEmail}`, // list of receivers (who receives)
    subject: `🎉 Welcome to Your Free ${config.appConstant.FREE_TRIAL_DAYS}-Day Trial at Bloomi5! Start Building Your Chatbot Today`, // Subject line
    text: "", // plaintext body
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Bloomi5</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333333; line-height: 1.6; margin: 0; padding: 0;">
    <table align="center" width="600" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 20px; background-color: #f7f7f7;">
                <h1 style="color: #4CAF50;">🎉 Welcome to Bloomi5!</h1>
                <p style="font-size: 18px; margin: 0;">We’re thrilled to have you on board.</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #ffffff;">
                <p style="font-size: 16px; margin: 0;">
                    Dear ${data.firstName},
                </p>
                <p style="font-size: 16px; margin: 20px 0;">
                    Congratulations on starting your free ${
                      config.appConstant.FREE_TRIAL_DAYS
                    }-day trial with Bloomi5! You now have limited access to our powerful chatbot builder, where you can create and customize your chatbot using an Excel file.
                </p>
                <p style="font-size: 16px; margin: 20px 0;">
                    Here’s what you can look forward to:
                </p>
                <ul style="font-size: 16px; margin: 20px 0;">
                    <li>Effortless Setup: Upload your Excel files to build your chatbot—no coding needed.</li>
                    <li>Advanced Features: Discover tools to enhance engagement and streamline interactions.</li>
                    <li>Dedicated Support: We’re here to help you make the most of your trial.</li>
                </ul>
                <p style="font-size: 16px; margin: 20px 0;">
                    Ready to get started? Click below to dive right in:
                </p>
                <p style="text-align: center;">
                    <a href='${
                      config.appConstant.CLINET_URL
                    }' style="display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #4CAF50; text-decoration: none; font-size: 16px; border-radius: 5px;">Start Building Your Chatbot</a>
                </p>
                <p style="font-size: 16px; margin: 20px 0;">
                    If you have any questions, feel free to reach out to our support team at <a href="mailto:${
                      config.appConstant.BUSINESS_EMAIL
                    }" style="color: #4CAF50;">${
      config.appConstant.BUSINESS_EMAIL
    }</a>. We’re here to help you make the most of your experience!
                </p>
                <p style="font-size: 16px; margin: 20px 0;">
                    Best regards,<br>
                    <strong>The Bloomi5 Team</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #f7f7f7; font-size: 14px; color: #666666;">
                &copy; ${new Date().getFullYear()} Bloomi5. All rights reserved.
            </td>
        </tr>
    </table>
</body>
</html>
	`,
  };
};
const accountActivation = async (data: IMailData) => {
  let verificationLink = `${config.appConstant.CLINET_URL}/user/activate/account?token=${data.link}&email=${data?.user?.email}`;
  return {
    to: `${config.appConstant.BUSINESS_EMAIL}, shadab19it@gmail.com`, // list of receivers (who receives)
    subject: "Bloomi5 - Account Activation ", // Subject line
    text: "", // plaintext body
    html: `
	<!DOCTYPE html>
<html lang="en">

<head>
	<title>Bloomi5</title>
	</head>
<body class="body">
	<div style="text-align: left; max-width: 800px;padding:20px">
	<h1 style="font-size: 1.5rem;color: #000"">
	  A New User Register with 
	</h1>

	<ul>
	<li>Name : ${data.user?.username}</li>
	<li>Email : ${data.user?.email}</li>
	</ul>

	<p style="font-size: 1rem; color: #000">Please click below to Activate this User:</p>
	<div>
	  <a
		href="${verificationLink}"
		style="
		  font-size: 1rem;
		  background-color: #576fdb;
		  padding: 10px 15px;
		  border-radius: 8px;
		  text-decoration: none;
		  color: #fff;
		  top: 15px;
		"
		>Click here to Active this User</a
	  >
	</div>
	<br />
	<p style="font-size: 1rem; color: #000">
	  If clicking on the above button does not work, please copy and paste the URL below in a browser to Activate User Account:
	</p>
	<p style="font-size: 1rem; color: #000">${verificationLink}</p>

	<p style="font-size: 1rem; color: #000"><b>IMPORTANT : </b>The above link is valid for 1 day.</p>
  </div>
  </body>
  </html>
	`,
  };
};

const resetPassword = (data: IMailData) => {
  let verificationLink = `${data.clientUrl}/user/forgot-password?token=${data.token}`;
  return {
    to: `${data.toEmail}`, // list of receivers (who receives)
    subject: "Bloomi5 - Password Reset Link", // Subject line
    text: "", // plaintext body
    html: `<!DOCTYPE html>
<html lang="en">

<head>
<title>Bloomi5</title>
	<style>
		.palsystem-container {
			font-size: 14px;
			max-width: 500px;
			max-height: 483px;
			
			margin: auto;
			background-color: #F7F7F7;
		}

		.footer-container {
			max-width: 500px;
			max-height: 483px;
			margin: auto;
			font-size: 12px;
			opacity: 0.9;
		}

		.help-text {
			font-size: 12px;
		}

		.main-container {
			background-color: #F0F0EF;
			padding: 0px;
		}

		.user-info-container {
			background-color: #FFFF;
		}

		.body {
			background: #E6E6E6;
		}

		.verify-btn {
			margin: 10px;
			color: #ffff;
			border: none;
			background: #D6990F;
			align-items: center;
			align-content: center;
		}
	</style>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

</head>

<body class="body">
	<div class="pal-systems m-2">
		<div class="palsystem-container">
			<div class="col-md-12  text-center my-4 main-container">
				<div class="col-12 text-left pt-4">
					<span>Hi ${data.firstName}</span><br /><br />
					<span class="mt-2">Thanks for choosing <b>Bloomi5</b>!</span><br /><br />
				    Kindly click on this link to reset and recover your password.
				    <br/><br/>
					<a class="verify-btn" href="${verificationLink}">Click Here to reset</a>
				</div><br/>
			</div>

		</div><br/><br/>
		<div class="footer-container">Have questions, suggestions or complaints? Connect with ${config.appConstant.BUSINESS_EMAIL}</div>

</body>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

</html>`,
  };
};

const accountVerified = (data: IMailData) => {
  return {
    to: `${data.toEmail}`, // list of receivers (who receives)
    subject: "Bloomi5 - Email Verified ", // Subject line
    text: "", // plaintext body
    html: `<!DOCTYPE html>
	<html lang="en">
	  <head>
		<title>Bloomi5</title>
		<style>
		  body {
			font-family: "Gilroy";
			background-color: #f8f8fa;
			color: #242538;
		  }
		  * {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		  }
		  .main-container {
			font-size: 14px;
			padding: 20px;
			max-width: 800px;
		  }
		  .logo {
			width: 200px;
		  }
		  .logo img {
			width: 100%;
		  }
		  .message-section .title {
			color: #576fdb;
			font-size: 1.5rem;
			margin-bottom: 20px;
			font-weight: 600;
		  }
		  h3 {
			font-size: 1.2rem;
			font-weight: 400;
			margin-top: 15px;
			max-width: 680px;
		  }
		  .message-section .title span {
			color: #21ff1b;
		  }
		  p {
			margin: 20px 0;
			font-size: 1.1rem;
		  }
		  a {
			text-decoration: none;
		  }
		  .sign-in-btn button {
			all: unset;
			margin: 40px auto;
			display: block;
			cursor: pointer;
			background-color: #576fdb;
			height: 60px;
			border-radius: 8px;
			width: 250px;
			color: #fff;
			font-size: 1.2rem;
			text-align: center;
		  }
	
		  .footer-container {
			max-height: 483px;
			font-size: 12px;
			opacity: 0.9;
			margin-top: 40px;
		  }
		  .features-list {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			margin: 30px 0 40px 0;
			gap: 20px;
		  }
	
		  .features-list .feature {
			display: flex;
			align-items: center;
			gap: 0 20px;
		  }
		  .features-list .feature div {
			font-size: 17px;
			font-style: italic;
			font-weight: 500;
		  }
		  .features-list .feature img {
			width: 100%;
		  }
		  .support-link {
			opacity: 0.9;
		  }
	
		  .social-icon {
			margin-bottom: 30px;
		  }
		  .social-icon a img {
			width: 30px;
		  }
		</style>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link
		  rel="stylesheet"
		  href="https://cdn.rawgit.com/mfd/09b70eb47474836f25a21660282ce0fd/raw/e06a670afcb2b861ed2ac4a1ef752d062ef6b46b/Gilroy.css"
		/>
	  </head>
	
	  <body class="body">
		<div class="main-container">
		  <div class="logo"></div>
		  <div class="message-section">
			<div class="title">Welcome to Bloomi5</div>
			<h2>Hi ${data.firstName}, thank you, your email has been verified successfully.</h2>
			<h3>
			  You will receive separate email within one (1) business day once your account is activated with ALAZKA services with your login
			  details.
			</h3>
	
			<p class="support-link">
			  If you have any questions, please don't hesitate to contact us <a href="mailto:${config.appConstant.BUSINESS_EMAIL}">${config.appConstant.BUSINESS_EMAIL}</a>
			</p>
	
			<div class="footer-container">
			  <div class="logo">
				<img src="https://alazkauserprofile.blob.core.windows.net/kapp-email-assets/alazka-logo.svg" />
			  </div>
			</div>
		  </div>
		</div>
	  </body>
	</html>
	`,
  };
};

const accountActivated = (data: IMailData) => {
  return {
    to: `${data.toEmail}`, // list of receivers (who receives)
    subject: "Bloomi5 - Account Activated ", // Subject line
    text: "", // plaintext body
    html: `<!DOCTYPE html>
	<html lang="en">
	  <head>
		<title>Bloomi5</title>
		<style>
		  body {
			font-family: "Gilroy";
			background-color: #f8f8fa;
			color: #242538;
		  }
		  * {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		  }
		  .main-container {
			font-size: 14px;
			padding: 20px;
			max-width: 800px;
		  }
		  .logo {
			width: 200px;
		  }
		  .logo img {
			width: 100%;
		  }
		  .message-section .title {
			color: #576fdb;
			font-size: 1.5rem;
			margin-bottom: 20px;
			font-weight: 600;
		  }
		  h3 {
			font-size: 1.2rem;
			font-weight: 400;
			margin-top: 15px;
			max-width: 680px;
		  }
		  .message-section .title span {
			color: #21ff1b;
		  }
		  p {
			margin: 20px 0;
			font-size: 1.1rem;
		  }
		  a {
			text-decoration: none;
		  }
		  .sign-in-btn button {
			all: unset;
			margin: 40px auto;
			display: block;
			cursor: pointer;
			background-color: #576fdb;
			height: 60px;
			border-radius: 8px;
			width: 250px;
			color: #fff;
			font-size: 1.2rem;
			text-align: center;
		  }
	
		  .footer-container {
			max-height: 483px;
			font-size: 12px;
			opacity: 0.9;
			padding: 20px;
			margin-top: 20px;
		  }
		  .features-list {
			margin: 30px 0;
		  }
	
		  .feature-row {
			display: flex;
			justify-content: space-between;
			align-items: center;
		  }
		  .features-list .feature {
			display: flex;
			align-items: center;
			margin: 15px 15px 15px 0;
			flex-basis: 50%;
		  }
		  .features-list .feature div:last-child {
			font-size: 17px;
			font-style: italic;
			font-weight: 500;
			margin-left: 10px;
		  }
		  .features-list .feature div:first-child {
			width: 60px;
			border-radius: 50%;
			overflow: hidden;
			background-color: #576fdb;
			padding: 13px;
			margin-right: 10px;
		  }
		  .features-list .feature img {
			width: 100%;
		  }
		  .support-link {
			opacity: 0.9;
		  }
	
		  .social-icon {
			margin-bottom: 30px;
		  }
		  .social-icon a img {
			width: 30px;
		  }
		</style>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link
		  rel="stylesheet"
		  href="https://cdn.rawgit.com/mfd/09b70eb47474836f25a21660282ce0fd/raw/e06a670afcb2b861ed2ac4a1ef752d062ef6b46b/Gilroy.css"
		/>
	  </head>
	
	  <body class="body">
		<div class="main-container">
		  <div class="logo"></div>
		  <div class="message-section">
			<div class="title">Welcome to Bloomi5</div>
			<h2>Hi ${data.firstName},</h2>
			<h3>
			  Congratulations on registering to ALAZKA for knowledge process automation platform built for business users! We are excited to
			  welcome you on board with following benefits with your trial account:
			</h3>
			<div class="features-list">
			  <div class="feature-row feature-row-1">
				<div class="feature feature-1">
				  <div>
					<img src="https://alazkauserprofile.blob.core.windows.net/kapp-email-assets/invoice-icon.png" />
				  </div>
				  <div>Easy and quick Invoice processing</div>
				</div>
				<div class="feature feature-2">
				  <div>
					<img src="https://alazkauserprofile.blob.core.windows.net/kapp-email-assets/receipt.png" />
				  </div>
				  <div>Real-time extraction from Receipts</div>
				</div>
			  </div>
			  <div class="feature-row feature-row-2">
				<div class="feature feature-3">
				  <div>
					<img src="https://alazkauserprofile.blob.core.windows.net/kapp-email-assets/kyc.png" />
				  </div>
				  <div>Identity data retrieval for KYC</div>
				</div>
				<div class="feature feature-4">
				  <div>
					<img src="https://alazkauserprofile.blob.core.windows.net/kapp-email-assets/business-card.png" />
				  </div>
				  <div>Digitize your important business cards</div>
				</div>
			  </div>
			  <div class="feature-row feature-row-3">
				<div class="feature feature-5">
				  <div>
					<img src="https://alazkauserprofile.blob.core.windows.net/kapp-email-assets/apis.png" />
				  </div>
				  <div>API access to use with your application</div>
				</div>
				<div class="feature feature-6">
				  <div>
					<img src="https://alazkauserprofile.blob.core.windows.net/kapp-email-assets/any-document.png" />
				  </div>
				  <div>Out-of-the-box custom document extraction</div>
				</div>
			  </div>
			</div>
	
			<p class="support-link">
			  If you have any questions, please don't hesitate to contact us <a href="mailto:${config.appConstant.BUSINESS_EMAIL}">${config.appConstant.BUSINESS_EMAIL}</a>
			</p>
	
			<a href="https://kapp.Bloomi5/account/sign-in" class="sign-in-btn">
			  <button>Start Automating</button>
			</a>
	
			<div class="footer-container">
			  <div class="logo">
				<img src="https://alazkauserprofile.blob.core.windows.net/kapp-email-assets/alazka-logo.svg" />
			  </div>
			</div>
		  </div>
		</div>
	  </body>
	</html>	
	
	`,
  };
};

const passwordUpdated = (data: IMailData) => {
  return {
    to: `${data.toEmail}`, // list of receivers (who receives)
    subject: "Bloomi5 - Password Updated ", // Subject line
    text: "", // plaintext body
    html: `<b> Hello ${data.firstName}</b><br>Your password is updated successfully. <br>
        `,
  };
};

export interface ContactUs {
  name: string;
  toEmail: string;
  email: string;
  planName: string;
  subject: IEMIL_TYPE;
  message?: User;
}

const contactUsTemplate = (data: ContactUs) => {
  return {
    to: `${data.toEmail}`, // list of receivers (who receives)
    subject: "Bloomi5 - Subscription Enquiry ", // Subject line
    text: "", // plaintext body
    html: `

		<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Subscription Form Submission</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; padding: 20px;">
        <tr>
            <td>
                <h1 style="color: #4a5568; text-align: center;">New Subscription Form Submission</h1>
                <p style="text-align: center;">A user has submitted a new message through the subscription form.</p>
                
                <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #ffffff; border-radius: 5px; margin-top: 20px;">
                    <tr>
                        <td style="border-bottom: 1px solid #e2e8f0;"><strong>Name:</strong></td>
                        <td style="border-bottom: 1px solid #e2e8f0;">${data.name}</td>
                    </tr>
                    <tr>
                        <td style="border-bottom: 1px solid #e2e8f0;"><strong>Email:</strong></td>
                        <td style="border-bottom: 1px solid #e2e8f0;">${data.email}</td>
                    </tr>
                    <tr>
                        <td style="border-bottom: 1px solid #e2e8f0;"><strong>Plan:</strong></td>
                        <td style="border-bottom: 1px solid #e2e8f0;">${data.planName}</td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding-top: 20px;"><strong>Message:</strong></td>
                    </tr>
                    <tr>
                        <td colspan="2" style="background-color: #f1f5f9; border-radius: 5px; padding: 15px;">
                            ${data.message}
                        </td>
                    </tr>
                </table>
                
                <p style="text-align: center; margin-top: 20px; color: #718096;">This is an automated email. Please do not reply directly to this message.</p>
            </td>
        </tr>
    </table>
</body>
</html>



			`,
  };
};

export const sitePublishNotification = async (data: IMailData) => {
  return {
    to: `${data.toEmail}`,
    subject: "🎉 Your Website is Live! - Bloomi5",
    text: "",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Website is Live!</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333333; line-height: 1.6; margin: 0; padding: 0;">
    <table align="center" width="600" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 20px; background-color: #f7f7f7;">
                <h1 style="color: #4CAF50;">🎉 Your Site is Now Live!</h1>
                <p style="font-size: 18px; margin: 0;">Congratulations on publishing your website</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #ffffff;">
                <p style="font-size: 16px; margin: 0;">
                    Dear ${data.toEmail},
                </p>
                <p style="font-size: 16px; margin: 20px 0;">
                    Great news! Your website has been successfully published and is now live. You can visit your site at:
                </p>
                <p style="text-align: center;">
                    <a href="${
                      data.link
                    }" style="display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #4CAF50; text-decoration: none; font-size: 16px; border-radius: 5px;">View Your Website</a>
                </p>
                <p style="font-size: 16px; margin: 20px 0;">
                    Or copy this URL into your browser:
                    <br>
                    <span style="color: #4CAF50;">${data.link}</span>
                </p>
                <p style="font-size: 16px; margin: 20px 0;">
                    What's next?
                </p>
                <ul style="font-size: 16px; margin: 20px 0;">
                    <li>Share your website link with your customers</li>
                    <li>Monitor your website's performance</li>
                    <li>Keep your content fresh and updated</li>
                </ul>
                <p style="font-size: 16px; margin: 20px 0;">
                    Need help? Our support team is always here to assist you at <a href="mailto:${
                      config.appConstant.BUSINESS_EMAIL
                    }" style="color: #4CAF50;">${config.appConstant.BUSINESS_EMAIL}</a>
                </p>
                <p style="font-size: 16px; margin: 20px 0;">
                    Best regards,<br>
                    <strong>The Bloomi5 Team</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #f7f7f7; font-size: 14px; color: #666666;">
                &copy; ${new Date().getFullYear()} Bloomi5. All rights reserved.
            </td>
        </tr>
    </table>
</body>
</html>
    `,
  };
};

export const registerUserInvitation = async (data: IMailData) => {
  const invitationLink = `${data.clientUrl}/user/invitation/register?token=${data.token}&organizationName=${data.organizationName}&storeName=${data.storeName}`;
  return {
    to: `${data.toEmail}`, // list of receivers (who receives)
    subject: `${data?.organizationName} - You're Invited to Join!`, // Subject line
    text: "", // plaintext body
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>You're Invited to Join ${data.organizationName}</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333333; line-height: 1.6; margin: 0; padding: 0;">
		<table align="center" width="600" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
				<tr>
						<td align="center" style="padding: 20px; background-color: #f7f7f7;">
								<h1 style="color: #4CAF50;">🎉 You're Invited to Join ${data.organizationName}!</h1>
								<p style="font-size: 18px; margin: 0;">We are excited to have you on board.</p>
						</td>
				</tr>
				<tr>
						<td style="padding: 20px; background-color: #ffffff;">
								<p style="font-size: 16px; margin: 0;">
										Dear ${data.toEmail},
								</p>
								<p style="font-size: 16px; margin: 20px 0;">
										You have been invited to join ${data.organizationName}. Click the button below to complete your registration:
								</p>
								<p style="text-align: center;">
										<a href="${invitationLink}" style="display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #4CAF50; text-decoration: none; font-size: 16px; border-radius: 5px;">Accept Invitation</a>
								</p>
								<p style="font-size: 16px; margin: 20px 0;">
										If the button above does not work, copy and paste the following link into your browser:
										<br>
										<span style="color: #4CAF50;">${invitationLink}</span>
								</p>
								<p style="font-size: 16px; margin: 20px 0;">
										If you have any questions, feel free to reach out to our support team at 
										<a href="mailto:${config.appConstant.BUSINESS_EMAIL}" style="color: #4CAF50;">${config.appConstant.BUSINESS_EMAIL}</a>.
								</p>
								<p style="font-size: 16px; margin: 20px 0;">
										Best regards,<br>
										<strong>The ${data.organizationName} Team</strong>
								</p>
						</td>
				</tr>
				<tr>
						<td style="padding: 20px; text-align: center; background-color: #f7f7f7; font-size: 14px; color: #666666;">
								&copy; ${new Date().getFullYear()} ${data.organizationName}. All rights reserved.
						</td>
				</tr>
		</table>
</body>
</html>
		`,
  };
};

export const orderPlacedEmail = async (data: IMailData) => {
  // Get initials from store name (first letter of each word, uppercase)
  const storeInitials = (data?.storeName || "")
    .split(" ")
    .map((word) => word?.charAt(0).toUpperCase())
    .join("");

  return {
    to: `${data.toEmail}`, // list of receivers (who receives)
    subject: `🎉 Order Placed Successfully - Order #${data?.orderInfo?.orderNumber}`, // Subject line
    text: "", // plaintext body
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Order Placed Successfully</title>
	<style>
				.small-gray { font-size: 12px; color: #888; margin-right: 10px; }
			</style>
</head>
<body style="font-family: Arial, sans-serif; color: #333333; line-height: 1.6; margin: 0; padding: 0;">
<table align="center" width="600" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
		<tr>
				<td align="center" style="padding: 20px; background-color: #f7f7f7;">
						<h1 style="color: #4CAF50;">🎉 Thank You for Your Order!</h1>
						<p style="font-size: 18px; margin: 0;">Order #${data?.orderInfo?.orderNumber}</p>
				</td>
		</tr>
		<tr>
				<td style="padding: 20px; background-color: #ffffff;">
						<p style="font-size: 16px; margin: 0;">
								Dear ${data.firstName},
						</p>
						<p style="font-size: 16px; margin: 20px 0;">
								We are excited to let you know that your order has been successfully placed. Here are the details:
						</p>

						<h3 style="margin: 20px 0;">Order Details:</h3>
						<table width="100%" style="border-collapse: collapse; margin: 20px 0;">
								<tr style="background-color: #f7f7f7;">
										<th style="padding: 10px; text-align: left;">Item</th>
										<th style="padding: 10px; text-align: right;">Quantity</th>
										<th style="padding: 10px; text-align: right;">Price</th>
								</tr>
								${data?.orderInfo?.orderItems
                  .map(
                    (item) => `
										<tr>
												<td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
												<td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.quantity}</td>
												<td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
										</tr>
								`
                  )
                  .join("")}
								${`
								<tr>
										<td colspan="2" style="padding: 10px; text-align: right;">Shipping Charges:</td>
										<td style="padding: 10px; text-align: right;">₹${data?.shippingCost?.toFixed(2) || "0.00"}</td>
								</tr>
								`}
								<tr>
										<td colspan="2" style="padding: 10px; text-align: right;">
										<span class="small-gray">Inclusive all taxes and charges</span>
										<strong>Total:</strong></td>
										<td style="padding: 10px; text-align: right;"><strong>₹${data?.orderInfo?.orderTotal.toFixed(2)}</strong></td>
								</tr>
						</table>


						<p style="font-size: 16px; margin: 20px 0;">
								You will receive another email once your order is shipped. If you have any questions, feel free to contact us at 
								<a href="mailto:${data?.storeEmail}" style="color: #4CAF50;">
										${data?.storeEmail}
								</a>.
						</p>

						<p style="font-size: 16px; margin: 20px 0;">
								Thank you for shopping with us!<br>
								<strong>team ${storeInitials}</strong>
						</p>
				</td>
		</tr>
		<tr>
				<td style="padding: 20px; text-align: center; background-color: #f7f7f7; font-size: 14px; color: #666666;">
						&copy; ${new Date().getFullYear()} ${storeInitials}. All rights reserved.
				</td>
		</tr>
</table>
</body>
</html>
`,
  };
};

export const orderPlacedAdminEmail = async (data: IMailData) => {
  // Get initials from store name (first letter of each word, uppercase)
  const storeInitials = (data?.storeName || "")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
  return {
    to: `${data.storeEmail}`, // Admin/store owner email
    subject: `🛒 New Order Placed - Order #${data?.orderInfo?.orderNumber}`,
    text: "",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Order Notification</title>
  <style>
          .small-gray { font-size: 12px; color: #888; margin-right: 10px; }
        </style>
</head>
<body style="font-family: Arial, sans-serif; color: #333333; line-height: 1.6; margin: 0; padding: 0;">
<table align="center" width="600" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
	<tr>
		<td align="center" style="padding: 20px; background-color: #f7f7f7;">
			<h1 style="color: #4CAF50;">🛒 New Order Received!</h1>
			<p style="font-size: 18px; margin: 0;">Order #${data?.orderInfo?.orderNumber}</p>
		</td>
	</tr>
	<tr>
		<td style="padding: 20px; background-color: #ffffff;">
			<p style="font-size: 16px; margin: 0;">
				Hello ${storeInitials} Admin,
			</p>
			<p style="font-size: 16px; margin: 20px 0;">
				A new order has been placed on your store. Here are the details:
			</p>
			<h3 style="margin: 20px 0;">Order Details:</h3>
			<table width="100%" style="border-collapse: collapse; margin: 20px 0;">
				<tr style="background-color: #f7f7f7;">
					<th style="padding: 10px; text-align: left;">Item</th>
					<th style="padding: 10px; text-align: right;">Quantity</th>
					<th style="padding: 10px; text-align: right;">Price</th>
				</tr>
				${data?.orderInfo?.orderItems
          .map(
            (item) => `
				<tr>
					<td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
					<td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.quantity}</td>
					<td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
				</tr>
				`
          )
          .join("")}
				${`
				<tr>
					<td colspan="2" style="padding: 10px; text-align: right;">Shipping Charges:</td>
					<td style="padding: 10px; text-align: right;">₹${data?.shippingCost?.toFixed(2) || "0.00"}</td>
				</tr>
				`}
				<tr>
					<td colspan="2" style="padding: 10px; text-align: right;">
					<span class="small-gray">Inclusive all taxes and charges</span>
					<strong>Total:</strong></td>
					<td style="padding: 10px; text-align: right;"><strong>₹${data?.orderInfo?.orderTotal.toFixed(2)}</strong></td>
				</tr>
			</table>




			<!-- Shipping Details UI -->
<div style="max-width: 600px; font-family: Arial, sans-serif; border: 1px solid #eee; border-radius: 8px; background: #fafbfc; padding: 24px; margin: 24px auto;">
  <div style="font-weight: bold; color: #555; margin-bottom: 16px; letter-spacing: 1px;">SHIPPING TO</div>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="color: #888; font-weight: 500; padding: 8px 0; width: 80px;">Name</td>
      <td style="color: #222; padding: 8px 0;">${data?.shippingAddress?.name}</td>
    </tr>
    <tr>
      <td style="color: #888; font-weight: 500; padding: 8px 0;">Address</td>
      <td style="color: #222; padding: 8px 0;">
       ${data?.shippingAddress?.line1},<br>
       ${data?.shippingAddress?.line2} <br>
        ${data?.shippingAddress?.city} - ${data?.shippingAddress?.zip},<br>
       ${data?.shippingAddress?.state}, ${data?.shippingAddress?.country}

	   ${data?.shippingAddress?.landmark && "Landmark :" + data?.shippingAddress?.landmark}
      </td>
    </tr>
    <tr>
      <td style="color: #888; font-weight: 500; padding: 8px 0;">Contact:</td>
      <td style="color: #222; padding: 8px 0;">+${data?.shippingAddress?.phone}</td>
    </tr>
    <tr>
      <td style="color: #888; font-weight: 500; padding: 8px 0;">Email:</td>
      <td style="color: #222; padding: 8px 0;">${data.toEmail}</td>
    </tr>
  </table>
</div>



			<p style="font-size: 16px; margin: 20px 0;">
				Please process this order promptly.
			</p>
			<p style="font-size: 16px; margin: 20px 0;">
				Best regards,<br>
				<strong>Team Bloomi5</strong>
			</p>
		</td>
	</tr>
	<tr>
		<td style="padding: 20px; text-align: center; background-color: #f7f7f7; font-size: 14px; color: #666666;">
			&copy; ${new Date().getFullYear()} Bloomi5. All rights reserved.
		</td>
	</tr>
</table>
</body>
</html>
	`,
  };
};

export const orderStatusEmail = async (data: IMailData) => {
  // Get initials from store name (first letter of each word, uppercase)
  const storeInitials = (data?.storeName || "")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
  const statusMessages: any = {
    CONFIRMED: {
      title: "🛍️ Order Received - Thank You!",
      message: "We have received your order and will begin processing it shortly.",
    },
    PROCESSING: {
      title: "🔄 Order Being Processed",
      message: "Your order is currently being processed and prepared for shipping.",
    },
    PACKED: {
      title: "🔄 Order Being Packed",
      message: "Your order is being packed and will be shipped soon.",
    },
    SHIPPED: {
      title: "🔄 Order Being Shipped",
      message: "Your order has been shipped and is on its way to you.",
    },
    DELIVERED: {
      title: "✅ Order Completed",
      message: "Your order has been completed and shipped. Thank you for shopping with us!",
    },
    CANCELLED: {
      title: "❌ Order Cancelled",
      message: "Your order has been cancelled as requested.",
    },
    RETURNED: {
      title: "❌ Order Returned",
      message: "Your order has been returned as requested.",
    },
  };

  const status = statusMessages[data?.orderInfo?.orderStatus as keyof typeof statusMessages];

  return {
    to: `${data.toEmail}`,
    subject: `${status.title} - Order #${data?.orderInfo?.orderNumber}`,
    text: "",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Order Status Update</title>
	  <style>
          .small-gray { font-size: 12px; color: #888; margin-right: 10px; }
        </style>
</head>
<body style="font-family: Arial, sans-serif; color: #333333; line-height: 1.6; margin: 0; padding: 0;">
	<table align="center" width="600" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
			<tr>
					<td align="center" style="padding: 20px; background-color: #f7f7f7;">
							<h1 style="color: #4CAF50;">${status.title}</h1>
							<p style="font-size: 18px; margin: 0;">Order #${data?.orderInfo?.orderNumber}</p>
					</td>
			</tr>
			<tr>
					<td style="padding: 20px; background-color: #ffffff;">
							<p style="font-size: 16px; margin: 0;">
									Dear ${data.firstName},
							</p>
							<p style="font-size: 16px; margin: 20px 0;">
									${status.message}
							</p>

							<h3 style="margin: 20px 0;">Order Details:</h3>
							<table width="100%" style="border-collapse: collapse; margin: 20px 0;">
									<tr style="background-color: #f7f7f7;">
											<th style="padding: 10px; text-align: left;">Item</th>
											<th style="padding: 10px; text-align: right;">Quantity</th>
											<th style="padding: 10px; text-align: right;">Price</th>
									</tr>
									${data?.orderInfo?.orderItems
                    .map(
                      (item) => `
											<tr>
													<td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
													<td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.quantity}</td>
													<td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
											</tr>
									`
                    )
                    .join("")}
									${`
									<tr>
											<td colspan="2" style="padding: 10px; text-align: right;">Shipping Charges:</td>
											<td style="padding: 10px; text-align: right;">₹${data?.shippingCost?.toFixed(2) || "0.00"}</td>
									</tr>
									`}
									<tr>
											<td colspan="2" style="padding: 10px; text-align: right;">
											<span class="small-gray">Inclusive all taxes and charges</span>
											<strong>Total:</strong></td>
											<td style="padding: 10px; text-align: right;"><strong>₹${data?.orderInfo?.orderTotal.toFixed(2)}</strong></td>
									</tr>
							</table>

							<p style="font-size: 16px; margin: 20px 0;">
									If you have any questions about your order, please contact us at 
									<a href="mailto:${data?.storeEmail}" style="color: #4CAF50;">
											${data?.storeEmail}
									</a>
							</p>

							<p style="font-size: 16px; margin: 20px 0;">
									Thank you for shopping with us!<br>
									<strong> team ${storeInitials}</strong>
							</p>
					</td>
			</tr>
			<tr>
					<td style="padding: 20px; text-align: center; background-color: #f7f7f7; font-size: 14px; color: #666666;">
							&copy; ${new Date().getFullYear()} ${storeInitials}. All rights reserved.
					</td>
			</tr>
	</table>
</body>
</html>
	`,
  };
};

export default {
  accountVerification,
  accountActivated,
  resetPassword,
  accountVerified,
  passwordUpdated,
  accountActivation,
  freeTrialCongratulation,
  contactUsTemplate,
  orderStatusEmail,
  sitePublishNotification,
  registerUserInvitation,
  orderPlacedEmail,
  orderPlacedAdminEmail,
};
