import { User } from "../models/user"
import nodemailer from "nodemailer";

export const getWelcomeEmail = (name: string) => {
    return`
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px;  overflow: hidden;">
                <!-- Header with Tech gradient -->
                <tr>
                    <td style=" padding: 40px 30px; text-align: center; position: relative;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="text-align: center;">
                                    
                                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                                        Welcome to TRIVO Solutions!
                                    </h1>
                                    <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: 300;">
                                        Innovation meets excellence
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 50px 40px; background-color: #ffffff;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td>
                                    <h2 style="color: #2c3e50; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">
                                        Hello Tech ${name}
                                    </h2>
                                    <p style="color: #5a6c7d; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                        Thank you for joining <strong style="color: #667eea;">TRIVO Solutions</strong>. We're excited to have you as part of our innovative tech community and look forward to building the future together!
                                    </p>
                                    
                                    
                                    
                                    <p style="color: #5a6c7d; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
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
                                <td style="text-align: center; padding-bottom: 20px;">
                                    <h3 style="color: #2c3e50; font-size: 20px; margin: 0 0 25px 0; font-weight: 600;">
                                        Join thousands of innovators
                                    </h3>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="text-align: center; width: 33.33%; padding: 0 10px;">
                                                <div style="background-color: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                                                    <h4 style="color: #667eea; font-size: 28px; margin: 0; font-weight: 700;">10K+</h4>
                                                    <p style="color: #5a6c7d; font-size: 14px; margin: 5px 0 0 0;">Active Users</p>
                                                </div>
                                            </td>
                                            <td style="text-align: center; width: 33.33%; padding: 0 10px;">
                                                <div style="background-color: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                                                    <h4 style="color: #667eea; font-size: 28px; margin: 0; font-weight: 700;">500+</h4>
                                                    <p style="color: #5a6c7d; font-size: 14px; margin: 5px 0 0 0;">Projects</p>
                                                </div>
                                            </td>
                                            <td style="text-align: center; width: 33.33%; padding: 0 10px;">
                                                <div style="background-color: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                                                    <h4 style="color: #667eea; font-size: 28px; margin: 0; font-weight: 700;">99.9%</h4>
                                                    <p style="color: #5a6c7d; font-size: 14px; margin: 5px 0 0 0;">Uptime</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </tr>
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
            <table class="w-full max-w-2xl mx-auto bg-white" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
        <!-- Header -->
        <tr>
            <td class="bg-blue-600 p-6 text-center">
                <table class="w-full" cellpadding="0" cellspacing="0">
                    <tr>
                        <td>
                            <h1 class="text-white text-2xl font-bold m-0">TRIVO Solutions</h1>
                            <p class="text-blue-100 text-sm m-0 mt-1">Secure. Reliable. Professional.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
            <td class="p-8">
                <table class="w-full" cellpadding="0" cellspacing="0">
                    <!-- Greeting -->
                    <tr>
                        <td class="pb-6">
                            <h2 class="text-2xl font-semibold text-gray-800 m-0">Hello ${name},</h2>
                        </td>
                    </tr>
                    
                    <!-- Welcome Message -->
                    <tr>
                        <td class="pb-6">
                            <p class="text-gray-600 text-base leading-6 m-0">
                                Welcome to TRIVO Solutions! We're excited to have you on board. To get started, please set up your account password by clicking the button below.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                        <td class="text-center py-8">
                            <table class="mx-auto" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="${setPasswordLink}" 
                                        style="
                                            display: inline-block;
                                            padding: 12px 24px;
                                            background-color: #2563eb; /* Tailwind bg-blue-600 */
                                            color: #ffffff;
                                            text-decoration: none;
                                            font-size: 16px;
                                            border-radius: 8px;
                                            font-weight: bold;
                                        ">
                                        Set Your Password
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Additional Info -->
                    <tr>
                        <td class="py-4">
                            <table class="w-full bg-gray-50 rounded-lg" cellpadding="0" cellspacing="0" style="border-radius: 8px;">
                                <tr>
                                    <td class="p-4">
                                        <p class="text-sm text-gray-600 m-0 mb-2">
                                            <strong>Security Note:</strong> This link will expire in 24 hours for your security.
                                        </p>
                                        <p class="text-sm text-gray-600 m-0">
                                            If you didn't request this, please ignore this email or contact our support team.
                                        </p>
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
            <td class="bg-gray-50 p-6 border-t border-gray-200">
                <table class="w-full" cellpadding="0" cellspacing="0">
                    <tr>
                        <td class="text-center pb-4">
                            <p class="text-sm text-gray-600 m-0">
                                Questions? Contact us at 
                                <a href="mailto:group4mmjh@gmail.com" class="text-blue-600 no-underline">support@trivosolutions.com</a>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-center">
                            <p class="text-xs text-gray-500 m-0">
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
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; background:#f9f9f9; padding:20px;">
      <tr>
        <td>
          <h2 style="color:#333;">New Report Submitted</h2>
          <p>Dear ${managerName},</p>
          <p><b>${employeeName}</b> has submitted ${reports.length} report(s).</p>
          <table width="100%" border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; margin-top:10px;">
            <tr style="background:#efefef;">
              <th align="left">Date</th>
              <th align="left">Start Time</th>
              <th align="left">End Time</th>
              <th align="left">Hours</th>
              <th align="left">Performance</th>
            </tr>
            ${reports
              .map(
                (r) => `
              <tr>
                <td>${r.date}</td>
                <td>${r.startTime}</td>
                <td>${r.endTime}</td>
                <td>${r.effectiveHours}</td>
                <td>${r.performance || "-"}</td>
              </tr>
            `
              )
              .join("")}
          </table>
          <p style="margin-top:20px;">Please review them at your convenience.</p>
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
 <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e0e0e0; font-family: 'Segoe UI', Arial, sans-serif; color: #333333;">
  <tr>
    <td style="padding: 25px; background: #7691b3ff; color: #ffffff; text-align: center; border-radius: 8px 8px 0 0;">
      <h2 style="margin: 0; font-size: 22px; font-weight: 600;">Leave Request Application</h2>
    </td>
  </tr>
  <tr>
    <td style="padding: 25px; line-height: 1.6;">
      <p style="font-size: 15px; margin: 0 0 20px;">Dear <strong>${managerName}</strong>,</p>
      <p style="font-size: 15px; margin: 0 0 20px;">
        I would like to formally request leave from work and seek your approval for the following:
      </p>
      
      <!-- Leave Request Details Section -->
      <div style="margin: 20px 0;">
        <h3 style="margin: 0 0 15px; font-size: 16px; color: #2c5282; border-bottom: 2px solid #2c5282; padding-bottom: 5px;">Leave Request Details</h3>
        
        <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 15px;">
          <div style="flex: 1; min-width: 250px;">
            <label style="display: block; font-weight: 600; color: #333; margin-bottom: 5px; font-size: 14px;">Employee Name:</label>
            <div style="padding: 12px; border: 1px solid #e0e0e0; background: #f8f9fa; border-radius: 4px; font-size: 14px;">${employeeName}</div>
          </div>
          <div style="flex: 1; min-width: 250px;">
            <label style="display: block; font-weight: 600; color: #333; margin-bottom: 5px; font-size: 14px;">Leave Type:</label>
            <div style="padding: 12px; border: 1px solid #e0e0e0; background: #f8f9fa; border-radius: 4px; font-size: 14px;">${leaveType}</div>
          </div>
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; font-weight: 600; color: #333; margin-bottom: 5px; font-size: 14px;">Leave Date(s):</label>
          <div style="padding: 12px; border: 1px solid #e0e0e0; background: #f8f9fa; border-radius: 4px; font-size: 14px;">${date}</div>
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; font-weight: 600; color: #333; margin-bottom: 5px; font-size: 14px;">Reason for Leave:</label>
          <div style="padding: 12px; border: 1px solid #e0e0e0; background: #f8f9fa; border-radius: 4px; font-size: 14px; min-height: 50px;">${description}</div>
        </div>
      </div>
      
      <p style="font-size: 15px; margin: 20px 0 0;">
        Thank you for your consideration and understanding.<br><br>
        Sincerely,<br><br>
        <strong>${employeeName}</strong>
      </p>
    </td>
  </tr>
  <tr>
    <td style="padding: 15px; background: #f5f5f5; text-align: center; font-size: 12px; color: #666666; border-radius: 0 0 8px 8px;">
      <strong>TRIVO Solutions Pvt. Ltd.</strong><br>
      Leave Request Form - Employee to Manager Communication
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
    const statusColor = status === "Approve" ? "#28a745" : "#dc3545"; // green or red
  const statusText = status === "Approve" ? "Approved ✅" : "Rejected ❌";
    return `
   <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f4f4f7; padding: 30px; font-family: Arial, sans-serif;">
    <tr>
      <td align="center">1
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 25px; text-align: center; background: #2c3e50; color: #ffffff;">
              <h2 style="margin: 0; font-size: 22px;">Leave Request ${statusText}</h2>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 25px; font-size: 15px; line-height: 1.6; color: #333;">
              <p style="margin: 0 0 15px 0;">Dear <b>${employeeName}</b>,</p>
              
              <p style="margin: 0 0 15px 0;">
                We would like to inform you that your leave request for <b>${date}</b> has been 
                <span style="color: ${statusColor}; font-weight: bold;">${status}</span> by your manager, <b>${managerName}</b>.
              </p>

              ${
                status === "Approve"
                  ? `<p style="margin: 0 0 15px 0;">Please ensure that you update your handover tasks and coordinate with your team prior to your leave.</p>`
                  : `<p style="margin: 0 0 15px 0;">If you have any concerns or would like to discuss this decision further, please reach out to <b>${managerName}</b> directly.</p>`
              }
              
              <p style="margin: 0;">Thank you for your cooperation.</p>
            </td>
          </tr>
          
          
          <!-- Footer -->
          <tr>
            <td style="padding: 18px; text-align: center; font-size: 12px; color: #888; background: #f1f1f1;">
              This is an automated notification from the <b>Leave Management System</b>.  
              Please do not reply directly to this email.
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
  `;
};

export const newEmployeeWelcomeEmail = ({
  name,
  email,
  employeeCode,
  designation,
  managerName,
  managerEmail,
  startDate,
  startTime = "9:00 AM",
  companyName = "TechCorp",
}: {
  name: string;
  email: string;
  employeeCode: string;
  designation: string;
  managerName?: string;
  managerEmail?: string;
  startDate: string;
  startTime?: string;
  companyName?: string;
}) => {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f4f4f7; padding: 30px; font-family: Arial, sans-serif;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); overflow: hidden;">
            
            <!-- Header -->
            <tr>
              <td style="padding: 25px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff;">
                <h2 style="margin: 0; font-size: 22px;">🎉 Welcome to ${companyName}!</h2>
              </td>
            </tr>
            
            <!-- Body -->
            <tr>
              <td style="padding: 25px; font-size: 15px; line-height: 1.6; color: #333;">
                <p style="margin: 0 0 15px 0;">Dear <b>${name}</b>,</p>
                
                <p style="margin: 0 0 15px 0;">
                  Welcome to ${companyName}! We are absolutely thrilled to have you join our team as 
                  <b>${designation}</b>. Your skills and experience make you a perfect fit for our organization.
                </p>

                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #667eea;">
                  <h3 style="margin: 0 0 10px 0; color: #667eea; font-size: 16px;">📅 Your Employment Details</h3>
                  <p style="margin: 5px 0;"><b>Employee Code:</b> ${employeeCode}</p>
                  <p style="margin: 5px 0;"><b>Designation:</b> ${designation}</p>
                  <p style="margin: 5px 0;"><b>Email:</b> ${email}</p>
                  <p style="margin: 5px 0;"><b>Start Date:</b> ${startDate}</p>
                  <p style="margin: 5px 0;"><b>Start Time:</b> ${startTime}</p>
                  ${managerName ? `<p style="margin: 5px 0;"><b>Report to:</b> ${managerName}${managerEmail ? ` (${managerEmail})` : ''}</p>` : ''}
                </div>

                <h3 style="color: #667eea; font-size: 16px; margin: 20px 0 10px 0;">📋 What to Bring on Day One</h3>
                <ul style="margin: 0 0 15px 20px; padding: 0;">
                  <li style="margin-bottom: 5px;">Two forms of ID for I-9 verification</li>
                  <li style="margin-bottom: 5px;">Direct deposit information (voided check or bank details)</li>
                  <li style="margin-bottom: 5px;">Emergency contact information</li>
                  <li style="margin-bottom: 5px;">Any signed offer letter documents</li>
                </ul>

                <h3 style="color: #667eea; font-size: 16px; margin: 20px 0 10px 0;">🕒 Your First Day Schedule</h3>
                <ul style="margin: 0 0 15px 20px; padding: 0;">
                  <li style="margin-bottom: 5px;"><b>9:00 AM</b> - Welcome meeting${managerName ? ` with ${managerName}` : ''}</li>
                  <li style="margin-bottom: 5px;"><b>10:00 AM</b> - HR orientation and paperwork</li>
                  <li style="margin-bottom: 5px;"><b>11:30 AM</b> - IT setup (laptop, accounts, security badges)</li>
                  <li style="margin-bottom: 5px;"><b>1:00 PM</b> - Team lunch (our treat!)</li>
                  <li style="margin-bottom: 5px;"><b>2:30 PM</b> - Team introductions and office tour</li>
                </ul>

                <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #28a745;">
                  <h3 style="margin: 0 0 10px 0; color: #28a745; font-size: 16px;">💡 Quick Tips for Success</h3>
                  <p style="margin: 5px 0;">• Don't hesitate to ask questions - we're here to help!</p>
                  <p style="margin: 5px 0;">• Take notes during your first few weeks</p>
                  <p style="margin: 5px 0;">• Join us for coffee breaks and social events</p>
                </div>

                <p style="margin: 15px 0;">
                  If you have any questions before your start date, please reach out to our HR team.
                </p>
                ${managerName ? `<p style="margin: 5px 0;"><b>Your Manager:</b> ${managerName}${managerEmail ? ` - ${managerEmail}` : ''}</p>` : ''}
                
                <p style="margin: 20px 0 0 0;">
                  We're confident that you'll find ${companyName} to be an exciting place to grow your career. 
                  Once again, welcome to the team! We can't wait to see you on <b>${startDate}</b>.
                </p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="padding: 18px; text-align: center; font-size: 12px; color: #888; background: #f1f1f1;">
                This is an automated welcome message from <b>${companyName}</b>.  
                If you have any questions, please contact our HR team.
              </td>
            </tr>
            
          </table>
        </td>
      </tr>
    </table>
  `;
};