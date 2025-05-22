const TaiKhoan = require('../models/TaiKhoan');
const KhachHang = require('../models/KhachHang');
const { VaiTro } = require('../utils/constants');
const session = require('../config/session');

async function register(req, res) {
  try {
    const { ho_ten, so_dien_thoai, email, ten_dang_nhap, mat_khau } = req.body;
    const taiKhoan = await TaiKhoan.register(email, ten_dang_nhap, mat_khau);
    const khachHang = await KhachHang.themKhachHang(ho_ten, so_dien_thoai, VaiTro.KHACH_HANG, taiKhoan.id_tai_khoan); 
    

    const payload = JSON.stringify({ message: 'Đăng kí thành công' });
    res.writeHead(201, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    });
    res.end(payload);
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    const payload = JSON.stringify({ message: 'Lỗi khi đăng ký' });
    res.writeHead(500, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    });
    res.end(payload);
  }
}

async function login(req, res) {
  try {
    const { ten_dang_nhap, mat_khau } = req.body;

    const user = await TaiKhoan.login(ten_dang_nhap, mat_khau);

    if (user) {
      const redirect = JSON.stringify({ redirect: '/home' });
      req.session.user = user
      res.writeHead(200, {
        'Content-Type': 'application/json',
      });
      res.end(redirect);
    } else {
      const payload = JSON.stringify({ message: 'Tên đăng nhập hoặc mật khẩu sai' });
      res.writeHead(401, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      });
      res.end(payload);
    }
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    const payload = JSON.stringify({ message: 'Lỗi khi đăng nhập' });
    res.writeHead(500, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    });
    res.end(payload);
  }
}

async function logout(req, res) {
  try {
    req.session.reset(); // Xoá session

    res.writeHead(302, { Location: '/home' });
    res.end();
  } catch (error) {
    console.error('Lỗi khi đăng xuất:', error);
    const payload = JSON.stringify({ message: 'Lỗi khi đăng xuất' });
    res.writeHead(500, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    });
    res.end(payload);
  }
}

module.exports = { register, login, logout };
