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
}

module.exports = DanhMuc;
