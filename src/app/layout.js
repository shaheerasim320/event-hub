import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import AuthProvider from '@/components/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EventHub', // From your previous head.js title
  description: 'Discover, book, and manage events with ease', // Existing
  icons: {
    // Primary favicon (you had /favicon.ico and /calendar.svg - choose one for main, or include both as 'other')
    icon: '/calendar.svg', // Using calendar.svg as the primary favicon icon
    // If you also want to include the favicon.ico and calendar-32x32.png as additional icons:
    other: [
      {
        rel: 'icon',
        url: '/favicon.ico',
        sizes: 'any', // As per your head.js
      },
      {
        rel: 'icon',
        url: '/calendar-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}