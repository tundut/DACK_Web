const { supabase } = require('../config/supabaseClient');
class DanhMuc {
    constructor(id_danh_muc, ten_danh_muc) {
        this.id_danh_muc = id_danh_muc;
        this.ten_danh_muc = ten_danh_muc;
    }
  
    static fromObject(obj) {
        return new DanhMuc(obj.id_danh_muc, obj.ten_danh_muc);
    }

    static fromArray(arr) {
        return (arr || []).map(DanhMuc.fromObject);
    }

    static async themDanhMuc(ten_danh_muc) {
        const { data, error } = await supabase.from('danhmuc').insert([{ ten_danh_muc }]);
        if (error) throw new Error(error.message);
        return data;
    }

    static async layTatCaDanhMuc() {
        const { data, error } = await supabase.from('danhmuc').select('*');
        if (error) {
            console.error('Lỗi Supabase:', error);
            return [];
        }
        return data || [];
    }
}
module.exports = DanhMuc;
