import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export async function POST(req) {
  const { email, password } = await req.json();

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password)))
    return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

  return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email } });
}