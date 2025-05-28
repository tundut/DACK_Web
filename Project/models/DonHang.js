const { supabase } = require('../config/supabaseClient');
class DonHang {
    constructor(id_don_hang, tong_tien, trang_thai, id_khach_hang, id_thanh_toan) {
        this.id_don_hang = id_don_hang;
        this.tong_tien = tong_tien;
        this.trang_thai = trang_thai;
        this.id_khach_hang = id_khach_hang;
        this.id_thanh_toan = id_thanh_toan;
    }
    static async create({ tong_tien, id_thanh_toan, id_khach_hang }) {
    return await supabase
        .from('donhang')
        .insert({ tong_tien, id_thanh_toan, id_khach_hang })        
        .select('*')
        .single();
}
}

module.exports = DonHang;
