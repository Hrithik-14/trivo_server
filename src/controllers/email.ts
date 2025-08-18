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