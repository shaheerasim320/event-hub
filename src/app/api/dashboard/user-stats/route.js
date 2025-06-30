import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/lib/models/Booking';
import Event from '@/lib/models/Event';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const bookings = await Booking.find({ user: user._id }).populate('event');

    const now = new Date();
    let upcomingBookings = 0;
    let attendedBookings = 0;
    let totalSpent = 0;

    bookings.forEach(booking => {
      if (booking.event) {
        if (new Date(booking.event.dateTime.start) > now) {
          upcomingBookings++;
        } else {
          attendedBookings++;
        }
      }
      if (booking.status === 'confirmed') {
        totalSpent += booking.totalAmount;
      }
    });
    
    const totalSpentFormatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(totalSpent);


    return NextResponse.json({
      totalBookings: bookings.length,
      upcomingBookings,
      attendedBookings,
      totalSpent,
      totalSpentFormatted,
    });

  } catch (error) {
    console.error('Error fetching user dashboard stats:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 