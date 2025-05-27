const staticRouter = require('./staticRouter');
const { pageRouter } = require('./pageRouter');
const authRouter = require('./authRouter');
const session = require('../config/session');

const handleRequest = (req, res) => {
    session(req, res, () => {
        if (staticRouter(req, res)) return;
        if (productRouter(req, res)) return;
        if (authRouter(req, res)) return;
        if (pageRouter(req, res)) return;
        if (authRouter(req, res)) return;

        res.writeHead(404);
        res.end('Không tìm thấy trang!');
    });
};

module.exports = handleRequest;
