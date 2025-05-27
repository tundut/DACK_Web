const DonHang = require('../models/DonHang.js');

async function getOrders(id_khach_hang) {
  try {
    const orders = await DonHang.layDonHang(id_khach_hang);
    return orders;
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng:', error);
    throw error;
  }
}

module.exports = { getOrders };
