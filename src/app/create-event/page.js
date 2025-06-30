'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Clock, Users, DollarSign, Tag, Shield, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/components/AuthProvider';

export default function CreateEventPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: {
      venue: '',
    },
    dateTime: {
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
    },
    price: '',
    capacity: '',
    image: '',
    isFeatured: false,
  });
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (isAuthenticated !== null) {
      if (!isAuthenticated || (user && user.role !== 'admin')) {
        toast.error('Admin access is required.');
        router.replace('/');
      } else {
        setCheckingAuth(false);
      }
    }
  }, [isAuthenticated, user, router]);

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
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const {
      title,
      description,
      category,
      location,
      dateTime,
      price,
      capacity,
      image,
      isFeatured,
    } = formData;

    // Combine date and time strings to create ISO 8601 formatted dates
    const startDateTime = new Date(`${dateTime.startDate}T${dateTime.startTime}`);
    const endDateTime = new Date(`${dateTime.endDate}T${dateTime.endTime}`);
    
    const payload = {
      title,
      description,
      category: category.toLowerCase(),
      location: {
        venue: location.venue,
      },
      dateTime: {
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
      },
      price: parseFloat(price) || 0,
      capacity: parseInt(capacity, 10),
      images: image ? [image] : [],
      isFeatured,
    };

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Event created successfully!');
        router.push('/dashboard');
      } else {
        const error = await response.json();
        // Handle multiple validation errors
        if (error.errors) {
          const messages = Object.values(error.errors).map(e => e.message);
          toast.error(messages.join('\n'));
        } else {
          toast.error(error.message || 'Failed to create event. Please check your input.');
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const categories = [
    'Music', 'Sports', 'Business', 'Technology', 'Food', 'Art', 'Education', 'Other'
  ];

  if (checkingAuth) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p>Checking permissions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Shield className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
        </div>
        <p className="text-gray-600">Share your event with the world (Admin Only)</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="input-field" placeholder="Enter event title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="input-field">
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="input-field" placeholder="Describe your event..."></textarea>
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
            <input type="text" name="location.venue" value={formData.location.venue} onChange={handleChange} required className="input-field" placeholder="e.g., Convention Center" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" className="input-field" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Capacity *</label>
              <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required min="1" className="input-field" placeholder="e.g., 500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input type="url" name="image" value={formData.image} onChange={handleChange} className="input-field" placeholder="https://example.com/image.png" />
          </div>

          <div className="flex items-center">
            <input
              id="isFeatured"
              name="isFeatured"
              type="checkbox"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
              Mark as a featured event
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => router.back()} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 