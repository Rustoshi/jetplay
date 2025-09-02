import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/utils/mongodb';
import User from '@/models/User';
import Log from '@/models/Log';
import UserLog from '@/models/UserLog';
import Transaction from '@/models/Transaction';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { logId } = await request.json();

    if (!logId) {
      return NextResponse.json(
        { success: false, error: 'Log ID is required' },
        { status: 400 }
      );
    }

    // Get user details
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get log details
    const log = await Log.findById(logId).populate('subCategory');
    if (!log) {
      return NextResponse.json(
        { success: false, error: 'Log not found' },
        { status: 404 }
      );
    }

    // Check if log is already sold
    if (log.sold) {
      return NextResponse.json(
        { success: false, error: 'This account has already been sold' },
        { status: 400 }
      );
    }

    // Check if user has sufficient balance
    if (user.balance < log.price) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Insufficient funds',
          required: log.price,
          available: user.balance
        },
        { status: 400 }
      );
    }

    // Start transaction-like operations
    try {
      // 1. Create UserLog record for the purchased account
      const userLog = new UserLog({
        user: user._id,
        previewLink: log.previewLink,
        logDetails: log.logDetails,
        price: log.price,
        category: log.category,
        subCategory: log.subCategory
      });
      await userLog.save();

      // 2. Create Transaction record
      const transaction = new Transaction({
        user: user._id,
        type: 'purchase',
        amount: log.price
      });
      await transaction.save();

      // 3. Mark original log as sold
      log.sold = true;
      await log.save();

      // 4. Update user balance and spent amount
      user.balance -= log.price;
      user.spent += log.price;
      await user.save();

      return NextResponse.json({
        success: true,
        message: 'Purchase completed successfully',
        data: {
          userLog: {
            _id: userLog._id,
            logDetails: userLog.logDetails,
            price: userLog.price
          },
          transaction: {
            _id: transaction._id,
            amount: transaction.amount,
            type: transaction.type
          },
          newBalance: user.balance
        }
      });

    } catch (transactionError) {
      // If any step fails, we should ideally rollback, but for now just log the error
      console.error('Transaction failed:', transactionError);
      return NextResponse.json(
        { success: false, error: 'Purchase failed. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Purchase API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
