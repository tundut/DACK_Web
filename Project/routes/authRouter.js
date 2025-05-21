const authController = require('../controllers/authController');

function authRouter(req, res) {
    if (req.method === 'POST' && req.url === '/register') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                req.body = JSON.parse(body);
                authController.register(req, res);
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Dữ liệu không hợp lệ' }));
            }
        });
        return true;
    }

    if (req.method === 'POST' && req.url === '/login') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                req.body = JSON.parse(body);
                authController.login(req, res);
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Dữ liệu không hợp lệ' }));
            }
        });
        return true;
    }

    return false;
}

module.exports = authRouter;
