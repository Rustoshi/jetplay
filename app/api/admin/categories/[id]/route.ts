import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/utils/mongodb';
import User from '@/models/User';
import Category from '@/models/Category';

// GET - Fetch category by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required.' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find category by ID
    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        category: {
          id: category._id,
          name: category.name,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('Get category error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// PUT - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required.' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Category name is required.' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Check if category exists
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found.' },
        { status: 404 }
      );
    }

    // Check if name is already taken by another category
    if (name.trim() !== existingCategory.name) {
      const nameExists = await Category.findOne({ 
        name: name.trim(),
        _id: { $ne: id }
      });
      
      if (nameExists) {
        return NextResponse.json(
          { error: 'Category name is already in use.' },
          { status: 400 }
        );
      }
    }

    // Update category
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: `Category "${updatedCategory.name}" has been updated successfully.`,
      data: {
        category: {
          id: updatedCategory._id,
          name: updatedCategory.name,
          createdAt: updatedCategory.createdAt,
          updatedAt: updatedCategory.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required.' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Check if category exists
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found.' },
        { status: 404 }
      );
    }

    // Delete the category
    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: `Category "${existingCategory.name}" has been deleted successfully.`,
      data: {
        deletedCategory: {
          id: existingCategory._id,
          name: existingCategory.name
        }
      }
    });

  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}