'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  DollarSign,
  Users,
  Calendar,
  Ticket,
  BarChart,
  Edit,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, icon, note }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {note && <p className="text-xs text-gray-400 mt-1">{note}</p>}
      </div>
      <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
    </div>
  </div>
);

const QuickActionButton = ({ href, children }) => (
  <Link
    href={href}
    className="bg-white p-6 rounded-lg shadow text-center font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
  >
    {children}
  </Link>
);

export default function DashboardPage() {
  const auth = useAuth();
  const router = useRouter();
  const [adminStats, setAdminStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('platform'); // 'platform' or 'personal'

  useEffect(() => {
    if (auth.loading) return;
    if (!auth.isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        if (auth.user.role=="admin") {
          // Fetch admin-specific platform stats
          const adminRes = await fetch('/api/admin/stats');
          if (adminRes.ok) {
            setAdminStats(await adminRes.json());
          } else {
            toast.error('Could not fetch admin statistics.');
          }

          // Also fetch the admin's personal stats as a user
          const userStatsRes = await fetch('/api/dashboard/user-stats');
          if (userStatsRes.ok) {
            setUserStats(await userStatsRes.json());
          } else {
             toast.error('Could not fetch personal statistics.');
          }
          
          // Admins who organize events also see their events
          const eventsRes = await fetch('/api/events/user');
           if (eventsRes.ok) {
            const eventsData = await eventsRes.json();
            setUserEvents(eventsData.events || []);
          }

        } else {
          // Fetch stats for regular users
          const res = await fetch('/api/dashboard/user-stats');
          if (res.ok) {
            const data = await res.json();
            setUserStats(data);
          } else {
            toast.error('Could not fetch your statistics.');
          }
        }
      } catch (error) {
        toast.error('An error occurred while fetching data.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth.isAuthenticated, auth.loading, auth.user, router]);

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Event deleted successfully');
        setUserEvents(userEvents.filter(event => event._id !== eventId));
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to delete event.');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the event.');
    }
  };
  
  if (loading || auth.loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-10"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-lg text-gray-600">
            Welcome back, {auth.user?.name}!
          </p>
        </div>

        {/* Quick Actions */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <QuickActionButton href="/events">Explore Events</QuickActionButton>
            <QuickActionButton href="/my-bookings">My Bookings</QuickActionButton>
            {auth.user.role=="admin" && (
              <QuickActionButton href="/create-event">
                Create Event
              </QuickActionButton>
            )}
          </div>
        </section>

        {/* Conditional Rendering for Admin vs. User */}
        {auth.user.role=="admin" ? (
          <>
            {/* Admin Tabs */}
            <div className="mb-6 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('platform')}
                  className={`${
                    activeTab === 'platform'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Platform Overview
                </button>
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`${
                    activeTab == 'personal'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  My Activity
                </button>
              </nav>
            </div>

            {/* Admin Tab Content */}
            {activeTab == 'platform' && adminStats && (
              <div id="platform-stats">
                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Platform Statistics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Revenue" value={adminStats.totalRevenueFormatted} icon={<DollarSign className="h-6 w-6 text-green-500" />} />
                    <StatCard title="Total Events" value={adminStats.totalEvents} icon={<Calendar className="h-6 w-6 text-indigo-500" />} />
                    <StatCard title="Total Users" value={adminStats.totalUsers} icon={<Users className="h-6 w-6 text-blue-500" />} />
                    <StatCard title="Total Bookings" value={adminStats.totalBookings} icon={<Ticket className="h-6 w-6 text-yellow-500" />} />
                  </div>
                </section>
                <section className="mt-10">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Created Events</h2>
                  <div className="bg-white rounded-lg shadow">
                    <ul className="divide-y divide-gray-200">
                      {userEvents.length > 0 ? (
                        userEvents.slice(0, 5).map(event => (
                          <li key={event._id} className="p-4 flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-gray-800">{event.title}</p>
                              <p className="text-sm text-gray-500">{format(new Date(event.dateTime.start), 'MMM d, yyyy')} - {event.location.venue}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <button onClick={() => router.push(`/events/${event._id}/edit`)} className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"><Edit size={16} /> Edit</button>
                              <button onClick={() => handleDelete(event._id)} className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center gap-1"><Trash2 size={16} /> Delete</button>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="p-6 text-center text-gray-500">You have not created any events yet.</li>
                      )}
                    </ul>
                  </div>
                </section>
              </div>
            )}
            {activeTab === 'personal' && userStats && (
              <div id="personal-stats">
                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Personal Statistics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="My Upcoming Events" value={userStats?.upcomingBookings ?? 0} icon={<Calendar className="h-6 w-6 text-indigo-500" />} />
                    <StatCard title="Events Attended" value={userStats?.attendedBookings ?? 0} icon={<Ticket className="h-6 w-6 text-green-500" />} />
                    <StatCard title="Total Bookings" value={userStats?.totalBookings ?? 0} icon={<BarChart className="h-6 w-6 text-yellow-500" />} />
                  </div>
                </section>
              </div>
            )}
          </>
        ) : (
          <>
            {/* User-Specific Stats */}
            {userStats && (
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Activity</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard title="Upcoming Events" value={userStats.upcomingBookings} icon={<Calendar className="h-6 w-6 text-indigo-500" />} />
                  <StatCard title="Events Attended" value={userStats.attendedBookings} icon={<Ticket className="h-6 w-6 text-green-500" />} note={`${userStats.totalSpentFormatted} spent`} />
                  <StatCard title="Total Bookings" value={userStats.totalBookings} icon={<BarChart className="h-6 w-6 text-yellow-500" />} />
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}