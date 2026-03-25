import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - clients inscrits à un événement
export async function GET(req, { params }) {
  const result = await pool.query(`
    SELECT users.id, users.name, users.email, registrations.registered_at
    FROM registrations
    JOIN users ON users.id = registrations.user_id
    WHERE registrations.event_id = $1
  `, [params.id]);
  return NextResponse.json(result.rows);
}

// POST - inscrire un client à un événement
export async function POST(req, { params }) {
  const { user_id } = await req.json();
  try {
    await pool.query(
      'INSERT INTO registrations (user_id, event_id) VALUES ($1, $2)',
      [user_id, params.id]
    );
    return NextResponse.json({ message: 'Inscrit avec succès' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Déjà inscrit' }, { status: 409 });
  }
}