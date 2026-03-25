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
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🎉 Gestion des Événements</h1>
      <EventForm onCreated={fetchEvents} />
      <EventList events={events} onDeleted={fetchEvents} />
    </main>
  );
}