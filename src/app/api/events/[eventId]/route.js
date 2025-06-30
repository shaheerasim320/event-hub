import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/lib/models/Event';
import { getUserFromToken, isAdmin } from '@/lib/auth';

const getEventIdFromUrl = (url) => {
  const parts = url.split('/');
  return parts[parts.length - 1];
};

// GET a single event by ID
export async function GET(request) {
  try {
    await connectDB();
    const eventId = getEventIdFromUrl(request.url);

    const event = await Event.findById(eventId).populate('organizer', 'name email');

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Get event by ID error:', error);
    if (error.kind === 'ObjectId') {
      return NextResponse.json({ message: 'Invalid event ID' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// UPDATE an event by ID
export async function PUT(request) {
  try {
    await connectDB();
    const eventId = getEventIdFromUrl(request.url);
    
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    // Only allow the organizer or an admin to update the event
    if (event.organizer.toString() !== user._id.toString() && !isAdmin(user)) {
      return NextResponse.json({ message: 'Not authorized to update this event' }, { status: 403 });
    }

    const body = await request.json();
    
    // Update the event fields
    const updatedEvent = await Event.findByIdAndUpdate(eventId, body, {
      new: true,
      runValidators: true,
    }).populate('organizer', 'name email');

    return NextResponse.json({ message: 'Event updated successfully', event: updatedEvent });

  } catch (error) {
    console.error('Update event error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message).join(', ');
      return NextResponse.json({ message: messages }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE an event by ID
export async function DELETE(request) {
    try {
      await connectDB();
      const eventId = getEventIdFromUrl(request.url);
      
      const token = request.cookies.get('token')?.value;
      if (!token) {
        return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
      }
  
      const user = await getUserFromToken(token);
      if (!user) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }
  
      const event = await Event.findById(eventId);
  
      if (!event) {
        return NextResponse.json({ message: 'Event not found' }, { status: 404 });
      }
  
      // Only allow the organizer or an admin to delete the event
      if (event.organizer.toString() !== user._id.toString() && !isAdmin(user)) {
        return NextResponse.json({ message: 'Not authorized to delete this event' }, { status: 403 });
      }
  
      await Event.findByIdAndDelete(eventId);
  
      return NextResponse.json({ message: 'Event deleted successfully' });
  
    } catch (error) {
      console.error('Delete event error:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  } 