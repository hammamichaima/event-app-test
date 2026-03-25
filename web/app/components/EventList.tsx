'use client';
import { useState } from 'react';

type Event = { id: number; title: string; description: string; date: string; location: string };
type Client = { id: number; name: string; email: string };

export default function EventList({ events, onDeleted }: { events: Event[]; onDeleted: () => void }) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  const handleDelete = async (id: number) => {
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    if (selectedEvent?.id === id) setSelectedEvent(null);
    onDeleted();
  };

  const handleViewClients = async (event: Event) => {
    if (selectedEvent?.id === event.id) { setSelectedEvent(null); return; }
    const res = await fetch(`/api/events/${event.id}/registrations`);
    const data = await res.json();
    setClients(data);
    setSelectedEvent(event);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Événements</h3>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{events.length} au total</span>
        </div>

        {events.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">Aucun événement créé pour le moment.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {events.map(event => (
              <li key={event.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {event.location && <span>{event.location} &middot; </span>}
                    {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <button
                    onClick={() => handleViewClients(event)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${selectedEvent?.id === event.id ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                  >
                    Participants
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedEvent && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Participants</h3>
              <p className="text-xs text-gray-400 mt-0.5">{selectedEvent.title}</p>
            </div>
            <button onClick={() => setSelectedEvent(null)} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Fermer
            </button>
          </div>
          {clients.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-gray-500">Aucun participant inscrit à cet événement.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {clients.map(c => (
                <li key={c.id} className="px-6 py-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800">{c.name}</span>
                  <span className="text-xs text-gray-400">{c.email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
