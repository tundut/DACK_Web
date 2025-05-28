// === addRouter.js ===
const productController = require('../controllers/productController');

function addRouter(req, res) {
  const url = req.url;
  const method = req.method;

  // === Danh mục ===
  if (url === '/product/list-categories' && method === 'GET') {
    productController.layDanhSachDanhMuc(req, res);

  } 
  
  if (url === '/product/add-category' && method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        req.body = JSON.parse(body);
        const result = await productController.themDanhMuc(req.body);
        const payload = JSON.stringify(result);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(payload);
      }
      catch (error) {
        console.error('Lỗi khi thêm danh mục:', error);
        const payload = JSON.stringify({ message: 'Lỗi khi thêm danh mục' });
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(payload);
      }
    });
    return true;
  } 
  
  if (url === '/product/add-product' && method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        req.body = JSON.parse(body);
        const result = await productController.themSanPham(req.body);
        const payload = JSON.stringify(result);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(payload);
      }
      catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        const payload = JSON.stringify({ message: 'Lỗi thêm sản phẩm', error: error.message });
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(payload);
      }
    });
    return true;
  } 

  if (url === '/product/list-products' && method === 'GET') {
    productController.layDanhSachSanPham(req, res);

  }

  return false;
}

module.exports = addRouter;
