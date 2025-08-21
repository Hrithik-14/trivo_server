import nodemailer from 'nodemailer';

export const sendEmail = async ({ from, to, subject, html }: { from: string, to: string, subject: string, html: string }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: from || process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
  } catch (error: any) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
};