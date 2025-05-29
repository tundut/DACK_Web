const SanPham = require('../models/SanPham');
const DanhMuc = require('../models/DanhMuc');

async function getAllProducts() {
    const data = await SanPham.layTatCaSanPham();
    if (!data) throw new Error('Không tìm thấy sản phẩm');
    return (data || []).map((sp) => ({
        id: sp.id_san_pham,
        title: sp.ten_san_pham,
        description: sp.mo_ta,
        price: sp.gia,
        stock: sp.so_luong_ton_kho,
        image: sp.hinh_anh,
        id_danh_muc: sp.id_danh_muc,
        ten_danh_muc: sp.danhmuc ? sp.danhmuc.ten_danh_muc : '',
    }));
}

async function getProductById(id) {
    data = await SanPham.laySanPhamTheoId(id);
    return {
        id: data.id_san_pham,
        title: data.ten_san_pham,
        price: data.gia,
        description: data.mo_ta,
        sizeOptions: data.size_options || [],
        colorOptions: data.color_options || [],
        colorName: data.color_name || '',
        colorCode: data.color_code || '',
        images: data.images || (data.hinh_anh ? [data.hinh_anh] : []),
        mainImage: data.hinh_anh || ''
    };
}

async function getAllDanhMuc() {
  data = await DanhMuc.layTatCaDanhMuc();
  return data || [];
}

module.exports = { getAllProducts, getProductById, getAllDanhMuc };
