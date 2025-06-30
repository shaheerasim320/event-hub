'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Calendar } from 'lucide-react';
import EventCard from '@/components/EventCard';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      const fetchSearchResults = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/events?search=${query}`);
          if (response.ok) {
            const data = await response.json();
            setEvents(data.events);
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchSearchResults();
    } else {
      setLoading(false);
      setEvents([]);
    }
  }, [query]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">
            We couldn&apos;t find any events matching your search.
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <SearchPageContentWrapper />
      </Suspense>
    </div>
  );
}

function SearchPageContentWrapper() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Search Results for &quot;{query}&quot;
        </h1>
        <p className="text-gray-600">
          Showing events that match your search query.
        </p>
      </div>
      <SearchPageContent />
    </>
  );
} 