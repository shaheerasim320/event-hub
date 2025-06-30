import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/lib/models/Event';

export async function GET() {
  try {
    await connectDB();

    // Get featured events that are published
    const featuredEvents = await Event.find({
      status: 'published',
      isFeatured: true,
    })
    .populate('organizer', 'name email')
    .sort({ 'dateTime.start': 1 })
    .limit(6);

    return NextResponse.json(featuredEvents);

  } catch (error) {
    console.error('Featured events error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 