const authController = require('../controllers/authController');

function authRouter(req, res) {
    if (req.method === 'POST' && req.url === '/register') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                req.body = JSON.parse(body);
                const result = await authController.register(req.body);
                const payload = JSON.stringify(result);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(payload);
            } catch (error) {
                console.error('Lỗi khi đăng ký:', error);
                const payload = JSON.stringify({ message: 'Lỗi khi đăng ký' });
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(payload);
            }
        });
        return true;
    }
  
    if (req.method === 'POST' && req.url === '/login') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                req.body = JSON.parse(body);
                const result = await authController.login(req.body, req.session);
                const payload = JSON.stringify(result);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(payload);
            } catch (error) {
                console.error('Lỗi khi đăng nhập:', error);
                const status = error.statusCode || 500;
                const message = error.statusCode === 401 ? error.message : 'Lỗi khi đăng nhập';
                const payload = JSON.stringify({ message });
                res.writeHead(status, { 'Content-Type': 'application/json' });
                res.end(payload);
            }
        });
        return true;
    }
  
    if (req.method === 'GET' && req.url === '/logout') {
        (async () => {
            try {
                const result = await authController.logout(req.session);
                res.writeHead(302, { Location: result.redirect });
                res.end();
            } catch (error) {
                console.error('Lỗi khi đăng xuất:', error);
                const payload = JSON.stringify({ message: 'Lỗi khi đăng xuất' });
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(payload);
            }
        })();
        return true;
    }

    return false;
  }
  
  module.exports = authRouter;
