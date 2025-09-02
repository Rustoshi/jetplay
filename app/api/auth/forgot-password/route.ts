import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb';
import User from '@/models/User';
import { sendPasswordResetEmail, generateResetToken, hashResetToken } from '@/utils/resend';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.'
      });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const hashedToken = hashResetToken(resetToken);

    // Set token expiry (1 hour from now)
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    // Save hashed token and expiry to user
    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: tokenExpiry
    });

    // Send email with original token (not hashed)
    const emailResult = await sendPasswordResetEmail({
      email: user.email,
      resetToken,
      firstName: user.firstName
    });

    if (!emailResult.success) {
      console.error('Failed to send reset email:', emailResult.error);
      return NextResponse.json(
        { success: false, error: 'Failed to send reset email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
