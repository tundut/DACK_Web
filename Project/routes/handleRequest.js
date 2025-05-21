const staticRouter = require('./staticRouter');
const pageRouter = require('./pageRouter');
const authRouter = require('./authRouter');

const handleRequest = (req, res) => {
    if (staticRouter(req, res)) return;
    if (pageRouter(req, res)) return;
    if (authRouter(req, res)) return;

    // Nếu không có route phù hợp:
    res.writeHead(404);
    res.end('Không tìm thấy trang!');
};

module.exports = handleRequest;
