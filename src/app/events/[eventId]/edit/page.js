'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/components/AuthProvider';
import { format } from 'date-fns';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { eventId } = params;
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event data.');
        }
        const data = await response.json();
        
        // Format dates and times for input fields
        const formattedData = {
          ...data,
          dateTime: {
            startDate: format(new Date(data.dateTime.start), 'yyyy-MM-dd'),
            startTime: format(new Date(data.dateTime.start), 'HH:mm'),
            endDate: format(new Date(data.dateTime.end), 'yyyy-MM-dd'),
            endTime: format(new Date(data.dateTime.end), 'HH:mm'),
          },
          location: {
            venue: data.location.venue || '',
          },
          image: data.images && data.images.length > 0 ? data.images[0] : '',
        };
        setFormData(formattedData);
      } catch (err) {
        toast.error(err.message);
        setError('Could not load event data.');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  useEffect(() => {
    if (!loading && formData) {
      if (!isAuthenticated || (user._id !== formData.organizer._id && user.role !== 'admin')) {
        toast.error("You don't have permission to edit this event.");
        router.replace(`/events/${eventId}`);
      }
    }
  }, [user, isAuthenticated, formData, loading, router, eventId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const keys = name.split('.');

    if (keys.length > 1) {
      setFormData((prev) => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { dateTime, image, ...rest } = formData;
    const startDateTime = new Date(`${dateTime.startDate}T${dateTime.startTime}`);
    const endDateTime = new Date(`${dateTime.endDate}T${dateTime.endTime}`);
    
    const payload = {
      ...rest,
      dateTime: {
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
      },
      images: image ? [image] : [],
    };

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Event updated successfully!');
        router.push(`/events/${eventId}`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update event.');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const categories = ['Music', 'Sports', 'Business', 'Technology', 'Food', 'Art', 'Education', 'Other'];

  if (loading || !formData) {
    return <div className="text-center py-10">Loading event details...</div>;
  }
  
  if (error) {
     return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
        <p className="text-gray-600">Update the details for "{formData.title}"</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="input-field">
                {categories.map(cat => <option key={cat} value={cat.toLowerCase()}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="input-field"></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <input type="date" name="dateTime.startDate" value={formData.dateTime.startDate} onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
              <input type="time" name="dateTime.startTime" value={formData.dateTime.startTime} onChange={handleChange} required className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
              <input type="date" name="dateTime.endDate" value={formData.dateTime.endDate} onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
              <input type="time" name="dateTime.endTime" value={formData.dateTime.endTime} onChange={handleChange} required className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Venue / Location *</label>
            <input type="text" name="location.venue" value={formData.location.venue} onChange={handleChange} required className="input-field" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Capacity *</label>
              <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required min="1" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input type="url" name="image" value={formData.image} onChange={handleChange} className="input-field" />
          </div>
          <div className="flex items-center">
            <input id="isFeatured" name="isFeatured" type="checkbox" checked={formData.isFeatured} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">Mark as a featured event</label>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Updating...' : 'Update Event'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}