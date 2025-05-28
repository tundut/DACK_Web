const DanhMuc = require('../models/DanhMuc');
const SanPham = require('../models/SanPham');

// Hàm đọc body từ request
function readRequestBody(req) {
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

module.exports = {
  // === 1. Lấy danh sách danh mục ===
  async layDanhSachDanhMuc(req, res) {
    try {
      const danhMucs = await DanhMuc.layTatCaDanhMuc();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(danhMucs));
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ message: 'Lỗi lấy danh mục', error: err.message }));
    }
  },

  // === 2. Thêm danh mục ===
  async themDanhMuc(data) {
    const { ten_danh_muc } = data;
    await DanhMuc.themDanhMuc(ten_danh_muc);
    return { message: 'Thêm danh mục thành công' };
  },

  // === 3. Lấy danh sách sản phẩm ===
  async layDanhSachSanPham(req, res) {
    try {
      const sanPhams = await SanPham.layTatCaSanPham();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(sanPhams));
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ message: 'Lỗi lấy sản phẩm', error: err.message }));
    }
  },

  // === 4. Thêm sản phẩm ===
  async themSanPham(req, res) {
    try {
      const body = await readRequestBody(req);
      const { ten_san_pham, gia, mo_ta, id_danh_muc, so_luong_ton_kho, hinh_anh } = body;
      await SanPham.themSanPham(ten_san_pham, gia, mo_ta, id_danh_muc, so_luong_ton_kho, hinh_anh);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Thêm sản phẩm thành công' }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Lỗi thêm sản phẩm', error: err.message }));
    }
  }
};
