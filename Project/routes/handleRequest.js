const staticRouter = require('./staticRouter');
const { pageRouter } = require('./pageRouter');
const authRouter = require('./authRouter');
const ordersRouter = require('./ordersRouter');
const manageRouter = require('./manageRouter');
const productRouter = require('./productRouter');
const cartRouter = require('./cartRouter');
const session = require('../config/session');


const handleRequest = (req, res) => {
    session(req, res, async () => {
        if (staticRouter(req, res)) return;
        if (pageRouter(req, res)) return;

        if (await authRouter(req, res)) return;
        if (await manageRouter(req, res)) return;
        if (await productRouter(req, res)) return;
        if (await cartRouter(req, res)) return;
        if (await ordersRouter(req, res)) return;
        

        res.writeHead(404);
        res.end('Không tìm thấy trang!');
    });
};


module.exports = handleRequest;