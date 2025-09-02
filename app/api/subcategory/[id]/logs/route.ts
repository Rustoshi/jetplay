import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb';
import UserLog from '@/models/Log';
import SubCategory from '@/models/SubCategory';
import Category from '@/models/Category';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = params;

    // Get subcategory details
    const subcategory = await SubCategory.findById(id).populate('category');
    
    if (!subcategory) {
      return NextResponse.json(
        { success: false, error: 'Subcategory not found' },
        { status: 404 }
      );
    }

    // Get all unsold logs for this subcategory
    const logs = await UserLog.find({
      subCategory: id,
      sold: false
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: {
        subcategory: {
          _id: subcategory._id,
          name: subcategory.name,
          price: subcategory.price,
          category: subcategory.category
        },
        logs: logs.map(log => ({
          _id: log._id,
          previewLink: log.previewLink,
          price: log.price,
          createdAt: log.createdAt
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching subcategory logs:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch subcategory logs' 
      },
      { status: 500 }
    );
  }
}
