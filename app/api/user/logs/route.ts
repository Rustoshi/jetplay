import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/utils/mongodb';
import User from '@/models/User';
import UserLog from '@/models/UserLog';
import SubCategory from '@/models/SubCategory';
import Category from '@/models/Category';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Get user details
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's purchased logs without population first
    const userLogs = await UserLog.find({ user: user._id.toString() })
      .sort({ createdAt: -1 });

    console.log('Found UserLogs:', userLogs.length);
    console.log('Raw UserLog data:', userLogs);
    
    // Manually fetch categories and subcategories
    const Category = (await import('@/models/Category')).default;
    const SubCategory = (await import('@/models/SubCategory')).default;

    const formattedLogs = await Promise.all(userLogs.map(async (log) => {
      let subcategoryData = null;
      let categoryData = null;

      // Handle corrupted subCategory data
      if (typeof log.subCategory === 'string') {
        // Try to parse if it's a JSON string
        try {
          if (log.subCategory.startsWith('{')) {
            // It's corrupted JSON, extract the ID manually
            const idMatch = log.subCategory.match(/ObjectId\('([^']+)'\)/);
            if (idMatch) {
              subcategoryData = await SubCategory.findById(idMatch[1]);
            }
          } else {
            // It's a regular ObjectId string
            subcategoryData = await SubCategory.findById(log.subCategory);
          }
        } catch (e) {
          console.log('Error parsing subCategory:', e);
        }
      } else {
        // It's already an ObjectId
        subcategoryData = await SubCategory.findById(log.subCategory);
      }

      // Get category data
      if (typeof log.category === 'string') {
        categoryData = await Category.findById(log.category);
      } else {
        categoryData = await Category.findById(log.category);
      }

      return {
        _id: log._id,
        logDetails: log.logDetails,
        previewLink: log.previewLink,
        price: log.price,
        purchaseDate: log.createdAt,
        subcategory: subcategoryData ? {
          _id: subcategoryData._id,
          name: subcategoryData.name
        } : {
          _id: 'unknown',
          name: 'Unknown Subcategory'
        },
        category: categoryData ? {
          _id: categoryData._id,
          name: categoryData.name
        } : {
          _id: 'unknown',
          name: 'Unknown Category'
        }
      };
    }));

    return NextResponse.json({
      success: true,
      data: formattedLogs
    });

  } catch (error) {
    console.error('Error fetching user logs:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch user logs' 
      },
      { status: 500 }
    );
  }
}