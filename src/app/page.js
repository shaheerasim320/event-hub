'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ArrowRight, 
  Star,
  Music,
  Trophy,
  Briefcase,
  Code,
  Utensils,
  Palette,
  GraduationCap,
  Layers,
  Mic,
  Compass,
  Pizza,
  BookOpen,
  Heart
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/components/AuthProvider';
import EventCard from '@/components/EventCard';
import { useRouter } from 'next/navigation';

// Static data for icons and colors, as these are part of the UI design
const categoryDetails = {
  music: { icon: Music, color: 'bg-purple-500' },
  sports: { icon: Heart, color: 'bg-red-500' },
  business: { icon: Briefcase, color: 'bg-blue-500' },
  technology: { icon: Code, color: 'bg-green-500' },
  food: { icon: Pizza, color: 'bg-orange-500' },
  art: { icon: Palette, color: 'bg-pink-500' },
  education: { icon: BookOpen, color: 'bg-indigo-500' },
  other: { icon: Layers, color: 'bg-gray-500' },
};

const CategoryPill = ({ name }) => {
  const detail = categoryDetails[name.toLowerCase()];
  if (!detail) {
    // Fallback for categories not in the details map
    const fallback = categoryDetails['other'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${fallback.color} text-white`}>
        <fallback.icon className="mr-1.5 h-3 w-3" />
        {name}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${detail.color} text-white`}>
      <detail.icon className="mr-1.5 h-3 w-3" />
      {name}
    </span>
  );
};

export default function HomePage() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  // Add state for search fields
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        setLoading(true);
        const [eventsRes, categoriesRes] = await Promise.all([
          fetch('/api/events/featured'),
          fetch('/api/events/categories')
        ]);

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setFeaturedEvents(eventsData);
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          const categoriesWithUI = categoriesData.map(cat => ({
            ...cat,
            ...categoryDetails[cat.name.toLowerCase()]
          }));
          setCategories(categoriesWithUI);
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Amazing Events
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Book tickets to the best events in your area. From concerts to conferences, 
            find your next unforgettable experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/events" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Browse Events
            </Link>
            {/* Only show Create Event for admins */}
            {isAuthenticated && user?.role === 'admin' && (
              <Link href="/create-event" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Create Event
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Find Your Perfect Event</h2>
          <form
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            onSubmit={e => {
              e.preventDefault();
              const params = new URLSearchParams();
              if (searchQuery) params.append('search', searchQuery);
              if (searchLocation) params.append('location', searchLocation);
              if (searchDate) params.append('date', searchDate);
              router.push(`/events?${params.toString()}`);
            }}
          >
            <input
              type="text"
              placeholder="What are you looking for?"
              className="input-field"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <input
              type="text"
              placeholder="Location"
              className="input-field"
              value={searchLocation}
              onChange={e => setSearchLocation(e.target.value)}
            />
            <input
              type="date"
              className="input-field"
              value={searchDate}
              onChange={e => setSearchDate(e.target.value)}
            />
            <button type="submit" className="btn-primary">
              Search Events
            </button>
          </form>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Explore by Category</h2>
        
        {!loading && (
          categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={`/events?category=${category.name.toLowerCase()}`}
                  className="group text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  {category.icon && (
                    <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <category.icon className="h-8 w-8 text-white" />
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count} events</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-600">Events will be grouped by category here once they are added.</p>
            </div>
          )
        )}
      </section>

      {/* Featured Events Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Events</h2>
          <Link href="/events" className="flex items-center text-blue-600 hover:text-blue-700 font-semibold">
            View All Events
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : featuredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow-md">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No featured events</h3>
            <p className="text-gray-600">Check back later for exciting new events!</p>
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Why Choose EventHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">10,000+ Events</h3>
              <p className="text-gray-600">Discover events from around the world</p>
            </div>
            <div>
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">50,000+ Users</h3>
              <p className="text-gray-600">Join our growing community</p>
            </div>
            <div>
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">4.9/5 Rating</h3>
              <p className="text-gray-600">Trusted by event organizers</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Only show for admins */}
      {isAuthenticated && user?.role === 'admin' && (
        <section className="bg-blue-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Create Your Event?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of organizers who trust EventHub to manage their events
            </p>
            <Link href="/create-event" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Started Today
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
