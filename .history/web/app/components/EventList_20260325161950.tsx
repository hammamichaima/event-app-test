'use client';
import { useState } from 'react';

type Event = { id: number; title: string; description: string; date: string; location: string };
type Client = { id: number; name: string; email: string };

export default function EventList({ events, onDeleted }: { events: Event[]; onDeleted: () => void }) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    setDeletingId(null);
    onDeleted();
  };

  const handleViewClients = async (event: Event) => {
    setLoadingClients(true);
    const res = await fetch(`/api/events/${event.id}/registrations`);
    const data = await res.json();
    setClients(data);
    setSelectedEvent(event);
    setLoadingClients(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-gray-800">📋 Événements</h2>

      {events.length === 0 && (
        <div className="text-center py-16 text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border border-dashed">
          <p className="text-5xl mb-3">📭</p>
          <p className="text-sm">Aucun événement pour le moment.</p>
        </div>
      )}

      <div className="grid gap-4">
        {events.map(event => (
          <div
            key={event.id}
            className="group bg-white border border-gray-100 rounded-2xl p-5 flex justify-between items-start shadow-sm hover:shadow-lg transition-all duration-200"
          >
            <div className="flex gap-4">
              <div className="bg-indigo-100 text-indigo-700 rounded-xl p-3 text-xl group-hover:scale-110 transition">
                🎯
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">{event.title}</h3>

                <p className="text-gray-500 text-sm mt-1">
                  📍 {event.location} · 🗓{' '}
                  {new Date(event.date).toLocaleDateString('fr-FR', { dateStyle: 'medium' })}
                </p>

                {event.description && (
                  <p className="text-gray-400 text-xs mt-2 line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2 ml-4 shrink-0">
              <button
                onClick={() => handleViewClients(event)}
                className="text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 active:scale-95 transition"
              >
                👥 Clients
              </button>

              <button
                onClick={() => handleDelete(event.id)}
                disabled={deletingId === event.id}
                className="text-xs font-medium bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 active:scale-95 transition disabled:opacity-50"
              >
                {deletingId === event.id ? '...' : '🗑 Supprimer'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal clients */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in-95">
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">
                👥 Clients — {selectedEvent.title}
              </h3>

              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            </div>

            {loadingClients ? (
              <p className="text-center text-gray-400 py-6">Chargement...</p>
            ) : clients.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">
                Aucun client inscrit.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                {clients.map(c => (
                  <li key={c.id} className="py-3 flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{c.name}</span>
                    <span className="text-gray-400">{c.email}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}