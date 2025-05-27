const ordersController = require('../controllers/ordersController');

async function ordersRouter(req, res) {
    if (req.method === 'GET' && req.url === '/api/orders') {
        const user = req.session.user;
        if (!user) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Chưa đăng nhập' }));
        }
        try {
            const orders = await ordersController.getOrders(user.id_nguoi_dung);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ orders }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Lỗi khi lấy đơn hàng' }));
        }
        return true;
    }
    return false;
}

module.exports = ordersRouter;