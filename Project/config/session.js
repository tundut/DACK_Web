const clientSessions = require('client-sessions');

const sessionMiddleware = clientSessions({
  cookieName: 'session',         // Tên cookie lưu session
  secret: 'abcde12345',     // Chuỗi bí mật (nên dài & ngẫu nhiên)
  duration: 24 * 60 * 60 * 1000, // 1 ngày
  activeDuration: 1000 * 60 * 5, // Tự gia hạn 5 phút nếu hoạt động
});

module.exports = sessionMiddleware;
