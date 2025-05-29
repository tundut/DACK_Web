const GioHang = require('../models/GioHang');
const ChiTietGioHang = require('../models/ChiTietGioHang');
const ThanhToan = require('../models/ThanhToan');
const DonHang = require('../models/DonHang');
const ChiTietDonHang = require('../models/ChiTietDonHang');

async function getCart(id_tai_khoan) {
    const id_khach_hang = await GioHang.layIdKhachHangTheoTaiKhoan(id_tai_khoan);
    if (!id_khach_hang) return [];
    const id_gio_hang = await GioHang.layIdGioHangTheoKhachHang(id_khach_hang);
    if (!id_gio_hang) return [];
    const chiTiet = await ChiTietGioHang.layChiTietGioHang(id_gio_hang);
    for (const item of chiTiet) {
        item.SanPham = await ChiTietGioHang.layChiTietSanPham(item.id_san_pham);
    }
    return chiTiet;
}

async function checkout(id_tai_khoan, paymentMethod) {
    const id_khach_hang = await GioHang.layIdKhachHangTheoTaiKhoan(id_tai_khoan);
    const id_gio_hang = await GioHang.layIdGioHangTheoKhachHang(id_khach_hang);
    const chiTiet = await ChiTietGioHang.layChiTietGioHang(id_gio_hang);

    if (!chiTiet.length) throw new Error('Giỏ hàng trống!');

    const id_thanh_toan = await ThanhToan.create(paymentMethod);
    
    let tong_tien = 0;
    for (const item of chiTiet) {
        const sp = await ChiTietGioHang.layChiTietSanPham(item.id_san_pham);
        tong_tien += sp.gia * item.so_luong;
    }

    const { data: dhData, error: dhErr } = await DonHang.create({
        tong_tien,
        id_thanh_toan,
        id_khach_hang
    });
    if (dhErr) throw new Error(dhErr.message);
    const id_don_hang = dhData.id_don_hang;

    for (const item of chiTiet) {
        const sp = await ChiTietGioHang.layChiTietSanPham(item.id_san_pham);
        const tong_gia_san_pham = sp.gia * item.so_luong;
        await ChiTietDonHang.create({
            id_don_hang,
            id_san_pham: item.id_san_pham,
            so_luong: item.so_luong,
            tong_gia_san_pham
        });
    }

    await ChiTietGioHang.clearCart(id_gio_hang);
    return { success: true };
}

async function removeFromCart(id_tai_khoan, id_san_pham) {
    const id_khach_hang = await GioHang.layIdKhachHangTheoTaiKhoan(id_tai_khoan);
    const id_gio_hang = await GioHang.layIdGioHangTheoKhachHang(id_khach_hang);
    await ChiTietGioHang.removeItem(id_gio_hang, id_san_pham);
    return { success: true };
}

async function addToCart(id_tai_khoan, id_san_pham, so_luong = 1) {
    const id_khach_hang = await GioHang.layIdKhachHangTheoTaiKhoan(id_tai_khoan);
    const id_gio_hang = await GioHang.layIdGioHangTheoKhachHang(id_khach_hang);
    const sp = await ChiTietGioHang.layChiTietSanPham(id_san_pham);
    if (!sp) throw new Error('Không tìm thấy sản phẩm');
    // Kiểm tra đã có sản phẩm trong giỏ chưa
    const items = await ChiTietGioHang.layChiTietGioHang(id_gio_hang);
    const existed = items.find(i => i.id_san_pham == id_san_pham);
    if (existed) {
        // Nếu đã có thì tăng số lượng
        await ChiTietGioHang.updateQuantity(id_gio_hang, id_san_pham, existed.so_luong + so_luong);
    } else {
        // Nếu chưa có thì thêm mới
        await ChiTietGioHang.addItem(id_gio_hang, id_san_pham, so_luong, sp.gia * so_luong);
    }
    return { success: true };
}

async function updateQuantity(id_tai_khoan, id_san_pham, so_luong) {
    const id_khach_hang = await GioHang.layIdKhachHangTheoTaiKhoan(id_tai_khoan);
    const id_gio_hang = await GioHang.layIdGioHangTheoKhachHang(id_khach_hang);
    if (so_luong <= 0) {
        await ChiTietGioHang.removeItem(id_gio_hang, id_san_pham);
    } else {
        await ChiTietGioHang.updateQuantity(id_gio_hang, id_san_pham, so_luong);
    }
    return { success: true };
}

module.exports = { getCart, checkout, removeFromCart, addToCart, updateQuantity };
