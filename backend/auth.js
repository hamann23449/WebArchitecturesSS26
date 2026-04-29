const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// middleware required by index.js will have already added express.json() and cookieParser

const AUTH_ERROR = 'E-Mail oder Passwort ungültig.';

router.post('/register', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'E-Mail bereits vergeben.' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed } });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    console.error('register error', err);
    res.status(500).json({ error: 'internal error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: AUTH_ERROR });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: AUTH_ERROR });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: AUTH_ERROR });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET not set');
      return res.status(500).json({ error: 'internal error' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: '24h' });

    // set as HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    res.json({ id: user.id, email: user.email });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ error: 'internal error' });
  }
});

module.exports = router;
