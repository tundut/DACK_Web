const DanhMuc = require('../models/DanhMuc');
const SanPham = require('../models/SanPham');

module.exports = {
  // === 1. Thêm danh mục ===
  async themDanhMuc(data) {
    const { ten_danh_muc } = data;
    await DanhMuc.themDanhMuc(ten_danh_muc);
    return { message: 'Thêm danh mục thành công' };
  },

  // === 2. Thêm sản phẩm ===
  async themSanPham(data) {
    const { ten_san_pham, gia, mo_ta, id_danh_muc, so_luong_ton_kho, hinh_anh } = data;
    await SanPham.themSanPham(ten_san_pham, gia, mo_ta, id_danh_muc, so_luong_ton_kho, hinh_anh);
    return { message: 'Thêm sản phẩm thành công' };
  }
};
