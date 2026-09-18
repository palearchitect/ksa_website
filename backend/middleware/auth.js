const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('❌ FATAL: JWT_SECRET environment variable is missing in production!');
  process.exit(1);
}

const EFFECTIVE_JWT_SECRET = JWT_SECRET || 'dev_only_secret_do_not_use_in_production_12345';
const EFFECTIVE_REFRESH_SECRET = JWT_REFRESH_SECRET || 'dev_only_refresh_secret_do_not_use_in_production_12345';

const authenticateToken = (req, res, next) => {
  const token = req.cookies?.ksa_access || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, EFFECTIVE_JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired access token' });
  }
};

const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
    }
    
    next();
  };
};

const requireAdmin = requireRole(['admin', 'superadmin']);
const requireAdminOrManager = requireRole(['admin', 'superadmin', 'manager', 'webadmin']);

module.exports = {
  JWT_SECRET: EFFECTIVE_JWT_SECRET,
  JWT_REFRESH_SECRET: EFFECTIVE_REFRESH_SECRET,
  authenticateToken,
  requireRole,
  requireAdmin,
  requireAdminOrManager
};
