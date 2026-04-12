import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/utils/mongodb';
import User from '@/models/User';
import Setting from '@/models/Setting';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const paymentSettings = await Setting.findOne({ key: 'paymentDetails' });

    return NextResponse.json({
      success: true,
      data: paymentSettings?.value || {
        accountName: '',
        bank: '',
        accountNumber: ''
      }
    });
  } catch (error) {
    console.error('Admin settings GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { accountName, bank, accountNumber } = body;

    if (!accountName || !bank || !accountNumber) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await Setting.findOneAndUpdate(
      { key: 'paymentDetails' },
      {
        key: 'paymentDetails',
        value: { accountName, bank, accountNumber }
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Payment details updated successfully'
    });
  } catch (error) {
    console.error('Admin settings PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
