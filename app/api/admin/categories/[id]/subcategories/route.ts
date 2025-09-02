import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/utils/mongodb';
import User from '@/models/User';
import SubCategory from '@/models/SubCategory';

// GET - Fetch subcategories by category ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required.' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find subcategories for the specified category
    const subcategories = await SubCategory.find({ category: id })
      .populate('category', 'name')
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        subcategories
      }
    });

  } catch (error) {
    console.error('Get subcategories by category error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
