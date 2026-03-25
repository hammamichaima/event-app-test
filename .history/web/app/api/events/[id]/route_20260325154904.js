import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// DELETE - supprimer un événement
export async function DELETE(req, { params }) {
  await pool.query('DELETE FROM events WHERE id = $1', [params.id]);
  return NextResponse.json({ message: 'Supprimé' });
}