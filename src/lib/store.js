import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: (userData) => set({
        user: userData,
        isAuthenticated: true,
        isLoading: false
      }),
      
      logout: () => set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      updateUser: (userData) => set({ user: userData })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
);

export const useEventStore = create(
  persist(
    (set, get) => ({
      events: [],
      currentEvent: null,
      userEvents: [],
      isLoading: false,
      
      setEvents: (events) => set({ events }),
      
      setCurrentEvent: (event) => set({ currentEvent: event }),
      
      setUserEvents: (events) => set({ userEvents: events }),
      
      addEvent: (event) => set((state) => ({
        events: [...state.events, event],
        userEvents: [...state.userEvents, event]
      })),
      
      updateEvent: (eventId, updatedEvent) => set((state) => ({
        events: state.events.map(event => 
          event._id === eventId ? updatedEvent : event
        ),
        userEvents: state.userEvents.map(event => 
          event._id === eventId ? updatedEvent : event
        )
      })),
      
      deleteEvent: (eventId) => set((state) => ({
        events: state.events.filter(event => event._id !== eventId),
        userEvents: state.userEvents.filter(event => event._id !== eventId)
      })),
      
      setLoading: (loading) => set({ isLoading: loading })
    }),
    {
      name: 'event-storage',
      partialize: (state) => ({ events: state.events, userEvents: state.userEvents })
    }
  )
);

export const useBookingStore = create(
  persist(
    (set, get) => ({
      bookings: [],
      currentBooking: null,
      isLoading: false,
      
      setBookings: (bookings) => set({ bookings }),
      
      setCurrentBooking: (booking) => set({ currentBooking: booking }),
      
      addBooking: (booking) => set((state) => ({
        bookings: [...state.bookings, booking]
      })),
      
      updateBooking: (bookingId, updatedBooking) => set((state) => ({
        bookings: state.bookings.map(booking => 
          booking._id === bookingId ? updatedBooking : booking
        )
      })),
      
      cancelBooking: (bookingId) => set((state) => ({
        bookings: state.bookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      })),
      
      setLoading: (loading) => set({ isLoading: loading })
    }),
    {
      name: 'booking-storage',
      partialize: (state) => ({ bookings: state.bookings })
    }
  )
); 