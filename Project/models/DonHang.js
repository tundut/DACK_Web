const { supabase } = require('../config/supabaseClient');
class DonHang {
    constructor(id_don_hang, tong_tien, trang_thai, id_khach_hang, id_thanh_toan) {
        this.id_don_hang = id_don_hang;
        this.tong_tien = tong_tien;
        this.id_khach_hang = id_khach_hang;
        this.id_thanh_toan = id_thanh_toan;
    }

    static async layDonHang(id_khach_hang) {
        const { data, error } = await supabase
            .from('donhang')
            .select(`
                *,
                chitietdonhang (
                    *,
                    sanpham (
                        ten_san_pham,
                        gia,
                        hinh_anh
                    )
                )
            `)
            .eq('id_khach_hang', id_khach_hang);
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }

    static async themDonHang(tong_tien, id_khach_hang, id_thanh_toan) {
        const { data, error } = await supabase
            .from('donhang')
            .insert({
                tong_tien: tong_tien,
                id_khach_hang: id_khach_hang,
                id_thanh_toan: id_thanh_toan
            })
            .select();
        if (error) {
            throw new Error(error.message);
        }
        return data[0];
    }
}

module.exports = DonHang;
