import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb';
import Category from '@/models/Category';

// GET - Fetch all categories for public use
export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();

    // Find all categories, sorted by name
    const categories = await Category.find({})
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        categories
      }
    });

  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
