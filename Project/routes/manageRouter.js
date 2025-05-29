const productController = require('../controllers/productController');
const manageController = require('../controllers/manageController');

async function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
  });
}

async function manageRouter(req, res) {
  const url = req.url;
  const method = req.method;
  // === Lấy danh sách danh mục ===
  if (url === '/manage/list-categories' && method === 'GET') {
    try {
      const danhMucs = await productController.getAllDanhMuc();
      const payload = JSON.stringify(danhMucs);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(payload);
    } catch (err) {
      console.error('Lỗi khi lấy danh mục:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Lỗi lấy danh mục' }));
    }
    return true;
  }

  // === Thêm danh mục ===
  if (url === '/manage/add-category' && method === 'POST') {
    try {
      const body = await readRequestBody(req);
      const result = await manageController.themDanhMuc(body);
      const payload = JSON.stringify(result);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(payload);
    } catch (error) {
      console.error('Lỗi khi thêm danh mục:', error);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Lỗi thêm danh mục' }));
    }
    return true;
  }

  // === Thêm sản phẩm ===
  if (url === '/manage/add-product' && method === 'POST') {
    try {
      const body = await readRequestBody(req);
      const result = await manageController.themSanPham(body);
      const payload = JSON.stringify(result);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(payload);
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Lỗi thêm sản phẩm' }));
    }
    return true;
  }

  return false;
}

module.exports = manageRouter;
