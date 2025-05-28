const TaiKhoan = require('../models/TaiKhoan');
const KhachHang = require('../models/KhachHang');
const NguoiDung = require('../models/NguoiDung');
const { VaiTro } = require('../utils/constants');

async function register(data) {
  const { ho_ten, so_dien_thoai, email, ten_dang_nhap, mat_khau } = data;
  const taiKhoan = await TaiKhoan.register(email, ten_dang_nhap, mat_khau);
  const khachHang = await KhachHang.themKhachHang(ho_ten, so_dien_thoai, VaiTro.KHACH_HANG, taiKhoan.id_tai_khoan);
  return { message: 'Đăng kí thành công' };
}

async function login(data, session) {
  const { ten_dang_nhap, mat_khau } = data;

  const account = await TaiKhoan.login(ten_dang_nhap, mat_khau);

  if (account) {
    const user = await NguoiDung.layNguoiDung(account.id_tai_khoan);
    session.user = user;
    session.account = account;

    if (user.vai_tro === VaiTro.NHAN_VIEN) {
      return { redirect: '/admin' };
    }
    return { redirect: '/home' };
  } else {
    const error = new Error('Tên đăng nhập hoặc mật khẩu sai');
    error.statusCode = 401;
    throw error;
  }
}

async function logout(session) {
  await session.reset();
  return { redirect: '/home' };
}

module.exports = { register, login, logout };
