const { supabase } = require('../config/supabaseClient');

class ChiTietDonHang {
    constructor(id_don_hang, id_san_pham, so_luong, tong_gia_san_pham) {
        this.id_don_hang = id_don_hang;
        this.id_san_pham = id_san_pham;
        this.so_luong = so_luong;
        this.tong_gia_san_pham = tong_gia_san_pham;
    }

    static async themChiTietDonHang(id_don_hang, danh_sach_san_pham) {
        const dataToInsert = danh_sach_san_pham.map(item => ({
            id_don_hang: id_don_hang,
            id_san_pham: item.id_san_pham,
            so_luong: item.so_luong,
            tong_gia_san_pham: item.so_luong * item.gia_san_pham
        }));

        const { data, error } = await supabase
            .from('chi_tiet_don_hang')
            .insert(dataToInsert);

        if (error) {
            throw new Error(`Lỗi khi thêm chi tiết đơn hàng: ${error.message}`);
        }

        return data;
    }
    static async create({ id_don_hang, id_san_pham, so_luong, tong_gia_san_pham }) {
    return await supabase
        .from('chitietdonhang')
        .insert({ id_don_hang, id_san_pham, so_luong, tong_gia_san_pham });
}

}

module.exports = ChiTietDonHang;
