import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/utils/mongodb';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { email, amount } = body;

    // Validation
    if (!email || !amount) {
      return NextResponse.json(
        { error: 'Email and amount are required.' },
        { status: 400 }
      );
    }

    if (typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number.' },
        { status: 400 }
      );
    }

    if (numericAmount > 1000000) {
      return NextResponse.json(
        { error: 'Amount cannot exceed NGN 1,000,000.' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found with this email address.' },
        { status: 404 }
      );
    }

    // Update user balance
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { 
        $inc: { balance: numericAmount }
      },
      { new: true }
    );

    // Create transaction record
    const transaction = new Transaction({
      user: user._id,
      type: 'credit',
      amount: numericAmount
    });

    await transaction.save();

    return NextResponse.json({
      success: true,
      message: `Successfully funded ${user.firstName} ${user.lastName}'s account with NGN ${numericAmount.toLocaleString()}.`,
      data: {
        user: {
          id: updatedUser._id,
          name: `${updatedUser.firstName} ${updatedUser.lastName}`,
          email: updatedUser.email,
          newBalance: updatedUser.balance
        },
        transaction: {
          id: transaction._id,
          amount: transaction.amount,
          type: transaction.type,
          createdAt: transaction.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Fund user error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}