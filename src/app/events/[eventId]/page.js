'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Tag, Users, DollarSign, Edit } from 'lucide-react';
import Image from 'next/image';

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { eventId } = params;
  const { user, isAuthenticated } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) {
          throw new Error('Event not found.');
        }
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        toast.error(err.message);
        router.push('/events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId, router]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to book a ticket.');
      router.push(`/login?redirect=/events/${eventId}`);
      return;
    }

    if (quantity > event.availableSeats) {
      toast.error(`Sorry, only ${event.availableSeats} tickets are available.`);
      return;
    }

    setBookingLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId, quantity }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Could not create checkout session.');
      }
      
      const { url } = await response.json();
      router.push(url);

    } catch (error) {
      toast.error(error.message);
      setBookingLoading(false);
    }
  };

  const canEdit = isAuthenticated && event && (user.role === 'admin' || user._id === event.organizer._id);

  if (loading) {
    return <div className="text-center py-20">Loading event...</div>;
  }

  if (!event) {
    return <div className="text-center py-20">Event could not be loaded.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <Image src={event.images[0] || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800'} alt={event.title} width={1200} height={400} className="w-full h-96 object-cover" />
        
        <div className="p-8 relative">
          {canEdit && (
            <Link href={`/events/${eventId}/edit`} className="absolute top-4 right-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors">
              <Edit size={18} />
              <span>Edit Event</span>
            </Link>
          )}

          <div className="mb-4">
            <h1 className="text-4xl font-bold text-gray-900">{event.title}</h1>
            <p className="text-lg text-gray-500">Organized by <span className="font-semibold text-gray-700">{event.organizer.name}</span></p>
          </div>

          <div className="flex items-center space-x-2 text-gray-600 mb-6">
            <Tag size={20} />
            <span className="text-blue-600 font-semibold text-lg">{event.category}</span>
          </div>

          <p className="text-gray-700 text-lg mb-8">{event.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Details</h3>
              <div className="flex items-center space-x-3">
                <Calendar className="text-blue-500" />
                <span>{format(new Date(event.dateTime.start), 'MMMM dd, yyyy')} to {format(new Date(event.dateTime.end), 'MMMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="text-blue-500" />
                <span>{format(new Date(event.dateTime.start), 'p')} - {format(new Date(event.dateTime.end), 'p')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="text-blue-500" />
                <span>{event.location.venue}</span>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Booking Information</h3>
              <div className="flex items-center space-x-3">
                <DollarSign className="text-green-500" />
                <span className="text-2xl font-bold text-green-600">${event.price.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="text-green-500" />
                <span>{event.availableSeats > 0 ? `${event.availableSeats} / ${event.capacity} seats available` : 'Sold Out'}</span>
              </div>
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="text-lg font-medium text-gray-800">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  max={event.availableSeats || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="input-field w-24 text-center"
                  disabled={event.availableSeats === 0}
                />
              </div>
              <button 
                onClick={handleBooking} 
                disabled={bookingLoading || event.availableSeats === 0}
                className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {event.availableSeats === 0 ? 'Sold Out' : (bookingLoading ? 'Processing...' : 'Book Your Ticket')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 