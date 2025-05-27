const { supabase } = require('../config/supabaseClient');

class NguoiDung {
    constructor(id_nguoi_dung, ho_ten, so_dien_thoai, vai_tro, id_tai_khoan) {
        this.id_nguoi_dung = id_nguoi_dung;
        this.ho_ten = ho_ten;
        this.so_dien_thoai = so_dien_thoai;
        this.vai_tro = vai_tro;
        this.id_tai_khoan = id_tai_khoan;
    }

    static async themNguoiDung(ho_ten, so_dien_thoai, vai_tro, id_tai_khoan) {
        const { data, error } = await supabase
            .from('nguoidung')
            .insert({ ho_ten, so_dien_thoai, vai_tro, id_tai_khoan })
            .select();
        if (error) {
            throw new Error(error.message);
        }
        return data[0];
    }

    static async layNguoiDung(id_tai_khoan) {
        const { data, error } = await supabase
            .from('nguoidung')
            .select('*')
            .eq('id_tai_khoan', id_tai_khoan);
        if (error) {
            throw new Error(error.message);
        }
        return data[0];
    }
}

module.exports = NguoiDung;