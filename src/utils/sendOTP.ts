import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); 

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTP = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your account - OTP Code",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            color: #333;
            line-height: 1.6;
          }
          
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }
          
          .header {
            background: linear-gradient(135deg, #002f34 0%, #23e5db 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
          }
          
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="0.8" fill="rgba(255,255,255,0.08)"/><circle cx="40" cy="80" r="1.2" fill="rgba(255,255,255,0.06)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
            opacity: 0.3;
          }
          
          .logo {
            font-size: 36px;
            font-weight: bold;
            color: #ffffff;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
          }
          
          .tagline {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            position: relative;
            z-index: 1;
          }
          
          .content {
            padding: 50px 30px;
            text-align: center;
          }
          
          .welcome-text {
            font-size: 28px;
            font-weight: 600;
            color: #002f34;
            margin-bottom: 20px;
          }
          
          .description {
            font-size: 16px;
            color: #666;
            margin-bottom: 40px;
            line-height: 1.8;
          }
          
          .otp-container {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border: 2px dashed #23e5db;
            border-radius: 16px;
            padding: 30px;
            margin: 30px 0;
            position: relative;
          }
          
          .otp-label {
            font-size: 14px;
            color: #002f34;
            font-weight: 600;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .otp-code {
            font-size: 48px;
            font-weight: bold;
            color: #002f34;
            letter-spacing: 8px;
            margin: 20px 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            font-family: 'Courier New', monospace;
          }
          
          .otp-note {
            font-size: 12px;
            color: #666;
            margin-top: 15px;
          }
          
          .security-note {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
            display: flex;
            align-items: center;
            gap: 15px;
          }
          
          .security-icon {
            width: 24px;
            height: 24px;
            background: #f39c12;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            flex-shrink: 0;
          }
          
          .security-text {
            font-size: 14px;
            color: #856404;
            line-height: 1.5;
          }
          
          .help-section {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
          }
          
          .help-title {
            font-size: 18px;
            font-weight: 600;
            color: #002f34;
            margin-bottom: 15px;
          }
          
          .help-text {
            font-size: 14px;
            color: #666;
            margin-bottom: 20px;
          }
          
          .contact-button {
            display: inline-block;
            background: linear-gradient(135deg, #002f34 0%, #004d40 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 47, 52, 0.3);
          }
          
          .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
          }
          
          .footer-text {
            font-size: 12px;
            color: #666;
            line-height: 1.8;
          }
          
          .social-links {
            margin: 20px 0;
          }
          
          .social-link {
            display: inline-block;
            width: 40px;
            height: 40px;
            background: #e9ecef;
            border-radius: 50%;
            margin: 0 10px;
            line-height: 40px;
            color: #666;
            text-decoration: none;
            transition: all 0.3s ease;
          }
          
          .social-link:hover {
            background: #23e5db;
            color: white;
            transform: translateY(-2px);
          }
          
          .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, #e9ecef 50%, transparent 100%);
            margin: 30px 0;
          }
          
          @media (max-width: 600px) {
            .container {
              margin: 10px;
              border-radius: 8px;
            }
            
            .header {
              padding: 30px 20px;
            }
            
            .content {
              padding: 30px 20px;
            }
            
            .otp-code {
              font-size: 36px;
              letter-spacing: 4px;
            }
            
            .welcome-text {
              font-size: 24px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <div class="logo">MarketPlace</div>
            <div class="tagline">Buy • Sell • Connect</div>
          </div>
          
          <!-- Content -->
          <div class="content">
            <div class="welcome-text">Welcome Back!</div>
            <p class="description">
              We received a request to verify your account. Please use the One-Time Password (OTP) below to complete your verification.
            </p>
            
            <!-- OTP Section -->
            <div class="otp-container">
              <div class="otp-label">Your Verification Code</div>
              <div class="otp-code">${otp}</div>
              <div class="otp-note">This code expires in 10 minutes</div>
            </div>
            
            <!-- Security Note -->
            <div class="security-note">
              <div class="security-icon">!</div>
              <div class="security-text">
                <strong>Keep this code secure:</strong> Never share your OTP with anyone. Our team will never ask for your verification code.
              </div>
            </div>
            
            <div class="divider"></div>
            
            <!-- Help Section -->
            <div class="help-section">
              <div class="help-title">Need Help?</div>
              <p class="help-text">
                If you didn't request this verification or need assistance, please contact our support team.
              </p>
              <a href="#" class="contact-button">Contact Support</a>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <div class="social-links">
              <a href="#" class="social-link">f</a>
              <a href="#" class="social-link">t</a>
              <a href="#" class="social-link">@</a>
            </div>
            
            <div class="footer-text">
              This email was sent to ${email}<br>
              If you have questions, visit our Help Center or contact us.<br><br>
              
              <strong>MarketPlace Team</strong><br>
              Your trusted marketplace for buying and selling<br><br>
              
              © 2024 MarketPlace. All rights reserved.
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ OTP sent:", result.response);
  } catch (error) {
    console.error("Email Error:", (error as Error).message);

    throw new Error("Failed to send OTP");
  }
};