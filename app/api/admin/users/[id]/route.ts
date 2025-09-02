import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/utils/mongodb';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import bcrypt from 'bcryptjs';

// GET - Fetch user by ID
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
        { error: 'User ID is required.' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user by ID
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || '',
          address: user.address || '',
          city: user.city || '',
          state: user.state || '',
          country: user.country || '',
          role: user.role,
          balance: user.balance,
          spent: user.spent,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// PUT - Update user
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
        { error: 'User ID is required.' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      address, 
      city, 
      state, 
      country, 
      role,
      balance,
      password,
      changePassword 
    } = body;

    // Validation
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required.' },
        { status: 400 }
      );
    }

    if (typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (role && !['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Role must be either "user" or "admin".' },
        { status: 400 }
      );
    }

    if (changePassword && (!password || password.length < 6)) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    if (balance !== undefined && (typeof balance !== 'number' || balance < 0)) {
      return NextResponse.json(
        { error: 'Balance must be a valid non-negative number.' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
    }

    // Check if email is already taken by another user
    if (email !== existingUser.email) {
      const emailExists = await User.findOne({ 
        email: email.toLowerCase().trim(),
        _id: { $ne: id }
      });
      
      if (emailExists) {
        return NextResponse.json(
          { error: 'Email address is already in use by another user.' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || '',
      address: address?.trim() || '',
      city: city?.trim() || '',
      state: state?.trim() || '',
      country: country?.trim() || '',
      role: role || existingUser.role
    };

    // Update balance if provided
    if (balance !== undefined) {
      updateData.balance = balance;
    }

    // Hash password if changing
    if (changePassword && password) {
      const saltRounds = 12;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    return NextResponse.json({
      success: true,
      message: `User ${updatedUser.firstName} ${updatedUser.lastName} has been updated successfully.`,
      data: {
        user: {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phone: updatedUser.phone,
          address: updatedUser.address,
          city: updatedUser.city,
          state: updatedUser.state,
          country: updatedUser.country,
          role: updatedUser.role,
          balance: updatedUser.balance,
          spent: updatedUser.spent,
          updatedAt: updatedUser.updatedAt
        },
        passwordChanged: changePassword || false
      }
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
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
        { error: 'User ID is required.' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
    }

    // Prevent deleting admin users (optional safety check)
    if (existingUser.role === 'admin') {
      return NextResponse.json(
        { error: 'Cannot delete admin users.' },
        { status: 403 }
      );
    }

    // Delete all user transactions first
    await Transaction.deleteMany({ user: id });

    // Delete the user
    await User.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: `User ${existingUser.firstName} ${existingUser.lastName} has been deleted successfully.`,
      data: {
        deletedUser: {
          id: existingUser._id,
          name: `${existingUser.firstName} ${existingUser.lastName}`,
          email: existingUser.email
        }
      }
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}