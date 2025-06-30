import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getUserFromToken } from '@/lib/auth';
import Event from '@/lib/models/Event';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    console.log('BASE_URL value:', process.env.NEXT_PUBLIC_BASE_URL);
    console.log('Checkout API received cookies:', request.cookies.getAll());
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { eventId, quantity } = await request.json();

    if (!eventId || !quantity) {
      return NextResponse.json({ message: 'Event ID and quantity are required' }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    if (event.availableSeats < quantity) {
      return NextResponse.json({ message: 'Not enough tickets available' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: event.title,
              images: event.images,
            },
            unit_amount: event.price * 100, // Amount in cents
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/my-bookings?success=true&eventId=${eventId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/events/${eventId}?canceled=true`,
      metadata: {
        eventId: event._id.toString(),
        userId: user._id.toString(),
        quantity: quantity,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });

  } catch (error) {
    console.error('Stripe session creation error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 