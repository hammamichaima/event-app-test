'use client';
import { useEffect, useState } from 'react';
import EventForm from './components/EventForm';
import EventList from './components/EventList';

export default function Home() {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    const res = await fetch('/api/events');
    const data = await res.json();
    setEvents(data);
  };

  useEffect(() => { fetchEvents(); }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Gestion des événements</h2>
        <p className="text-sm text-gray-500 mt-1">Créez et gérez vos événements depuis cette interface.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1">
          <EventForm onCreated={fetchEvents} />
        </div>
        <div className="lg:col-span-2">
          <EventList events={events} onDeleted={fetchEvents} />
        </div>
      </div>
    </div>
  );
}
