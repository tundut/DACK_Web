const { supabase } = require('../config/supabaseClient');

async function getAllProducts(req, res) {
  try {
    const { data, error } = await supabase
      .from('sanpham')
      .select('id_san_pham, ten_san_pham, mo_ta, gia, so_luong_ton_kho, hinh_anh, id_danh_muc, danhmuc(ten_danh_muc)');
    if (error) throw new Error(error.message);
    // Đổi tên trường cho phù hợp với product.js
    const products = (data || []).map((sp) => ({
      id: sp.id_san_pham,
      title: sp.ten_san_pham,
      description: sp.mo_ta,
      price: sp.gia,
      stock: sp.so_luong_ton_kho,
      image: sp.hinh_anh,
      id_danh_muc: sp.id_danh_muc,
      ten_danh_muc: sp.danhmuc ? sp.danhmuc.ten_danh_muc : '',
    }));
    const payload = JSON.stringify(products);
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    });
    res.end(payload);
  } catch (err) {
    console.error('Lỗi chi tiết khi lấy sản phẩm:', err);
    const payload = JSON.stringify({ message: 'Lỗi khi lấy sản phẩm' });
    res.writeHead(500, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    });
    res.end(payload);
  }
}

// Hàm lấy chi tiết sản phẩm theo id
async function getProductById(req, res, id) {
  try {
    const { data, error } = await supabase
      .from('sanpham')
      .select('*')
      .eq('id_san_pham', id)
      .single();
    if (error || !data) throw new Error('Không tìm thấy sản phẩm');
    // Định dạng lại dữ liệu trả về cho productDetail.js
    const product = {
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
    const payload = JSON.stringify(product);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(payload);
  } catch (err) {
    console.error('Lỗi khi lấy chi tiết sản phẩm:', err);
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Không tìm thấy sản phẩm' }));
  }
}

module.exports = { getAllProducts, getProductById }; 