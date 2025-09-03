import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { connectToDatabase } from '../../../../utils/mongodb';
import User from '../../../../models/User';
import SubCategory from '../../../../models/SubCategory';
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

    // Get all subcategories with populated category
    const subcategories = await SubCategory.find({})
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        subcategories
      }
    });

  } catch (error) {
    console.error('Admin subcategories API error:', error);
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
    const body = await request.json();
    const { name, description, price, category } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Subcategory name is required' }, { status: 400 });
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    if (!price || typeof price !== 'number' || price <= 0) {
      return NextResponse.json({ error: 'Valid price is required' }, { status: 400 });
    }

    if (!category || typeof category !== 'string') {
      return NextResponse.json({ error: 'Parent category is required' }, { status: 400 });
    }

    // Verify parent category exists
    const parentCategory = await Category.findById(category);
    if (!parentCategory) {
      return NextResponse.json({ error: 'Parent category not found' }, { status: 404 });
    }

    // Check if subcategory already exists
    const existingSubCategory = await SubCategory.findOne({ name: name.trim() });
    if (existingSubCategory) {
      return NextResponse.json({ error: 'Subcategory already exists' }, { status: 409 });
    }

    // Create new subcategory
    const subcategory = new SubCategory({
      name: name.trim(),
      description: description.trim(),
      price: price,
      category: category
    });

    await subcategory.save();

    // Populate category for response
    await subcategory.populate('category', 'name');

    return NextResponse.json({
      success: true,
      data: {
        subcategory
      },
      message: 'Subcategory created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Admin create subcategory API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}