const NguoiDung = require('./NguoiDung');

class NhanVien extends NguoiDung {
    constructor(id_nhan_vien, ho_ten, so_dien_thoai, dia_chi, vai_tro, id_tai_khoan) {
        super(id_nhan_vien, ho_ten, so_dien_thoai, dia_chi, vai_tro, id_tai_khoan);
    }
}

module.exports = NhanVien;
