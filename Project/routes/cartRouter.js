const cartController = require('../controllers/cartController');

async function cartRouter(req, res) {
    if (req.url === '/api/cart' && req.method === 'GET') {
        if (!req.session.user) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Chưa đăng nhập' }));
            return true;
        }
        try {
            const chiTiet = await cartController.getCart(req.session.user.id_tai_khoan);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(chiTiet));
        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Lỗi lấy giỏ hàng', error: e.message }));
        }
        return true;
    }

    if (req.url === '/api/checkout' && req.method === 'POST') {
        if (!req.session.user) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Chưa đăng nhập' }));
            return true;
        }
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { paymentMethod } = JSON.parse(body);
                const result = await cartController.checkout(req.session.user.id_tai_khoan, paymentMethod);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } catch (e) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Lỗi checkout', error: e.message }));
            }
        });
        return true;
    }

    if (req.url.startsWith('/api/cart/remove') && req.method === 'POST') {
        if (!req.session.user) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Chưa đăng nhập' }));
            return true;
        }
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { id_san_pham } = JSON.parse(body);
                const result = await cartController.removeFromCart(req.session.user.id_tai_khoan, id_san_pham);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } catch (e) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Lỗi xóa sản phẩm', error: e.message }));
            }
        });
        return true;
    }

    return false;
}

module.exports = cartRouter;
