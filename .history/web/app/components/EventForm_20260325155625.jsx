'use client';
import { useState } from 'react';

export default function EventForm({ onCreated }) {
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ title: '', description: '', date: '', location: '' });
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-4 mb-6 space-y-3">
      <h2 className="text-xl font-semibold">Ajouter un événement</h2>
      <input className="w-full border rounded p-2" placeholder="Titre" value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })} required />
      <textarea className="w-full border rounded p-2" placeholder="Description" value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })} />
      <input type="datetime-local" className="w-full border rounded p-2" value={form.date}
        onChange={e => setForm({ ...form, date: e.target.value })} required />
      <input className="w-full border rounded p-2" placeholder="Lieu" value={form.location}
        onChange={e => setForm({ ...form, location: e.target.value })} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">
        Créer
      </button>
    </form>
  );
}