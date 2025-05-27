const { getAllProducts, getProductById } = require('../controllers/productController');

function productRouter(req, res) {
  if (req.method === 'GET' && req.url === '/api/products') {
    getAllProducts(req, res);
    return true;
  }
  // Route lấy chi tiết sản phẩm
  if (req.method === 'GET' && req.url.startsWith('/api/products/')) {
    const id = req.url.split('/').pop();
    getProductById(req, res, id);
    return true;
  }
  return false;
}

module.exports = productRouter; 