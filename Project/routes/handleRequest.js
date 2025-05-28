const staticRouter = require('./staticRouter');
const { pageRouter } = require('./pageRouter');
const authRouter = require('./authRouter');
const cartController = require('../controllers/cartController'); // Thêm dòng này
const ordersRouter = require('./ordersRouter');
const addRouter = require('./addRouter');
const session = require('../config/session');
const productRouter = require('./productRouter'); // Sửa lỗi ReferenceError

const handleRequest = (req, res) => {
    session(req, res, async () => {
        if (staticRouter(req, res)) return;
        if (productRouter(req, res)) return;
        if (pageRouter(req, res)) return;
        if (authRouter(req, res)) return;
        if (addRouter(req, res)) return;
        if (ordersRouter(req, res)) return;


        // Thêm xử lý cho API cart
        if (req.url === '/api/cart' && req.method === 'GET') {
            await cartController.getCart(req, res);
            return;
        }
        if (req.url === '/api/checkout' && req.method === 'POST') {
    await cartController.checkout(req, res);
    return;
        }
        if (req.url.startsWith('/api/cart/remove') && req.method === 'POST') {
    await cartController.removeFromCart(req, res);
    return;
}

        // Nếu không có route phù hợp:
        res.writeHead(404);
        res.end('Không tìm thấy trang!');
    });
};



module.exports = handleRequest;