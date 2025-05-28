const DanhMuc = require('../models/DanhMuc');

async function getAllDanhMuc() {
  data = await DanhMuc.layTatCaDanhMuc();
  return data || [];
}

module.exports = { getAllDanhMuc };
