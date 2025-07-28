import EventsPageClient from './EventsPageClient';
import { Suspense } from 'react';

export default function EventsPage() {
  return (
    <Suspense>
      <EventsPageClient />
    </Suspense>
  );
} 