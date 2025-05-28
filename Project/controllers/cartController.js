const GioHang = require('../models/GioHang');
const ChiTietGioHang = require('../models/ChiTietGioHang');
const ThanhToan = require('../models/ThanhToan');
const DonHang = require('../models/DonHang');
const ChiTietDonHang = require('../models/ChiTietDonHang');


async function getCart(req, res) {
    try {
        if (!req.session.user) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Chưa đăng nhập' }));
            return;
        }
        const id_tai_khoan = req.session.user.id_tai_khoan;
        const id_khach_hang = await GioHang.layIdKhachHangTheoTaiKhoan(id_tai_khoan);
        if (!id_khach_hang) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify([]));
            return;
        }
        const id_gio_hang = await GioHang.layIdGioHangTheoKhachHang(id_khach_hang);
        if (!id_gio_hang) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify([]));
            return;
        }
        const chiTiet = await ChiTietGioHang.layChiTietGioHang(id_gio_hang);
        for (const item of chiTiet) {
            item.SanPham = await ChiTietGioHang.layChiTietSanPham(item.id_san_pham);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(chiTiet));
    } catch (e) {
        console.error('Lỗi lấy giỏ hàng:', e);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Lỗi lấy giỏ hàng', error: e.message }));
    }
}

module.exports = { getCart };
async function checkout(req, res) {
    try {
        if (!req.session.user) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Chưa đăng nhập' }));
            return;
        }
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            const { paymentMethod } = JSON.parse(body);
            const id_tai_khoan = req.session.user.id_tai_khoan;
            const id_khach_hang = await GioHang.layIdKhachHangTheoTaiKhoan(id_tai_khoan);
            const id_gio_hang = await GioHang.layIdGioHangTheoKhachHang(id_khach_hang);
            const chiTiet = await ChiTietGioHang.layChiTietGioHang(id_gio_hang);

            if (!chiTiet.length) {
                res.end(JSON.stringify({ success: false, message: 'Giỏ hàng trống!' }));
                return;
            }

            // 1. Tạo thanh toán
            const id_thanh_toan = await ThanhToan.create(paymentMethod);
            
            // 2. Tính tổng tiền
            let tong_tien = 0;
            for (const item of chiTiet) {
                const sp = await ChiTietGioHang.layChiTietSanPham(item.id_san_pham);
                tong_tien += sp.gia * item.so_luong;
            }

            // 3. Tạo đơn hàng
            const { data: dhData, error: dhErr } = await DonHang.create({
            tong_tien,
            id_thanh_toan,
            id_khach_hang
            });
            if (dhErr) throw new Error(dhErr.message);
             const id_don_hang = dhData.id_don_hang;

            // 4. Thêm chi tiết đơn hàng
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

            // 5. Xóa chitietgiohang
            await ChiTietGioHang.clearCart(id_gio_hang);

            res.end(JSON.stringify({ success: true }));
        });
    } catch (e) {
        console.error('Lỗi checkout:', e);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Lỗi checkout', error: e.message }));
    }
}

// Export đúng các hàm
module.exports = {
    getCart,
    checkout
};
async function removeFromCart(req, res) {
    try {
        if (!req.session.user) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Chưa đăng nhập' }));
            return;
        }
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            const { id_san_pham } = JSON.parse(body);
            const id_tai_khoan = req.session.user.id_tai_khoan;
            const id_khach_hang = await GioHang.layIdKhachHangTheoTaiKhoan(id_tai_khoan);
            const id_gio_hang = await GioHang.layIdGioHangTheoKhachHang(id_khach_hang);
            // Xóa sản phẩm khỏi chi tiết giỏ hàng
            await ChiTietGioHang.removeItem(id_gio_hang, id_san_pham);
            res.end(JSON.stringify({ success: true }));
        });
    } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: e.message }));
    }
}
// ...existing code...
module.exports = { getCart, checkout, removeFromCart };