const { supabase } = require('../config/supabaseClient');

async function getAllDanhMuc(req, res) {
  try {
    const { data, error } = await supabase
      .from('danhmuc')
      .select('id_danh_muc, ten_danh_muc');
    if (error) throw error;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data || []));
  } catch (err) {
    console.error('[DanhMucController] Lỗi khi lấy danh mục:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Lỗi khi lấy danh mục' }));
  }
}

module.exports = { getAllDanhMuc }; 