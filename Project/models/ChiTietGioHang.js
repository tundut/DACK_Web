const { supabase } = require('../config/supabaseClient');

class ChiTietGioHang {
    constructor(id_gio_hang, id_san_pham, so_luong, tong_gia_san_pham) {
        this.id_gio_hang = id_gio_hang;
        this.id_san_pham = id_san_pham;
        this.so_luong = so_luong;
        this.tong_gia_san_pham = tong_gia_san_pham;
    }
    static async layChiTietGioHang(id_gio_hang) {
        const { data, error } = await supabase
            .from('chitietgiohang')
            .select('*')
            .eq('id_gio_hang', id_gio_hang);
        if (error) throw new Error(error.message);
        return data;
    }
    static async layChiTietSanPham(id_san_pham) {
        const { data, error } = await supabase
            .from('sanpham')
            .select('*')
            .eq('id_san_pham', id_san_pham)
            .single();
        if (error) throw new Error(error.message);
        return data;
    }
    static async clearCart(id_gio_hang) {
        return await supabase
            .from('chitietgiohang')
            .delete()
            .eq('id_gio_hang', id_gio_hang);
    }
    static async removeItem(id_gio_hang, id_san_pham) {
    return await supabase
        .from('chitietgiohang')
        .delete()
        .eq('id_gio_hang', id_gio_hang)
        .eq('id_san_pham', id_san_pham);
}
static async addItem(id_gio_hang, id_san_pham, so_luong, tong_gia_san_pham) {
    return await supabase
        .from('chitietgiohang')
        .insert({ id_gio_hang, id_san_pham, so_luong, tong_gia_san_pham });
}

static async updateQuantity(id_gio_hang, id_san_pham, so_luong) {
    return await supabase
        .from('chitietgiohang')
        .update({ so_luong })
        .eq('id_gio_hang', id_gio_hang)
        .eq('id_san_pham', id_san_pham);
}
    
}

module.exports = ChiTietGioHang;
