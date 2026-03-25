import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sql from '@/lib/db';

export async function POST(req) {
  const { email, password } = await req.json();

  const rows = await sql`SELECT * FROM users WHERE email = ${email}`;
  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password)))
    return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email } });
}
