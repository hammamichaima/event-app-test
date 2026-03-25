import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { initDB } from '@/lib/init-db';

export async function POST(req) {
  await initDB();
  const { name, email, password } = await req.json();

  if (!name || !email || !password)
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });

  const hashed = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashed]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 409 });
  }
}