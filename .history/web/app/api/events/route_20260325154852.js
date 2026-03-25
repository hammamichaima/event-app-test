import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { initDB } from '@/lib/init-db';

// GET - liste des événements
export async function GET() {
  await initDB();
  const result = await pool.query('SELECT * FROM events ORDER BY date ASC');
  return NextResponse.json(result.rows);
}

// POST - créer un événement
export async function POST(req) {
  const { title, description, date, location } = await req.json();
  const result = await pool.query(
    'INSERT INTO events (title, description, date, location) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, description, date, location]
  );
  return NextResponse.json(result.rows[0], { status: 201 });
}