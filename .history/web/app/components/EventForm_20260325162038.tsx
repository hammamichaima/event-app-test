'use client';
import { useState } from 'react';

export default function EventForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setForm({ title: '', description: '', date: '', location: '' });
    setLoading(false);
    setSuccess(true);
    onCreated();

    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-7 mb-8 shadow-sm hover:shadow-md transition">
      
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        ✨ <span>Nouvel événement</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* TITLE */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Titre</label>
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm 
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
            transition bg-gray-50 focus:bg-white"
            placeholder="Ex: Conférence Tech 2025"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
          <textarea
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm 
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
            transition bg-gray-50 focus:bg-white resize-none"
            placeholder="Décrivez votre événement..."
            rows={3}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* DATE + LOCATION */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Date & heure</label>
            <input
              type="datetime-local"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
              transition bg-gray-50 focus:bg-white"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Lieu</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
              transition bg-gray-50 focus:bg-white"
              placeholder="Ex: Tunis, Centre Ville"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
            />
          </div>
        </div>

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
            ✅ Événement créé avec succès
          </div>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 
          active:scale-[0.98] disabled:opacity-60 
          text-white font-semibold py-2.5 rounded-xl 
          transition-all duration-150 shadow-md"
        >
          {loading ? 'Création...' : '🚀 Créer l\'événement'}
        </button>
      </form>
    </div>
  );
}