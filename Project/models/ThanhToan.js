const { supabase } = require('../config/supabaseClient');
class ThanhToan {
    constructor(id_thanh_toan, phuong_thuc, trang_thai) {
        this.id_thanh_toan = id_thanh_toan;
        this.phuong_thuc = phuong_thuc;
        this.trang_thai = trang_thai;
    }
    static async create(phuong_thuc) {
        const { data, error } = await supabase
            .from('thanhtoan')
            .insert({ phuong_thuc_thanh_toan: phuong_thuc })
            .select('*');
        if (error) throw new Error(error.message);
        const record = Array.isArray(data) ? data[0] : data;
        return record?.id_thanh_toan;
    }
}
module.exports = ThanhToan;
