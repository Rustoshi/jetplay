import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/utils/mongodb';
import User from '@/models/User';
import SubCategory from '@/models/SubCategory';
import Category from '@/models/Category';

// GET - Fetch subcategory by ID
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
        { error: 'Subcategory ID is required.' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find subcategory by ID with populated category
    const subcategory = await SubCategory.findById(id).populate('category', 'name');
    
    if (!subcategory) {
      return NextResponse.json(
        { error: 'Subcategory not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        subcategory: {
          id: subcategory._id,
          name: subcategory.name,
          description: subcategory.description,
          price: subcategory.price,
          category: subcategory.category,
          createdAt: subcategory.createdAt,
          updatedAt: subcategory.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('Get subcategory error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// PUT - Update subcategory
export async function PUT(
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
        { error: 'Subcategory ID is required.' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, description, price, category } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Subcategory name is required.' },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json(
        { error: 'Description is required.' },
        { status: 400 }
      );
    }

    if (!price || typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { error: 'Valid price is required.' },
        { status: 400 }
      );
    }

    if (!category || typeof category !== 'string') {
      return NextResponse.json(
        { error: 'Parent category is required.' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Check if subcategory exists
    const existingSubCategory = await SubCategory.findById(id);
    if (!existingSubCategory) {
      return NextResponse.json(
        { error: 'Subcategory not found.' },
        { status: 404 }
      );
    }

    // Verify parent category exists
    const parentCategory = await Category.findById(category);
    if (!parentCategory) {
      return NextResponse.json(
        { error: 'Parent category not found.' },
        { status: 404 }
      );
    }

    // Check if name is already taken by another subcategory
    if (name.trim() !== existingSubCategory.name) {
      const nameExists = await SubCategory.findOne({ 
        name: name.trim(),
        _id: { $ne: id }
      });
      
      if (nameExists) {
        return NextResponse.json(
          { error: 'Subcategory name is already in use.' },
          { status: 400 }
        );
      }
    }

    // Update subcategory
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        description: description.trim(),
        price: price,
        category: category
      },
      { new: true, runValidators: true }
    ).populate('category', 'name');

    return NextResponse.json({
      success: true,
      message: `Subcategory "${updatedSubCategory.name}" has been updated successfully.`,
      data: {
        subcategory: {
          id: updatedSubCategory._id,
          name: updatedSubCategory.name,
          description: updatedSubCategory.description,
          price: updatedSubCategory.price,
          category: updatedSubCategory.category,
          createdAt: updatedSubCategory.createdAt,
          updatedAt: updatedSubCategory.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('Update subcategory error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// DELETE - Delete subcategory
export async function DELETE(
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
        { error: 'Subcategory ID is required.' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Check if subcategory exists
    const existingSubCategory = await SubCategory.findById(id).populate('category', 'name');
    if (!existingSubCategory) {
      return NextResponse.json(
        { error: 'Subcategory not found.' },
        { status: 404 }
      );
    }

    // Delete the subcategory
    await SubCategory.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: `Subcategory "${existingSubCategory.name}" has been deleted successfully.`,
      data: {
        deletedSubCategory: {
          id: existingSubCategory._id,
          name: existingSubCategory.name,
          category: existingSubCategory.category
        }
      }
    });

  } catch (error) {
    console.error('Delete subcategory error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}