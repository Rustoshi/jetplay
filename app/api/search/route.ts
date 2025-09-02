import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb';
import SubCategory from '@/models/SubCategory';
import Category from '@/models/Category';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Search query is required'
      }, { status: 400 });
    }

    await connectToDatabase();

    // Search subcategories by name and description
    const subcategories = await SubCategory.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    })
    .populate('category')
    .sort({ name: 1 })
    .lean();

    // Format the results to match the products page structure
    const categoryMap = new Map();

    subcategories.forEach((subcategory) => {
      const categoryId = subcategory.category._id.toString();
      
      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, {
          _id: categoryId,
          name: subcategory.category.name,
          subcategories: []
        });
      }
      
      categoryMap.get(categoryId).subcategories.push({
        _id: subcategory._id,
        name: subcategory.name,
        description: subcategory.description,
        price: subcategory.price,
        unsoldCount: 0 // You can calculate this if needed
      });
    });

    const results = Array.from(categoryMap.values());

    return NextResponse.json({
      success: true,
      data: results,
      query: query,
      totalResults: subcategories.length
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
