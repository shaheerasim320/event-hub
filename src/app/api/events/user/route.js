import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/lib/models/Event';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const userEvents = await Event.find({ organizer: user._id }).sort({ date: -1 });

    return NextResponse.json({ events: userEvents });

  } catch (error) {
    console.error('Get user events error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 