const { supabase } = require('../config/supabaseClient');
const NguoiDung = require('./NguoiDung');
const GioHang = require('./GioHang');

class KhachHang extends NguoiDung {
    constructor(id_khach_hang, ho_ten, so_dien_thoai, vai_tro, id_tai_khoan, ngay_dang_ky, diem_tich_luy, id_gio_hang) {
        super(id_khach_hang, ho_ten, so_dien_thoai, vai_tro, id_tai_khoan);
        this.ngay_dang_ky = ngay_dang_ky;
        this.diem_tich_luy = diem_tich_luy;
        this.id_gio_hang = id_gio_hang;
    }

    static async themKhachHang(ho_ten, so_dien_thoai, vai_tro, id_tai_khoan) {
        const nguoiDung = await NguoiDung.themNguoiDung(ho_ten, so_dien_thoai, vai_tro, id_tai_khoan);
        const gioHang = await GioHang.themGioHang();

        const { data, error } = await supabase
            .from('khachhang')
            .insert({
                id_khach_hang: nguoiDung.id_nguoi_dung,
                ngay_dang_ky: new Date(),
                diem_tich_luy: 0,
                id_gio_hang: gioHang.id_gio_hang
            })
            .select();
        if (error) {
            throw new Error(error.message);
        }
        return {
            nguoiDung,
            khachHang: data[0]
        };
    }
}

module.exports = KhachHang;