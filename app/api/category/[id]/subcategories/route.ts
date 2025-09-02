import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb';
import Category from '@/models/Category';
import SubCategory from '@/models/SubCategory';
import UserLog from '@/models/Log';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    // Get category details
    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Get all subcategories for this category
    const subcategories = await SubCategory.find({ 
      category: id 
    }).sort({ name: 1 });

    // For each subcategory, get the count of unsold logs
    const subcategoriesWithCounts = await Promise.all(
      subcategories.map(async (subcategory) => {
        const unsoldCount = await UserLog.countDocuments({
          subCategory: subcategory._id,
          sold: false
        });

        return {
          _id: subcategory._id,
          name: subcategory.name,
          price: subcategory.price,
          unsoldCount
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        category: {
          _id: category._id,
          name: category.name
        },
        subcategories: subcategoriesWithCounts
      }
    });

  } catch (error) {
    console.error('Error fetching category subcategories:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch category subcategories' 
      },
      { status: 500 }
    );
  }
}
