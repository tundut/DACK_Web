const bcrypt = require('bcrypt');
const { supabase } = require('../config/supabaseClient');

class TaiKhoan {
    constructor(id_tai_khoan, ten_dang_nhap, email, mat_khau, trang_thai_hoat_dong = true) {
        this.id_tai_khoan = id_tai_khoan;
        this.email = email;
        this.ten_dang_nhap = ten_dang_nhap;
        this.mat_khau = mat_khau;
        this.trang_thai_hoat_dong = trang_thai_hoat_dong;
    }

    static async register(email, ten_dang_nhap, mat_khau){
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(mat_khau, saltRounds);


        const { data, error } = await supabase
            .from('taikhoan')
            .insert({email, ten_dang_nhap, mat_khau: hashedPassword, trang_thai_hoat_dong: true })
            .select();
        if (error) {
            throw new Error(error.message);
        }
        return data[0];
    }

    static async login(ten_dang_nhap, mat_khau) {
        const { data, error } = await supabase
            .from('taikhoan')
            .select('*')
            .eq('ten_dang_nhap', ten_dang_nhap);
        if (error) {
            throw new Error(error.message);
        }

        if (!data || data.length === 0) return null;

        const user = data[0];

        const match = await bcrypt.compare(mat_khau, user.mat_khau);
        if (!match) return null;

        return user;
    }
}

module.exports = TaiKhoan;