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

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">Liste des événements</h3>
          <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">{events.length} au total</span>
        </div>

        {events.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-slate-500 font-medium">Aucun événement créé pour le moment.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {events.map(event => {
              const d = new Date(event.date);
              return (
                <li key={event.id} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                  <div className="bg-blue-50 rounded-xl w-12 h-12 flex flex-col items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-blue-700 leading-none">{d.getDate()}</span>
                    <span className="text-xs font-semibold text-blue-400">{d.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{event.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {event.location && <span>{event.location} · </span>}
                      {formatDate(event.date)}
                    </p>
                    {event.description && <p className="text-xs text-slate-400 mt-0.5 truncate">{event.description}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleViewClients(event)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${selectedEvent?.id === event.id ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                    >
                      Participants
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {selectedEvent && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">Participants</h3>
              <p className="text-xs text-slate-400 mt-0.5">{selectedEvent.title}</p>
            </div>
            <button onClick={() => setSelectedEvent(null)} className="text-xs text-slate-400 hover:text-slate-600 transition-colors font-medium">
              Fermer
            </button>
          </div>
          {clients.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-slate-500">Aucun participant inscrit à cet événement.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {clients.map(c => (
                <li key={c.id} className="px-5 py-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">{c.name}</span>
                  <span className="text-xs text-slate-400">{c.email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
