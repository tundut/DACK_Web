const { supabase } = require('../config/supabaseClient');

class GioHang {
    constructor(id_gio_hang, tong_gia) {
        this.id_gio_hang = id_gio_hang;
        this.tong_gia_gio_hang = tong_gia_gio_hang;
    }
    
    static async layIdKhachHangTheoTaiKhoan(id_tai_khoan) {
    const { data, error } = await supabase
        .from('khachhang') 
        .select('id_khach_hang')
        .eq('id_khach_hang', id_tai_khoan)
        .single();
    if (error) throw new Error(error.message);
    return data ? data.id_khach_hang : null;
}
    // Trong model GioHang.js
static async layIdGioHangTheoKhachHang(id_khach_hang) {
    const { data, error } = await supabase
        .from('khachhang') // Đúng bảng giỏ hàng
        .select('id_gio_hang')
        .eq('id_khach_hang', id_khach_hang)
        .single();
    if (error) throw new Error(error.message);
    return data ? data.id_gio_hang : null;
}

    // Lấy thông tin giỏ hàng theo id_gio_hang
    static async layGioHangTheoId(id_gio_hang) {
        const { data, error } = await supabase
            .from('giohang')
            .select('*')
            .eq('id_gio_hang', id_gio_hang)
            .single();
        if (error) throw new Error(error.message);
        return data;
    }
    static async themGioHang() {
        const { data, error } = await supabase
            .from('giohang')
            .insert({ tong_gia_gio_hang: 0 })
            .select();
        if (error) {
            throw new Error(error.message);
        }
        return data[0];
    }
     
    
}


module.exports = GioHang;
