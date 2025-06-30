import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/lib/models/Event';
import { getUserFromToken, isAdmin } from '@/lib/auth';

// Get all events with filtering
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    // Default to 'published' status if not provided
    const status = searchParams.get('status') || 'published';
    const location = searchParams.get('location');
    const date = searchParams.get('date');

    const query = { status };
    
    if (category && category.toLowerCase() !== 'all') {
      query.category = category.toLowerCase();
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.venue': { $regex: search, $options: 'i' } }
      ];
    }

    if (location) {
      query['location.venue'] = { $regex: location, $options: 'i' };
    }

    if (date) {
      // Match events whose start date is the same as the provided date (YYYY-MM-DD)
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query['dateTime.start'] = { $gte: startOfDay, $lte: endOfDay };
    }

    const skip = (page - 1) * limit;

    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .sort({ 'dateTime.start': 1 })
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments(query);

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new event - ADMIN ONLY
export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    if (!isAdmin(user)) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    const eventData = await request.json();

    const event = new Event({
      ...eventData,
      organizer: user._id,
      status: 'published', // Automatically publish events created by an admin
    });

    await event.save();

    await event.populate('organizer', 'name email');

    return NextResponse.json({
      message: 'Event created successfully',
      event
    }, { status: 201 });

  } catch (error) {
    console.error('Create event error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message).join(', ');
      return NextResponse.json({ message: messages }, { status: 400 });
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 