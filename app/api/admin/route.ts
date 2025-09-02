import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { connectToDatabase } from '../../../utils/mongodb';
import User from '../../../models/User';
import UserLog from '../../../models/UserLog';
import Transaction from '../../../models/Transaction';
import Category from '../../../models/Category';
import SubCategory from '../../../models/SubCategory';

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await connectToDatabase();

    // Ensure models are registered
    User;
    UserLog;
    Transaction;
    Category;
    SubCategory;

    // Get current user and verify admin role
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get dashboard statistics
    const [totalUsersCount, totalLogsCount, totalTransactionsCount] = await Promise.all([
      User.countDocuments({}),
      UserLog.countDocuments({}),
      Transaction.countDocuments({})
    ]);

    // Get users (max 30, excluding admins)
    const users = await User.find(
      { role: { $ne: 'admin' } },
      { password: 0 } // Exclude password field
    )
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    // Get logs (max 30) - handle potential data corruption
    let logs = [];
    try {
      logs = await UserLog.find({})
        .populate('user', 'firstName lastName email')
        .populate('category', 'name')
        .populate('subCategory', 'name')
        .sort({ createdAt: -1 })
        .limit(30)
        .lean();
    } catch (populateError) {
      console.error('Population error, fetching logs without population:', populateError);
      // Fallback: get logs without population to avoid complete failure
      logs = await UserLog.find({})
        .sort({ createdAt: -1 })
        .limit(30)
        .lean();
    }

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers: totalUsersCount,
          totalLogs: totalLogsCount,
          totalTransactions: totalTransactionsCount
        },
        users,
        logs
      }
    });

  } catch (error) {
    console.error('Admin dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}