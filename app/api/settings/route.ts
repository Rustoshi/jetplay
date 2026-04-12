import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb';
import Setting from '@/models/Setting';

export async function GET() {
  try {
    await connectToDatabase();

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
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
