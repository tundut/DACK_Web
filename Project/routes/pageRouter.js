const fs = require('fs');
const path = require('path');
const { VaiTro } = require('../utils/constants');

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
    const ten_dang_nhap = req.session.account
        ? `<div class="dropdown">
                <a href="#" class="dropdown-toggle text-dark text-decoration-none fw-bold" data-bs-toggle="dropdown" aria-expanded="false">${req.session.account.ten_dang_nhap}</a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Profile</a></li>
                    <li><a class="dropdown-item" href="/logout">Logout</a></li>
                </ul>
            </div>`
        : `<a href="/login" class="ms-2 text-decoration-none text-dark fw-bold">Login</a>`;

        

    if ((url === '/home' || url === '/') && req.method === 'GET') {
        renderPage(res, 'index.html', { ten_dang_nhap: ten_dang_nhap });
        return true;
    }

    if (url === '/login' && req.method === 'GET') {
        renderPage(res, 'login.html', { ten_dang_nhap: ten_dang_nhap });
        return true;
    }

    if (url === '/register' && req.method === 'GET') {
        renderPage(res, 'register.html', { ten_dang_nhap: ten_dang_nhap });
        return true;
    }
    if (url === '/cart' && req.method === 'GET') {
        // Nếu là nhân viên thì không làm gì (không render, không alert, không chuyển trang)
        if (req.session.user && req.session.user.vai_tro === VaiTro.NHAN_VIEN) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
            res.end(`<script>alert('Nhân viên không có quyền truy cập giỏ hàng!');window.location.href='/home';</script>`);
            return true;
        }
        renderPage(res, 'cart.html', { ten_dang_nhap: ten_dang_nhap });
        return true;
    }
    
    if (url === '/product' && req.method === 'GET') {
        renderPage(res, 'product.html', { ten_dang_nhap: ten_dang_nhap });
        return true;
    }

    if (url.startsWith('/product/') && req.method === 'GET') {
        renderPage(res, 'productDetail.html', { ten_dang_nhap: ten_dang_nhap });
        return true;
    }

    if (url === '/orders' && req.method === 'GET') {
        // Nếu là nhân viên thì không làm gì (không render, không alert, không chuyển trang)
        if (req.session.user && req.session.user.vai_tro === VaiTro.NHAN_VIEN) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
            res.end(`<script>alert('Nhân viên không có quyền truy cập đơn hàng!');window.location.href='/home';</script>`);
            return true;
        }
        renderPage(res, 'orders.html', { ten_dang_nhap: ten_dang_nhap });
        return true;
    }

    if ((url === '/admin') && req.method === 'GET') {
        // Phân quyền: chỉ cho phép nhân viên truy cập trang admin
        if (!req.session.user || req.session.user.vai_tro !== VaiTro.NHAN_VIEN) {
            // Nếu là khách hàng thì báo alert và chuyển về home
            res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
            res.end(`<script>alert('Bạn không có quyền truy cập trang này!');window.location.href='/home';</script>`);
            return true;
        }
        renderPage(res, 'manage.html', { ten_dang_nhap: ten_dang_nhap });
        return true;
    }
    return false;
    
};

module.exports = { renderPage, pageRouter };
