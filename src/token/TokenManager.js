const Jwt = require('jsonwebtoken');
const InvariantError = require('../utils/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) => Jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: '30m' }),
  generateRefreshToken: (payload) => Jwt.sign(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
      return artifacts;
    } catch {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;