class SanPham {
    constructor(id_san_pham, ten_san_pham, mo_ta, gia, so_luong_ton, hinh_anh, id_danh_muc) {
        this.id_san_pham = id_san_pham;
        this.ten_san_pham = ten_san_pham;
        this.mo_ta = mo_ta;
        this.gia = gia;
        this.so_luong_ton = so_luong_ton;
        this.hinh_anh = hinh_anh;
        this.id_danh_muc = id_danh_muc;
    }
}

module.exports = SanPham;
