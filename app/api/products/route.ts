import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb';
import Category from '@/models/Category';
import SubCategory from '@/models/SubCategory';
import UserLog from '@/models/Log';

export async function GET() {
  try {
    await connectToDatabase();

    // Get all categories
    const categories = await Category.find({}).sort({ name: 1 });

    const categoriesWithSubcategories = await Promise.all(
      categories.map(async (category) => {
        // Get max 5 subcategories for each category
        const subcategories = await SubCategory.find({ 
          category: category._id 
        })
        .sort({ name: 1 })
        .limit(5);

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

        return {
          _id: category._id,
          name: category.name,
          subcategories: subcategoriesWithCounts
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: categoriesWithSubcategories
    });

  } catch (error) {
    console.error('Error fetching products data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products data' 
      },
      { status: 500 }
    );
  }
}