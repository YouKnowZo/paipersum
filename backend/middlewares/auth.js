const { auth } = require('express-oauth2-jwt-bearer');

const requiredEnv = ['AUTH0_AUDIENCE', 'AUTH0_ISSUER_BASE_URL'];
const hasAuth0Config = requiredEnv.every((key) => Boolean(process.env[key]));
let hasWarned = false;

const protect = hasAuth0Config
  ? auth({
      audience: process.env.AUTH0_AUDIENCE,
      issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
      tokenSigningAlg: 'RS256'
    })
  : (req, res, next) => {
      if (!hasWarned && process.env.NODE_ENV !== 'production') {
        console.warn('Auth0 is not configured. Requests are not authenticated.');
        hasWarned = true;
      }

      if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({
          success: false,
          error: 'Auth0 is not configured on the server.'
        });
      }

      return next();
    };

module.exports = { protect };