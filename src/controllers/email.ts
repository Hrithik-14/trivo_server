import { User } from "../models/user"
import nodemailer from "nodemailer";

export const getWelcomeEmail = (name: string) => {
    return`
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <!-- Header with gradient -->
            <tr>
                <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="text-align: center;">
                                <h1 style="margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                                    Welcome to TRIVO Solutions!
                                </h1>
                                <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: 300; opacity: 0.9;">
                                    Innovation meets excellence
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <!-- Main content -->
            <tr>
                <td style="padding: 40px; background-color: #ffffff;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td>
                                <h2 style="color: #2c3e50; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">
                                    Hello ${name}!
                                </h2>
                                <p style="color: #5a6c7d; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                    Thank you for joining <strong style="color: #667eea;">TRIVO Solutions</strong>. We're excited to have you as part of our innovative tech community and look forward to building the future together!
                                </p>
                                <p style="color: #5a6c7d; font-size: 16px; line-height: 1.6; margin: 0;">
                                    Need assistance? Our support team is available 24/7 to help you succeed. Just reply to this email!
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <!-- Stats section -->
            <tr>
                <td style="padding: 40px; background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="text-align: center; padding-bottom: 30px;">
                                <h3 style="color: #2c3e50; font-size: 20px; margin: 0; font-weight: 600;">
                                    Join thousands of innovators
                                </h3>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="text-align: center; width: 33.33%; padding: 0 10px;">
                                            <div style="background-color: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                                                <h4 style="color: #667eea; font-size: 28px; margin: 0; font-weight: 700;">10K+</h4>
                                                <p style="color: #5a6c7d; font-size: 14px; margin: 5px 0 0 0;">Active Users</p>
                                            </div>
                                        </td>
                                        <td style="text-align: center; width: 33.33%; padding: 0 10px;">
                                            <div style="background-color: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                                                <h4 style="color: #667eea; font-size: 28px; margin: 0; font-weight: 700;">500+</h4>
                                                <p style="color: #5a6c7d; font-size: 14px; margin: 5px 0 0 0;">Projects</p>
                                            </div>
                                        </td>
                                        <td style="text-align: center; width: 33.33%; padding: 0 10px;">
                                            <div style="background-color: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                                                <h4 style="color: #667eea; font-size: 28px; margin: 0; font-weight: 700;">99.9%</h4>
                                                <p style="color: #5a6c7d; font-size: 14px; margin: 5px 0 0 0;">Uptime</p>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <!-- Footer -->
            <tr>
                <td style="padding: 30px 40px; background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); text-align: center; color: #bdc3c7;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="text-align: center; padding-bottom: 15px;">
                                <p style="margin: 0; font-size: 14px; line-height: 1.5;">
                                    © 2025 TRIVO Solutions, All rights reserved.<br>
                                    <span style="color: #667eea;">Transforming ideas into reality.</span>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center; padding-top: 15px; border-top: 1px solid #495057;">
                                <p style="margin: 0; font-size: 12px; color: #95a5a6;">
                                    You received this email because you signed up for TRIVO Solutions.<br>
                                    <a href="#" style="color: #667eea; text-decoration: none;">Unsubscribe</a> | 
                                    <a href="#" style="color: #667eea; text-decoration: none;">Privacy Policy</a> |
                                    <a href="#" style="color: #667eea; text-decoration: none;">Contact Support</a>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    `
}

export const getSetPassword = (name: string, setPasswordLink: string) => {
    return `
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <!-- Header -->
            <tr>
                <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="text-align: center;">
                                <h1 style="margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                                    TRIVO Solutions
                                </h1>
                                <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: 300; opacity: 0.9;">
                                    Secure. Reliable. Professional.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <!-- Main Content -->
            <tr>
                <td style="padding: 40px; background-color: #ffffff;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td>
                                <h2 style="color: #2c3e50; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">
                                    Hello ${name}!
                                </h2>
                                <p style="color: #5a6c7d; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                    Welcome to TRIVO Solutions! We're excited to have you on board. To get started, please set up your account password by clicking the button below.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <!-- CTA Button -->
            <tr>
                <td style="text-align: center; padding: 0 40px 40px;">
                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                        <tr>
                            <td>
                                <a href="${setPasswordLink}" 
                                  style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); transition: all 0.3s ease;">
                                    Set Your Password
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <!-- Security Notice -->
            <tr>
                <td style="padding: 0 40px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%); border-radius: 12px; border: 1px solid #e2e8f0;">
                        <tr>
                            <td style="padding: 25px;">
                                <h3 style="color: #2c3e50; font-size: 16px; margin: 0 0 15px 0; font-weight: 600;">
                                    🔒 Security Note
                                </h3>
                                <p style="color: #5a6c7d; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">
                                    This link will expire in 24 hours for your security.
                                </p>
                                <p style="color: #5a6c7d; font-size: 14px; line-height: 1.6; margin: 0;">
                                    If you didn't request this, please ignore this email or contact our support team.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <!-- Footer -->
            <tr>
                <td style="padding: 30px 40px; background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); text-align: center; color: #bdc3c7;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="text-align: center; padding-bottom: 15px;">
                                <p style="margin: 0; font-size: 14px; line-height: 1.5;">
                                    Questions? Contact us at 
                                    <a href="mailto:support@trivosolutions.com" style="color: #667eea; text-decoration: none;">support@trivosolutions.com</a>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center; padding-top: 15px; border-top: 1px solid #495057;">
                                <p style="margin: 0; font-size: 12px; color: #95a5a6;">
                                    © 2025 TRIVO Solutions. All rights reserved.<br>
                                    123 Business Street, City, State 12345
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    `
}

export const getEmployeeReportEmail = ({
  employeeName,
  managerName,
  reports,
}: {
  employeeName: string;
  managerName: string;
  reports: {
    date: string;
    startTime: string;
    endTime: string;
    effectiveHours: string;
    performance: string;
  }[];
}) => {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <!-- Header -->
        <tr>
            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff;">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="text-align: center;">
                            <h1 style="margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                                📊 New Report Submitted
                            </h1>
                            <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: 300; opacity: 0.9;">
                                Employee Activity Report
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
            <td style="padding: 40px; background-color: #ffffff;">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td>
                            <h2 style="color: #2c3e50; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">
                                Dear ${managerName},
                            </h2>
                            <p style="color: #5a6c7d; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                <strong style="color: #667eea;">${employeeName}</strong> has submitted ${reports.length} report(s). Please find the details below:
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Reports Table -->
        <tr>
            <td style="padding: 0 40px 40px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%); border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <!-- Table Header -->
                    <tr>
                        <td colspan="5" style="padding: 20px; background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); color: #ffffff;">
                            <h3 style="margin: 0; font-size: 18px; font-weight: 600; text-align: center;">
                                Report Summary
                            </h3>
                        </td>
                    </tr>
                    <tr style="background: #667eea; color: #ffffff;">
                        <th style="padding: 15px 10px; text-align: left; font-size: 14px; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.2);">Date</th>
                        <th style="padding: 15px 10px; text-align: left; font-size: 14px; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.2);">Start Time</th>
                        <th style="padding: 15px 10px; text-align: left; font-size: 14px; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.2);">End Time</th>
                        <th style="padding: 15px 10px; text-align: left; font-size: 14px; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.2);">Hours</th>
                        <th style="padding: 15px 10px; text-align: left; font-size: 14px; font-weight: 600;">Performance</th>
                    </tr>
                    ${reports
                      .map(
                        (r, index) => `
                        <tr style="background: ${index % 2 === 0 ? '#ffffff' : '#f8faff'}; border-bottom: 1px solid #e2e8f0;">
                            <td style="padding: 15px 10px; color: #2c3e50; font-size: 14px; border-right: 1px solid #e2e8f0;">${r.date}</td>
                            <td style="padding: 15px 10px; color: #2c3e50; font-size: 14px; border-right: 1px solid #e2e8f0;">${r.startTime}</td>
                            <td style="padding: 15px 10px; color: #2c3e50; font-size: 14px; border-right: 1px solid #e2e8f0;">${r.endTime}</td>
                            <td style="padding: 15px 10px; color: #667eea; font-size: 14px; font-weight: 600; border-right: 1px solid #e2e8f0;">${r.effectiveHours}</td>
                            <td style="padding: 15px 10px; color: #2c3e50; font-size: 14px;">${r.performance || "—"}</td>
                        </tr>
                        `
                      )
                      .join("")}
                </table>
            </td>
        </tr>
        
        <!-- Action Note -->
        <tr>
            <td style="padding: 0 40px 40px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%); border-radius: 12px; border: 1px solid #e2e8f0;">
                    <tr>
                        <td style="padding: 25px; text-align: center;">
                            <p style="color: #5a6c7d; font-size: 16px; line-height: 1.6; margin: 0;">
                                Please review these reports at your convenience and provide any necessary feedback.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td style="padding: 30px 40px; background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); text-align: center; color: #bdc3c7;">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="text-align: center; padding-bottom: 15px;">
                            <p style="margin: 0; font-size: 14px; line-height: 1.5;">
                                © 2025 TRIVO Solutions, All rights reserved.<br>
                                <span style="color: #667eea;">Transforming ideas into reality.</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center; padding-top: 15px; border-top: 1px solid #495057;">
                            <p style="margin: 0; font-size: 12px; color: #95a5a6;">
                                This is an automated notification from the Employee Management System.<br>
                                <a href="#" style="color: #667eea; text-decoration: none;">Unsubscribe</a> | 
                                <a href="#" style="color: #667eea; text-decoration: none;">Privacy Policy</a> |
                                <a href="#" style="color: #667eea; text-decoration: none;">Contact Support</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
  `;
};

export const getLeaveRequestEmail = ({
  employeeName,
  managerName,
  leaveType,
  description,
  date,
}: {
  employeeName: string;
  managerName: string;
  leaveType: string;
  description: string;
  date: string;
}) => {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <!-- Header -->
        <tr>
            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff;">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="text-align: center;">
                            <h1 style="margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                                📅 Leave Request Application
                            </h1>
                            <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: 300; opacity: 0.9;">
                                Employee to Manager Communication
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
            <td style="padding: 40px; background-color: #ffffff;">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td>
                            <h2 style="color: #2c3e50; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">
                                Dear ${managerName},
                            </h2>
                            <p style="color: #5a6c7d; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                I would like to formally request leave from work and seek your approval for the following:
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Leave Details -->
        <tr>
            <td style="padding: 0 40px 40px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%); border-radius: 12px; border: 1px solid #e2e8f0;">
                    <tr>
                        <td style="padding: 25px;">
                            <h3 style="color: #2c3e50; font-size: 18px; margin: 0 0 25px 0; font-weight: 600; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                                Leave Request Details
                            </h3>
                            
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="width: 50%; padding: 0 15px 20px 0;">
                                        <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                                            <label style="display: block; font-weight: 600; color: #2c3e50; margin-bottom: 8px; font-size: 14px;">Employee Name:</label>
                                            <div style="color: #667eea; font-size: 16px; font-weight: 600;">${employeeName}</div>
                                        </div>
                                    </td>
                                    <td style="width: 50%; padding: 0 0 20px 15px;">
                                        <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                                            <label style="display: block; font-weight: 600; color: #2c3e50; margin-bottom: 8px; font-size: 14px;">Leave Type:</label>
                                            <div style="color: #667eea; font-size: 16px; font-weight: 600;">${leaveType}</div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="padding-bottom: 20px;">
                                        <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                                            <label style="display: block; font-weight: 600; color: #2c3e50; margin-bottom: 8px; font-size: 14px;">Leave Date(s):</label>
                                            <div style="color: #667eea; font-size: 16px; font-weight: 600;">${date}</div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                                            <label style="display: block; font-weight: 600; color: #2c3e50; margin-bottom: 8px; font-size: 14px;">Reason for Leave:</label>
                                            <div style="color: #5a6c7d; font-size: 14px; line-height: 1.6; padding: 10px; background: #f8faff; border-radius: 6px; min-height: 60px;">${description}</div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Closing -->
        <tr>
            <td style="padding: 0 40px 40px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%); border-radius: 12px; border: 1px solid #e2e8f0;">
                    <tr>
                        <td style="padding: 25px;">
                            <p style="color: #5a6c7d; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                Thank you for your consideration and understanding.
                            </p>
                            <p style="color: #2c3e50; font-size: 16px; margin: 0;">
                                Sincerely,<br><br>
                                <strong style="color: #667eea; font-size: 18px;">${employeeName}</strong>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td style="padding: 30px 40px; background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); text-align: center; color: #bdc3c7;">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="text-align: center; padding-bottom: 15px;">
                            <p style="margin: 0; font-size: 14px; line-height: 1.5;">
                                © 2025 TRIVO Solutions, All rights reserved.<br>
                                <span style="color: #667eea;">Transforming ideas into reality.</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center; padding-top: 15px; border-top: 1px solid #495057;">
                            <p style="margin: 0; font-size: 12px; color: #95a5a6;">
                                Leave Request Form - Employee to Manager Communication<br>
                                <a href="#" style="color: #667eea; text-decoration: none;">Unsubscribe</a> | 
                                <a href="#" style="color: #667eea; text-decoration: none;">Privacy Policy</a> |
                                <a href="#" style="color: #667eea; text-decoration: none;">Contact Support</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
  `;
};

export const acceptedleaveRequest = ({
  employeeName,
  status,
  date,
  managerName,
}: {
  employeeName: string;
  profileImage?: string;
  status: "Approve" | "Reject";
  date: string;
  managerName: string;
}) => {
    const statusColor = status === "Approve" ? "#28a745" : "#dc3545";
    const statusText = status === "Approve" ? "Approved ✅" : "Rejected ❌";
    const statusIcon = status === "Approve" ? "✅" : "❌";
    const statusMessage = status === "Approve" 
        ? "We're pleased to inform you that your leave request has been approved."
        : "We regret to inform you that your leave request has been declined.";
    const additionalInfo = status === "Approve"
        ? "Please ensure that you update your handover tasks and coordinate with your team prior to your leave."
        : "If you have any concerns or would like to discuss this decision further, please reach out to your manager directly.";

    return `
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <!-- Header -->
            <tr>
                <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="text-align: center;">
                                <h1 style="margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                                    ${statusIcon} Leave Request ${status === "Approve" ? "Approved" : "Rejected"}
                                </h1>
                                <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: 300; opacity: 0.9;">
                                    Leave Management System Notification
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <!-- Main Content -->
            <tr>
                <td style="padding: 40px; background-color: #ffffff;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td>
                                <h2 style="color: #2c3e50; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">
                                    Dear ${employeeName},
                                </h2>
                                <p style="color: #5a6c7d; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                    ${statusMessage}
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <!-- Status Details -->
            <tr>
                <td style="padding: 0 40px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%); border-radius: 12px; border: 2px solid ${statusColor};">
                        <tr>
                            <td style="padding: 30px; text-align: center;">
                                <div style="background: ${statusColor}; color: #ffffff; padding: 15px 25px; border-radius: 8px; display: inline-block; margin-bottom: 20px;">
                                    <h3 style="margin: 0; font-size: 20px; font-weight: 700;">
                                        Status: ${statusText}
                                    </h3>
                                </div>
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                                    <tr>
                                        <td style="width: 50%; padding: 10px; text-align: center; border-right: 1px solid #e2e8f0;">
                                            <div style="background: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                                                <label style="display: block; color: #5a6c7d; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Leave Date(s)</label>
                                                <div style="color: #2c3e50; font-size: 16px; font-weight: 600;">${date}</div>
                                            </div>
                                        </td>
                                        <td style="width: 50%; padding: 10px; text-align: center;">
                                            <div style="background: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                                                <label style="display: block; color: #5a6c7d; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Reviewed By</label>
                                                <div style="color: #2c3e50; font-size: 16px; font-weight: 600;">${managerName}</div>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <!-- Additional Information -->
            <tr>
                <td style="padding: 0 40px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%); border-radius: 12px; border: 1px solid #e2e8f0;">
                        <tr>
                            <td style="padding: 25px;">
                                <h3 style="color: #2c3e50; font-size: 16px; margin: 0 0 15px 0; font-weight: 600;">
                                    📋 Important Information
                                </h3>
                                <p style="color: #5a6c7d; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">
                                    ${additionalInfo}
                                </p>
                                <p style="color: #5a6c7d; font-size: 14px; line-height: 1.6; margin: 0;">
                                    Thank you for your cooperation and understanding.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <!-- Footer -->
            <tr>
                <td style="padding: 30px 40px; background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); text-align: center; color: #bdc3c7;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="text-align: center; padding-bottom: 15px;">
                                <p style="margin: 0; font-size: 14px; line-height: 1.5;">
                                    © 2025 TRIVO Solutions, All rights reserved.<br>
                                    <span style="color: #667eea;">Transforming ideas into reality.</span>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center; padding-top: 15px; border-top: 1px solid #495057;">
                                <p style="margin: 0; font-size: 12px; color: #95a5a6;">
                                    This is an automated notification from the Leave Management System.<br>
                                    Please do not reply directly to this email.<br>
                                    <a href="#" style="color: #667eea; text-decoration: none;">Unsubscribe</a> | 
                                    <a href="#" style="color: #667eea; text-decoration: none;">Privacy Policy</a> |
                                    <a href="#" style="color: #667eea; text-decoration: none;">Contact Support</a>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>`
};




export const adminMail = ({
  recipients,
  subject,
  content,
}: {
  recipients: string;
  subject: string;
  content: string;
}) => {
    return `
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <!-- Header -->
            <tr>
                <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="text-align: center;">
                                <h1 style="margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                                    📢 Admin Notification
                                </h1>
                                <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: 300; opacity: 0.9;">
                                    Administrative Communication System
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <!-- Subject -->
            <tr>
                <td style="padding: 30px 40px 20px; background-color: #ffffff;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td>
                                <h2 style="color: #2c3e50; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">
                                    ${subject}
                                </h2>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <!-- Recipients Info -->
            <tr>
                <td style="padding: 0 40px 30px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%); border-radius: 12px; border: 1px solid #e2e8f0;">
                        <tr>
                            <td style="padding: 25px; text-align: center;">
                                <div style="background: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                                    <label style="display: block; color: #5a6c7d; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Recipients</label>
                                    <div style="color: #2c3e50; font-size: 16px; font-weight: 600; word-break: break-word;">${recipients}</div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <!-- Main Content -->
            <tr>
                <td style="padding: 0 40px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%); border-radius: 12px; border: 2px solid #28a745;">
                        <tr>
                            <td style="padding: 30px;">
                                <div style="background: #28a745; color: #ffffff; padding: 15px 25px; border-radius: 8px; display: inline-block; margin-bottom: 25px;">
                                    <h3 style="margin: 0; font-size: 18px; font-weight: 700;">
                                        📋 Message Content
                                    </h3>
                                </div>
                                <div style="color: #2c3e50; font-size: 16px; line-height: 1.8; margin: 0; white-space: pre-line;">
                                    ${content}
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <!-- Additional Information -->
            <tr>
                <td style="padding: 0 40px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%); border-radius: 12px; border: 1px solid #e2e8f0;">
                        <tr>
                            <td style="padding: 25px;">
                                <h3 style="color: #2c3e50; font-size: 16px; margin: 0 0 15px 0; font-weight: 600;">
                                    ℹ️ Important Information
                                </h3>
                                <p style="color: #5a6c7d; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">
                                    If you have any questions or concerns regarding this message, please contact the administrative team directly.
                                </p>
                                <p style="color: #5a6c7d; font-size: 14px; line-height: 1.6; margin: 0;">
                                    Thank you for your cooperation and understanding.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <!-- Footer -->
            <tr>
                <td style="padding: 30px 40px; background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); text-align: center; color: #bdc3c7;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="text-align: center; padding-bottom: 15px;">
                                <p style="margin: 0; font-size: 14px; line-height: 1.5;">
                                    © 2025 TRIVO Solutions, All rights reserved.<br>
                                    <span style="color: #667eea;">Transforming ideas into reality.</span>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center; padding-top: 15px; border-top: 1px solid #495057;">
                                <p style="margin: 0; font-size: 12px; color: #95a5a6;">
                                    This is an automated notification from the Administrative System.<br>
                                    Please do not reply directly to this email.<br>
                                    <a href="#" style="color: #667eea; text-decoration: none;">Unsubscribe</a> | 
                                    <a href="#" style="color: #667eea; text-decoration: none;">Privacy Policy</a> |
                                    <a href="#" style="color: #667eea; text-decoration: none;">Contact Support</a>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>`
};