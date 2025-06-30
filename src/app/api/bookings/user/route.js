import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/lib/models/Booking';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const userBookings = await Booking.find({ user: user._id })
      .populate({
        path: 'event',
        model: 'Event',
        select: 'title description dateTime location price images status'
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ bookings: userBookings });

  } catch (error) {
    console.error('Get user bookings error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 