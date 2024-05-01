import { serialize } from 'cookie';
import { randomBytes } from 'crypto';

export default function handler(req, res) {
  const token = randomBytes(64).toString('base64');
  const cookie = serialize('CSRF-TOKEN', token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600 // 1 hour
  });
  res.setHeader('Set-Cookie', cookie);
  res.status(200).json({ token });
}
