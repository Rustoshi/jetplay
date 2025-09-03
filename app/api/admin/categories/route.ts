import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { connectToDatabase } from '../../../../utils/mongodb';
import User from '../../../../models/User';
import Category from '../../../../models/Category';

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await connectToDatabase();

    // Get current user and verify admin role
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get all categories
    const categories = await Category.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        categories
      }
    });

  } catch (error) {
    console.error('Admin categories API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await connectToDatabase();

    // Get current user and verify admin role
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Parse request body
    const { name, logoUrl } = await request.json();

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    // Validate logoUrl if provided
    if (logoUrl && (typeof logoUrl !== 'string' || logoUrl.trim().length === 0)) {
      return NextResponse.json({ error: 'Logo URL must be a valid string' }, { status: 400 });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
    }

    // Create new category
    const categoryData: any = {
      name: name.trim()
    };

    // Add logoUrl if provided
    if (logoUrl && logoUrl.trim()) {
      categoryData.logoUrl = logoUrl.trim();
    }

    const category = new Category(categoryData);

    await category.save();

    return NextResponse.json({
      success: true,
      data: {
        category
      },
      message: 'Category created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Admin create category API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}