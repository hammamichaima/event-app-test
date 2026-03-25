import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(req, { params }) {
  const { id } = await params;
  const rows = await sql`
    SELECT users.id, users.name, users.email, registrations.registered_at
    FROM registrations
    JOIN users ON users.id = registrations.user_id
    WHERE registrations.event_id = ${id}
  `;
  return NextResponse.json(rows);
}

export async function POST(req, { params }) {
  const { id } = await params;
  const { user_id } = await req.json();
  try {
    await sql`INSERT INTO registrations (user_id, event_id) VALUES (${user_id}, ${id})`;
    return NextResponse.json({ message: 'Inscrit avec succès' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Déjà inscrit' }, { status: 409 });
  }
}
