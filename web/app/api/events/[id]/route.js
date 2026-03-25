import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// DELETE - supprimer un événement
export async function DELETE(req, { params }) {
  const { id } = await params;
  await pool.query('DELETE FROM events WHERE id = $1', [id]);
  return NextResponse.json({ message: 'Supprimé' });
}