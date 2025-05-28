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
    req.on('end', () => {
      try {
        req.body = JSON.parse(body);
        productController.themDanhMuc(req, res);
      }
      catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Lỗi khi thêm danh mục', error: err.message }));
      }
    });
    return true;
  } 
  if (url === '/product/add-product' && method === 'POST') {
    productController.themSanPham(req, res);
  } 
  if (url === '/product/list-products' && method === 'GET') {
    productController.layDanhSachSanPham(req, res);

  } 
  return false;
}

module.exports = addRouter;
