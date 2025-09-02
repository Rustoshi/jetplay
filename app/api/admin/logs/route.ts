import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { connectToDatabase } from '../../../../utils/mongodb';
import User from '../../../../models/User';
import UserLog from '../../../../models/Log';
import Category from '../../../../models/Category';
import SubCategory from '../../../../models/SubCategory';

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

    // Get all logs with populated category and subcategory
    const logs = await UserLog.find({})
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        logs
      }
    });

  } catch (error) {
    console.error('Admin logs API error:', error);
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
    const { previewLink, logDetails, category, subCategory } = await request.json();

    if (!category || typeof category !== 'string') {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    if (!subCategory || typeof subCategory !== 'string') {
      return NextResponse.json({ error: 'Subcategory is required' }, { status: 400 });
    }

    if (!logDetails || typeof logDetails !== 'string' || logDetails.trim().length === 0) {
      return NextResponse.json({ error: 'Log details are required' }, { status: 400 });
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Verify subcategory exists and belongs to the selected category
    const subCategoryExists = await SubCategory.findById(subCategory);
    if (!subCategoryExists) {
      return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
    }

    if (subCategoryExists.category.toString() !== category) {
      return NextResponse.json({ error: 'Subcategory does not belong to the selected category' }, { status: 400 });
    }

    // Create new log using subcategory price
    const log = new UserLog({
      previewLink: previewLink?.trim() || null,
      logDetails: logDetails.trim(),
      price: subCategoryExists.price,
      category: category,
      subCategory: subCategory,
      sold: false
    });

    await log.save();

    // Populate category and subcategory for response
    await log.populate('category', 'name');
    await log.populate('subCategory', 'name');

    return NextResponse.json({
      success: true,
      data: {
        log
      },
      message: 'Log created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Admin create log API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}