'use client';
import { useState } from 'react';

type Event = { id: number; title: string; description: string; date: string; location: string };
type Client = { id: number; name: string; email: string };

export default function EventList({ events, onDeleted }: { events: Event[]; onDeleted: () => void }) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  const handleDelete = async (id: number) => {
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    onDeleted();
  };

  const handleViewClients = async (event: Event) => {
    const res = await fetch(`/api/events/${event.id}/registrations`);
    const data = await res.json();
    setClients(data);
    setSelectedEvent(event);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Événements</h2>
      {events.length === 0 && (
        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-4xl mb-2">📭</p>
          <p className="text-sm">Aucun événement pour le moment.</p>
        </div>
      )}
      <div className="space-y-3">
        {events.map(event => (
          <div key={event.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex justify-between items-start shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-4 items-start">
              <div className="bg-indigo-100 text-indigo-700 rounded-xl p-3 text-xl">🎯</div>
              <div>
                <h3 className="font-bold text-gray-800">{event.title}</h3>
                <p className="text-gray-500 text-sm mt-0.5">
                  📍 {event.location} &nbsp;·&nbsp; 🗓 {new Date(event.date).toLocaleDateString('fr-FR', { dateStyle: 'medium' })}
                </p>
                {event.description && <p className="text-gray-400 text-xs mt-1">{event.description}</p>}
              </div>
            </div>
            <div className="flex gap-2 ml-4 shrink-0">
              <button
                onClick={() => handleViewClients(event)}
                className="text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                👥 Clients
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="text-xs font-medium bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
              >
                🗑 Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800">👥 Clients — {selectedEvent.title}</h3>
            <button onClick={() => setSelectedEvent(null)} className="text-xs text-gray-400 hover:text-gray-600 underline">Fermer</button>
          </div>
          {clients.length === 0 ? (
            <p className="text-gray-400 text-sm">Aucun client inscrit.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {clients.map(c => (
                <li key={c.id} className="py-2 text-sm flex justify-between">
                  <span className="font-medium text-gray-700">{c.name}</span>
                  <span className="text-gray-400">{c.email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
