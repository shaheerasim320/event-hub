import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '@/lib/db';
import Event from '@/lib/models/Event';
import Booking from '@/lib/models/Booking';
import User from '@/lib/models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const buf = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }
  
  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      await connectDB();
      
      const { eventId, userId, quantity } = session.metadata;
      const numQuantity = Number(quantity);

      // Create the booking
      const booking = new Booking({
        event: eventId,
        user: userId,
        numberOfTickets: numQuantity,
        totalAmount: session.amount_total / 100, // convert from cents
        status: 'confirmed',
        paymentStatus: 'paid',
        stripeCheckoutId: session.id,
      });

      await booking.save();
      
      // Update the event's booked seats
      await Event.updateOne(
        { _id: eventId },
        { $inc: { bookedSeats: numQuantity, availableSeats: -numQuantity } }
      );

    } catch (dbError) {
      console.error('Database error after Stripe checkout:', dbError);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
} 