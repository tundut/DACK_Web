const productRouter = require('./productRouter');
const staticRouter = require('./staticRouter');
const { pageRouter } = require('./pageRouter');
const authRouter = require('./authRouter');
const ordersRouter = require('./ordersRouter');
const addRouter = require('./addRouter');
const productRouter = require('./productRouter');
const cartRouter = require('./cartRouter');
const session = require('../config/session');


const handleRequest = (req, res) => {
    session(req, res, async () => {
        if (staticRouter(req, res)) return;
        if (pageRouter(req, res)) return;
        if (productRouter(req, res)) return;
        if (authRouter(req, res)) return;
        if (addRouter(req, res)) return;
        if (ordersRouter(req, res)) return;
        if (cartRouter(req, res)) return;


        res.writeHead(404);
        res.end('Không tìm thấy trang!');
    });
};


module.exports = handleRequest;