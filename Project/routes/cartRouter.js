const cartController = require('../controllers/cartController');

async function cartRouter(req, res){
    if (req.url === '/api/cart' && req.method === 'GET') {
        await cartController.getCart(req, res);
        return true;
    }
    if (req.url === '/api/checkout' && req.method === 'POST') {
        await cartController.checkout(req, res);
        return true;
    }
    if (req.url.startsWith('/api/cart/remove') && req.method === 'POST') {
        await cartController.removeFromCart(req, res);
        return true;
    }
    return false;
}

module.exports = cartRouter;