import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/utils/mongodb';
import User from '@/models/User';
import UserLog from '@/models/Log';

// GET - Fetch single log by ID
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
        { error: 'Log ID is required.' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find log by ID and populate references
    const log = await UserLog.findById(id)
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .lean();

    if (!log) {
      return NextResponse.json(
        { error: 'Log not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        log
      }
    });

  } catch (error) {
    console.error('Get log error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// PUT - Update log
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
        { error: 'Log ID is required.' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Get current user and verify admin role
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Parse request body
    const { previewLink, logDetails } = await request.json();

    if (!logDetails || typeof logDetails !== 'string' || logDetails.trim().length === 0) {
      return NextResponse.json({ error: 'Log details are required' }, { status: 400 });
    }

    // Find and update log
    const log = await UserLog.findByIdAndUpdate(
      id,
      {
        previewLink: previewLink?.trim() || null,
        logDetails: logDetails.trim()
      },
      { new: true }
    )
    .populate('category', 'name')
    .populate('subCategory', 'name');

    if (!log) {
      return NextResponse.json(
        { error: 'Log not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Log updated successfully',
      data: {
        log
      }
    });

  } catch (error) {
    console.error('Update log error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// DELETE - Delete log
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
        { error: 'Log ID is required.' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Get current user and verify admin role
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Find and delete log
    const log = await UserLog.findByIdAndDelete(id);

    if (!log) {
      return NextResponse.json(
        { error: 'Log not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Log deleted successfully'
    });

  } catch (error) {
    console.error('Delete log error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}