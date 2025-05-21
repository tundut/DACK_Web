const { supabase } = require('../config/supabaseClient');

class GioHang {
    constructor(id_gio_hang, tong_gia) {
        this.id_gio_hang = id_gio_hang;
        this.tong_gia_gio_hang = tong_gia_gio_hang;
    }

    static async themGioHang() {
        const { data, error } = await supabase
            .from('giohang')
            .insert({ tong_gia_gio_hang: 0 })
            .select();
        if (error) {
            throw new Error(error.message);
        }
        return data[0];
    }
}

module.exports = GioHang;
