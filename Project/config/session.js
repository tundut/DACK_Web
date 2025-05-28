const clientSessions = require('client-sessions');

const sessionMiddleware = clientSessions({
  cookieName: 'session',
  secret: 'abcde12345',
  duration: 24 * 60 * 60 * 1000,
  activeDuration: 1000 * 60 * 5,
});

module.exports = sessionMiddleware;
