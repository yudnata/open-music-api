const jwt = require('jsonwebtoken');
const AuthenticationError = require('../utils/AuthenticationError');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return next(new AuthenticationError('Missing authentication token'));
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, user) => {
    if (err) {
      return next(new AuthenticationError('Invalid or expired token'));
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;