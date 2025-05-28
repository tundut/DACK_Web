const { supabase } = require('../config/supabaseClient');

class ChiTietDonHang {
    constructor(id_don_hang, id_san_pham, so_luong, tong_gia_san_pham) {
        this.id_don_hang = id_don_hang;
        this.id_san_pham = id_san_pham;
        this.so_luong = so_luong;
        this.tong_gia_san_pham = tong_gia_san_pham;
    }
    static async create({ id_don_hang, id_san_pham, so_luong, tong_gia_san_pham }) {
    return await supabase
        .from('chitietdonhang')
        .insert({ id_don_hang, id_san_pham, so_luong, tong_gia_san_pham });
}
}

module.exports = ChiTietDonHang;
