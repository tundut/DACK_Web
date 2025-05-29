const productController = require('../controllers/productController');

async function productRouter(req, res) {
    if (req.method === 'GET' && req.url === '/api/products') {
        try {
            const products = await productController.getAllProducts();
            const payload = JSON.stringify(products);
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
            });
            res.end(payload);
        } catch (err) {
            console.error('Lỗi khi lấy sản phẩm:', err);
            const payload = JSON.stringify({ message: 'Lỗi khi lấy sản phẩm' });
            res.writeHead(500, {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
            });
            res.end(payload);
        }
        return true;
    }

    if (req.method === 'GET' && req.url === '/api/products/featured') {
        try {
            const featuredProducts = await productController.getAllProducts();
            const payload = JSON.stringify(featuredProducts);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(payload);
        } catch (err) {
            console.error('Lỗi khi lấy sản phẩm nổi bật:', err);
            const payload = JSON.stringify({ message: 'Lỗi khi lấy sản phẩm nổi bật' });
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(payload);
        }
        return true;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/products/')) {
        const id = req.url.split('/').pop();
        try {
            const product = await productController.getProductById(id);
            const payload = JSON.stringify(product);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(payload);
        } catch (err) {
            console.error('Lỗi khi lấy chi tiết sản phẩm:', err);
            const payload = JSON.stringify({ message: 'Không tìm thấy sản phẩm' });
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(payload);
        }
        return true;
    }

    if (req.url === '/api/danhmuc' && req.method === 'GET') {
        try {
        const danhMucList = await productController.getAllDanhMuc();
        const payload = JSON.stringify(danhMucList);
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
        });
        res.end(payload);
        } catch (err) {
        console.error('[DanhMucRouter] Lỗi khi lấy danh mục:', err);
        const errorPayload = JSON.stringify({ message: 'Lỗi khi lấy danh mục' });
        res.writeHead(500, {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(errorPayload),
        });
        res.end(errorPayload);
        }
        return true;
    } 

    return false;
}

module.exports = productRouter;
