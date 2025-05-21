const fs = require('fs');
const path = require('path');

const renderPage = (res, page, extraReplacements = {}) => {
    const headerPath = path.join(__dirname, '..', 'views', 'header.html');
    const footerPath = path.join(__dirname, '..', 'views', 'footer.html');
    const pagePath = path.join(__dirname, '..', 'views', page);

    fs.readFile(headerPath, 'utf-8', (err, headerData) => {
        if (err) {
            res.statusCode = 500;
            res.end('Lỗi khi đọc header!');
            return;
        }

        fs.readFile(footerPath, 'utf-8', (err, footerData) => {
            if (err) {
                res.statusCode = 500;
                res.end('Lỗi khi đọc footer!');
                return;
            }

            fs.readFile(pagePath, 'utf-8', (err, pageData) => {
                if (err) {
                    res.statusCode = 500;
                    res.end(`Lỗi khi đọc ${page}!`);
                    return;
                }

                pageData = pageData.replace('{{header}}', headerData);
                pageData = pageData.replace('{{footer}}', footerData);

                // Thay thế thêm nếu có
                for (const key in extraReplacements) {
                    pageData = pageData.replace(new RegExp(`{{${key}}}`, 'g'), extraReplacements[key]);
                }

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(pageData);
            });
        });
    });
};

const pageRouter = (req, res) => {
    const url = req.url;

    if ((url === '/home' || url === '/') && req.method === 'GET') {
        renderPage(res, 'index.html');
        return true;
    }

    if (url === '/login' && req.method === 'GET') {
        renderPage(res, 'login.html');
        return true;
    }

    if (url === '/register' && req.method === 'GET') {
        renderPage(res, 'register.html');
        return true;
    }

    return false;
};

module.exports = pageRouter;
