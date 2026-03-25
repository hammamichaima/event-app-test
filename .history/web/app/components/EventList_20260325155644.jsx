'use client';
import { useState } from 'react';

export default function EventList({ events, onDeleted }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [clients, setClients] = useState([]);

  const handleDelete = async (id) => {
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    onDeleted();
  };

  const handleViewClients = async (event) => {
    const res = await fetch(`/api/events/${event.id}/registrations`);
    const data = await res.json();
    setClients(data);
    setSelectedEvent(event);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Liste des événements</h2>
      {events.length === 0 && <p className="text-gray-500">Aucun événement.</p>}
      <div className="space-y-3">
        {events.map(event => (
          <div key={event.id} className="bg-white shadow rounded-lg p-4 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{event.title}</h3>
              <p className="text-gray-600 text-sm">{event.location} — {new Date(event.date).toLocaleDateString('fr-FR')}</p>
              <p className="text-gray-500 text-sm">{event.description}</p>
            </div>
            <div className="flex gap-2 ml-4">
              <button onClick={() => handleViewClients(event)}
                className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200">
                Clients
              </button>
              <button onClick={() => handleDelete(event.id)}
                className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="mt-6 bg-gray-50 border rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-2">Clients inscrits — {selectedEvent.title}</h3>
          {clients.length === 0 ? <p className="text-gray-500">Aucun client inscrit.</p> : (
            <ul className="space-y-1">
              {clients.map(c => (
                <li key={c.id} className="text-sm">{c.name} ({c.email})</li>
              ))}
            </ul>
          )}
          <button onClick={() => setSelectedEvent(null)} className="mt-3 text-sm text-gray-500 underline">Fermer</button>
        </div>
      )}
    </div>
  );
}