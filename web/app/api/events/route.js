import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  const rows = await sql`SELECT * FROM events ORDER BY date ASC`;
  return NextResponse.json(rows);
}

export async function POST(req) {
  const { title, description, date, location } = await req.json();
  const rows = await sql`
    INSERT INTO events (title, description, date, location)
    VALUES (${title}, ${description}, ${date}, ${location})
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}
