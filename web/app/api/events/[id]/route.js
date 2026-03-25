import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(req, { params }) {
  const { id } = await params;
  const rows = await sql`SELECT * FROM events WHERE id = ${id}`;
  if (!rows[0]) return NextResponse.json({ error: 'Introuvable' }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  await sql`DELETE FROM registrations WHERE event_id = ${id}`;
  await sql`DELETE FROM events WHERE id = ${id}`;
  return NextResponse.json({ message: 'Supprimé' });
}
