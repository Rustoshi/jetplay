import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface PasswordResetEmailData {
  email: string;
  resetToken: string;
  firstName: string;
}

export const sendPasswordResetEmail = async ({ email, resetToken, firstName }: PasswordResetEmailData) => {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Jetplay <noreply@jetplay.pro>',
      to: [email],
      subject: 'Reset Your Jetplay Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Jetplay</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Social Media Account Marketplace</p>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Hi ${firstName},</h2>
            
            <p style="margin-bottom: 20px;">We received a request to reset your password for your Jetplay account.</p>
            
            <p style="margin-bottom: 30px;">Click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        display: inline-block;
                        transition: transform 0.2s;">
                Reset Password
              </a>
            </div>
            
            <p style="margin: 30px 0 20px 0; font-size: 14px; color: #666;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 14px;">
              ${resetUrl}
            </p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
                <strong>Security Notice:</strong>
              </p>
              <ul style="font-size: 14px; color: #666; margin: 0; padding-left: 20px;">
                <li>This link will expire in 1 hour for security reasons</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Never share this link with anyone</li>
              </ul>
            </div>
            
            <div style="margin-top: 30px; text-align: center; font-size: 14px; color: #999;">
              <p>Need help? Contact us at support@jetplay.pro</p>
              <p>&copy; 2024 Jetplay. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: 'Failed to send email' };
  }
};

export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const hashResetToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};