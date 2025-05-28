const { supabase } = require('../config/supabaseClient');

class SanPham {
    constructor(id_san_pham, ten_san_pham, mo_ta, gia, so_luong_ton_kho, hinh_anh, id_danh_muc) {
        this.id_san_pham = id_san_pham;
        this.ten_san_pham = ten_san_pham;
        this.mo_ta = mo_ta;
        this.gia = gia;
        this.so_luong_ton_kho = so_luong_ton_kho;
        this.hinh_anh = hinh_anh;
        this.id_danh_muc = id_danh_muc;
    }
  
    static async getAll() {
        const { data, error } = await supabase
            .from('sanpham')
            .select('*, danhmuc(ten_danh_muc)');
        if (error) throw new Error(error.message);
        return (data || []).map(sp => ({
            ...new SanPham(
                sp.id_san_pham,
                sp.ten_san_pham,
                sp.mo_ta,
                sp.gia,
                sp.so_luong_ton_kho,
                sp.hinh_anh,
                sp.id_danh_muc
            ),
            ten_danh_muc: sp.danhmuc ? sp.danhmuc.ten_danh_muc : ''
        }));
    }
      
    static async themSanPham(ten_san_pham, gia, mo_ta, id_danh_muc, so_luong_ton_kho = 0, hinh_anh = '') {
        const { error } = await supabase.from('sanpham').insert([{
            ten_san_pham,
            gia,
            mo_ta,
            id_danh_muc,
            so_luong_ton_kho,
            hinh_anh
        }]);
        if (error) throw new Error(error.message);
    }

    static async layTatCaSanPham() {
        const { data, error } = await supabase
            .from('sanpham')
            .select('*, danhmuc(ten_danh_muc)');
        if (error) {
            console.error('Lỗi Supabase:', error);
            return [];
        }
        return data || [];
    }

    static async laySanPhamTheoId(id) {
        const { data, error } = await supabase
            .from('sanpham')
            .select('*')
            .eq('id_san_pham', id)
            .single();
        if (error) throw new Error(error.message);
        return data;
    }
}

module.exports = SanPham;
