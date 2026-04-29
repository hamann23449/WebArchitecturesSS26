const jwt = require('jsonwebtoken');

/**
 * Express middleware to authenticate requests using a JWT.
 * - Supports token in an HttpOnly cookie named `token` or an Authorization: Bearer <token> header.
 * - On success: attaches the decoded payload to `req.user` and calls next().
 * - On missing/invalid token: responds 401.
 */
module.exports = function authenticate(req, res, next) {
  const cookieToken = req.cookies && req.cookies.token;
  let headerToken = null;
  const authHeader = req.headers && req.headers.authorization;
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    headerToken = authHeader.slice(7).trim();
  }

  const token = cookieToken || headerToken;
  if (!token) return res.status(401).json({ error: 'unauthorized' });

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET not set');
    return res.status(500).json({ error: 'internal error' });
  }

  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (err) {
    console.warn('token verify failed', err && err.message);
    return res.status(401).json({ error: 'unauthorized' });
  }
};
