'use client';
import { useState } from 'react';

export default function EventForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ title: '', description: '', date: '', location: '' });
    setLoading(false);
    onCreated();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Nouvel événement</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Titre</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Nom de l'événement"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Description</label>
          <textarea
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            placeholder="Description de l'événement"
            rows={3}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Date & heure</label>
          <input
            type="datetime-local"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Lieu</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Ville, pays"
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          {loading ? 'Création en cours...' : 'Créer l\'événement'}
        </button>
      </form>
    </div>
  );
}
