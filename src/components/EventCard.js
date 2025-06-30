import Link from 'next/link';
import { MapPin, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';

export default function EventCard({ event }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <div className="relative">
        <img
          src={event.images[0] || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800'}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-800 shadow-md">
          ${event.price.toFixed(2)}
        </div>
        {event.isFeatured && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            Featured
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-xl mb-2 text-gray-800">{event.title}</h3>
        <div className="space-y-2 text-sm text-gray-600 mb-4 flex-grow">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span>{event.location.venue}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span>{format(new Date(event.dateTime.start), 'MMM dd, yyyy • p')}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-gray-500" />
            <span>{event.availableSeats > 0 ? `${event.availableSeats} seats available` : 'Sold Out'}</span>
          </div>
        </div>
        <div className="mt-auto">
          <Link href={`/events/${event._id}`} className="w-full inline-block text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
} 