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

// export const employeeReportTemplate = (data: {
//   employeeName: string;
//   employeeEmail: string;
//   project: string;
//   startTime: string;
//   endTime: string;
//   effectiveHours: string;
//   performance?: string;
//   challenges?: string;
//   supportNeeded?: string;
// }) => {

//   return `
//   <table width="100%" border="0" cellspacing="0" cellpadding="10" style="font-family: Arial, sans-serif; border: 1px solid #ddd; width: 100%; min-width: 100%;">
//   <!-- Header -->
//   <tr>
//     <td style="background: linear-gradient(135deg, #4a90e2, #357abd); color: white; font-size: 20px; font-weight: bold; text-align: center; padding: 20px;">
//       📋 Timesheet Notification
//     </td>
//   </tr>
  
//   <!-- Main Content -->
//   <tr>
//     <td style="padding: 25px; line-height: 1.6;">
//       <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
//         <strong>Dear Manager,</strong>
//       </p>
      
//       <p style="color: #555; margin-bottom: 25px;">
//         A timesheet has been submitted and requires your attention for review.
//       </p>
      
//       <!-- Timesheet Information Section -->
//       <div style="background-color: #f8f9fa; border-left: 4px solid #4a90e2; padding: 15px; margin-bottom: 20px;">
//         <h3 style="color: #2c3e50; margin: 0 0 10px; font-size: 16px;">📊 Timesheet Information</h3>
//         <p style="margin: 5px 0; color: #333;"><strong>Timesheet ID:</strong> 689cb00c93fdc2b59ac8fb2d</p>
//         <p style="margin: 5px 0; color: #333;"><strong>Date:</strong> August 13, 2025 at 15:32:28</p>
//         <p style="margin: 5px 0; color: #333;"><strong>Submitted By:</strong> 6892df9992698694b65b06b</p>
//         <p style="margin: 5px 0; color: #333;"><strong>Project ID:</strong> 6896ea4f64cd7d715fa0bdea</p>
//       </div>
      
//       <!-- Time Details -->
//       <div style="background-color: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin-bottom: 20px;">
//         <h3 style="color: #2c3e50; margin: 0 0 10px; font-size: 16px;">⏰ Time Details</h3>
//         <p style="margin: 8px 0; color: #333;"><strong>Start Time:</strong> 15:32</p>
//         <p style="margin: 8px 0; color: #333;"><strong>End Time:</strong> 15:36</p>
//         <p style="margin: 8px 0; color: #333;"><strong>Effective Hours:</strong> 0.07 hours</p>
//       </div>
      
//       <!-- Task Information -->
//       <div style="background-color: #f1f8e9; border-left: 4px solid #4caf50; padding: 15px; margin-bottom: 20px;">
//         <h3 style="color: #2c3e50; margin: 0 0 10px; font-size: 16px;">✅ Task Information</h3>
//         <p style="margin: 5px 0; color: #333;"><strong>Completed Tasks:</strong> 1 task completed</p>
//         <p style="margin: 5px 0; color: #333;"><strong>Planned Tasks:</strong> 1 task planned</p>
//       </div>
      
//       <!-- Performance & Status -->
//       <div style="background-color: #fce4ec; border-left: 4px solid #e91e63; padding: 15px; margin-bottom: 25px;">
//         <h3 style="color: #2c3e50; margin: 0 0 10px; font-size: 16px;">📈 Performance & Status</h3>
//         <p style="margin: 5px 0; color: #333;"><strong>Performance:</strong> Not specified</p>
//         <p style="margin: 5px 0; color: #333;"><strong>Challenges:</strong> jj</p>
//         <p style="margin: 5px 0; color: #333;"><strong>Support Needed:</strong> dd</p>
//         <p style="margin: 5px 0; color: #333;"><strong>Status:</strong> <span style="background-color: #d4edda; color: #155724; padding: 3px 8px; border-radius: 10px; font-size: 12px;">accepted</span></p>
//       </div>
      
//       <!-- Timestamps -->
//       <div style="background-color: #f0f0f0; border-left: 4px solid #9e9e9e; padding: 15px; margin-bottom: 20px;">
//         <h3 style="color: #2c3e50; margin: 0 0 10px; font-size: 16px;">📅 Record Timestamps</h3>
//         <p style="margin: 5px 0; color: #333;"><strong>Created At:</strong> August 13, 2025 at 15:32:28</p>
//         <p style="margin: 5px 0; color: #333;"><strong>Updated At:</strong> August 13, 2025 at 16:02:44</p>
//         <p style="margin: 5px 0; color: #333;"><strong>Version:</strong> 0</p>
//       </div>
      
//       <p style="color: #333; margin-bottom: 15px;">
//         <strong>This timesheet has been submitted for your review.</strong>
//       </p>
      
//       <p style="color: #333; margin-bottom: 5px;">
//         For any questions or clarifications, please contact:
//       </p>
//       <p style="color: #333; margin: 5px 0;">
//         📧 HR Department: <a href="mailto:hr@company.com" style="color: #4a90e2;">hr@company.com</a><br/>
//         📞 Phone: <a href="tel:+1234567890" style="color: #4a90e2;">+1 (234) 567-8900</a>
//       </p>
      
//       <p style="color: #333; margin-top: 25px;">
//         Best regards,<br/>
//         <strong style="color: #4a90e2;">HR Management System</strong><br/>
//         <span style="color: #888; font-size: 12px;">Automated Notification System</span>
//       </p>
//     </td>
//   </tr>
  
//   <!-- Footer -->
//   <tr>
//     <td style="background-color: #f5f5f5; text-align: center; padding: 15px; font-size: 12px; color: #666; border-top: 1px solid #ddd;">
//       <p style="margin: 0;">
//         <strong>Company Name</strong> | HR Department<br/>
//         123 Business Street, Suite 100, City, State 12345<br/>
//         This is an automated email. Please do not reply directly to this message.
//       </p>
//     </td>
//   </tr>
// </table>
//   `;
// };



// const transporter = nodemailer.createTransport({
//   service: "Gmail", // or Outlook/SMTP
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// interface LeaveRequestEmail {
//   to: string;
//   employeeName: string;
//   managerName: string;
//   leaveType: string;
//   description: string;
//   date: string;
// }

// export const sendLeaveRequestEmail = async ({
//   to,
//   employeeName,
//   managerName,
//   leaveType,
//   description,
//   date,
// }: LeaveRequestEmail) => {
//   const html = `
//   <table width="100%" cellspacing="0" cellpadding="10" style="border:1px solid #ddd; font-family: Arial, sans-serif;">
//     <thead style="background:#4CAF50; color:#fff;">
//       <tr>
//         <th colspan="2">Leave Request Notification</th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr>
//         <td><strong>Manager:</strong></td>
//         <td>${managerName}</td>
//       </tr>
//       <tr>
//         <td><strong>Employee:</strong></td>
//         <td>${employeeName}</td>
//       </tr>
//       <tr>
//         <td><strong>Leave Type:</strong></td>
//         <td>${leaveType}</td>
//       </tr>
//       <tr>
//         <td><strong>Date:</strong></td>
//         <td>${new Date(date).toDateString()}</td>
//       </tr>
//       <tr>
//         <td><strong>Description:</strong></td>
//         <td>${description || "No description provided"}</td>
//       </tr>
//     </tbody>
//     <tfoot style="background:#f1f1f1;">
//       <tr>
//         <td colspan="2" style="text-align:center;">
//           This is an automated message. Please do not reply.
//         </td>
//       </tr>
//     </tfoot>
//   </table>
//   `;

//   await transporter.sendMail({
//     from: `"HR System" <${process.env.EMAIL_USER}>`,
//     to,
//     subject: `New Leave Request from ${employeeName}`,
//     html,
//   });
// };


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
