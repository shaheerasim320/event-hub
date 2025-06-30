'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, DollarSign, Ticket, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings/user');
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      } else {
        toast.error('Failed to load bookings');
      }
    } catch (error) {
      toast.error('An error occurred while loading bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Booking cancelled successfully');
        fetchBookings(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to cancel booking');
      }
    } catch (error) {
      toast.error('An error occurred while cancelling booking');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage your event bookings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">View and manage your event bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-600 mb-4">
            You haven't made any bookings yet. Start exploring events to book your first one!
          </p>
          <a
            href="/events"
            className="btn-primary inline-block"
          >
            Browse Events
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {booking.event.image && (
                <div className="h-48 bg-gray-200">
                  <img
                    src={booking.event.image}
                    alt={booking.event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {booking.event.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {booking.event.dateTime?.start ? 
                      format(new Date(booking.event.dateTime.start), 'MMM dd, yyyy') :
                      'Date not available'
                    }
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {booking.event.dateTime?.start ? 
                      format(new Date(booking.event.dateTime.start), 'h:mm a') :
                      'Time not available'
                    }
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {booking.event.location?.venue || 'Location not available'}
                  </div>
                  
                  {booking.event.price > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      ${booking.event.price}
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-500">Booking ID:</span>
                    <span className="text-sm font-mono text-gray-700">
                      {booking._id.slice(-8)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Booked on:</span>
                    <span className="text-sm text-gray-700">
                      {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>

                {booking.status === 'confirmed' && (
                  <div className="mt-4 pt-4 border-t">
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="w-full flex items-center justify-center text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 