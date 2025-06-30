import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/lib/models/Event';
import Booking from '@/lib/models/Booking';
import User from '@/lib/models/User';
import { getUserFromToken, isAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    const user = await getUserFromToken(token);

    if (!isAdmin(user)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const [totalEvents, totalBookings, revenueResult, totalUsers] = await Promise.all([
      Event.countDocuments(),
      Booking.countDocuments(),
      Booking.aggregate([
        { $match: { status: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      User.countDocuments()
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    const totalRevenueFormatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(totalRevenue);

    return NextResponse.json({
      totalEvents,
      totalBookings,
      totalUsers,
      totalRevenue,
      totalRevenueFormatted,
    });

  } catch (error) {
    console.error('Get admin stats error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 