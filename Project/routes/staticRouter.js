const fs = require('fs');
const path = require('path');

const staticRouter = (req, res) => {
    const url = req.url;

    if (!url.startsWith('/public/')) return false;

    const filePath = path.join(__dirname, '..', url);

    console.log("Đang phục vụ file tĩnh:", filePath);

    const ext = path.extname(filePath);
    let contentType = 'text/plain';

    switch (ext) {
        case '.css': contentType = 'text/css'; break;
        case '.js': contentType = 'text/javascript'; break;
        case '.png': contentType = 'image/png'; break;
        case '.jpg':
        case '.jpeg': contentType = 'image/jpeg'; break;
        case '.svg': contentType = 'image/svg+xml'; break;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Không tìm thấy tài nguyên!');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });

    return true;
};

module.exports = staticRouter;
