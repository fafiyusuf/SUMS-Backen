// import nodemailer from 'nodemailer';
// import logger from '../utils/logger';

// export interface EmailOptions {
//   to: string;
//   subject: string;
//   html: string;
//   text?: string;
// }

// export class EmailService {
//   private transporter = nodemailer.createTransporter({
//     // TODO: Configure email service (Gmail, SendGrid, etc.)
//     host: process.env.SMTP_HOST || 'localhost',
//     port: parseInt(process.env.SMTP_PORT || '587'),
//     secure: process.env.SMTP_SECURE === 'true',
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASSWORD
//     }
//   });

//   async sendEmail(options: EmailOptions): Promise<void> {
//     try {
//       await this.transporter.sendMail({
//         from: process.env.EMAIL_FROM || 'noreply@sums.et',
//         to: options.to,
//         subject: options.subject,
//         html: options.html,
//         text: options.text
//       });

//       logger.info(`Email sent to ${options.to}`);
//     } catch (error) {
//       logger.error(`Email sending error: ${error}`);
//       throw error;
//     }
//   }

//   async sendWelcomeEmail(email: string, fullName: string): Promise<void> {
//     const html = `
//       <h1>Welcome to SUMS!</h1>
//       <p>Hello ${fullName},</p>
//       <p>Thank you for registering with the Smart Urban Mobility System.</p>
//       <p>Best regards,<br>SUMS Team</p>
//     `;

//     await this.sendEmail({
//       to: email,
//       subject: 'Welcome to SUMS',
//       html
//     });
//   }

//   async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
//     const html = `
//       <h1>Password Reset</h1>
//       <p>Click the link below to reset your password:</p>
//       <a href="${resetLink}">${resetLink}</a>
//       <p>If you didn't request this, please ignore this email.</p>
//     `;

//     await this.sendEmail({
//       to: email,
//       subject: 'Password Reset Request',
//       html
//     });
//   }
// }

// export default new EmailService();
