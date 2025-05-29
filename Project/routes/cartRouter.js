const cartController = require('../controllers/cartController');
const { VaiTro } = require('../utils/constants');

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
    if (req.method === 'POST' && req.url === '/api/cart/add') {
        if (!req.session.user) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Chưa đăng nhập' }));
            return true;
        }
        // Chặn nhân viên thêm hàng vào giỏ
        if (req.session.user.vai_tro === VaiTro.NHAN_VIEN) {
            res.writeHead(403, { 'Content-Type': 'application/json; charset=UTF-8' });
            res.end(JSON.stringify({ success: false, message: 'Nhân viên không có quyền thêm hàng vào giỏ!' }));
            return true;
        }
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const { id_san_pham, so_luong } = JSON.parse(body);
                // Lấy id_tai_khoan từ session
                const id_tai_khoan = req.session.user.id_tai_khoan;
                await cartController.addToCart(id_tai_khoan, id_san_pham, so_luong || 1);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: err.message }));
            }
        });
        return true;
    }

    if (req.url === '/api/cart/update' && req.method === 'POST') {
        if (!req.session.user) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Chưa đăng nhập' }));
            return true;
        }
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { id_san_pham, so_luong } = JSON.parse(body);
                const id_tai_khoan = req.session.user.id_tai_khoan;
                await cartController.updateQuantity(id_tai_khoan, id_san_pham, so_luong);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: e.message }));
            }
        });
        return true;
    }

    return false;
}

module.exports = cartRouter;
