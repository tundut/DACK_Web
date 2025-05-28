document.addEventListener("DOMContentLoaded", () => {
  //loadDanhMucs();

  document.getElementById("formDanhMuc").addEventListener("submit", handleAddCategory);
  document.getElementById("formSanPham").addEventListener("submit", handleAddProduct);
});

// Hiển thị các section và cập nhật sidebar active
function showSection(id) {
  document.querySelectorAll(".content-section").forEach(section => section.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  document.querySelectorAll(".sidebar a").forEach(link => link.classList.remove("active"));
  document.getElementById(`link-${id === 'danhMucSection' ? 'danhmuc' : 'sanpham'}`).classList.add("active");

  if (id === 'danhMucSection') {
    renderDanhMucs();
  } else if (id === 'sanPhamSection') {
    populateDanhMucSelect();
    renderSanPhams();
  }
}

let danhMucs = [];
let sanPhams = [];

function loadDanhMucs() {
  fetch('/product/list-categories')
    .then(res => res.json())
    .then(data => {
      danhMucs = data;
      populateDanhMucSelect();
      renderDanhMucs();
    })
    .catch(err => console.error("Lỗi khi tải danh mục:", err));
}

function populateDanhMucSelect() {
  fetch('/product/list-categories')
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("id_danh_muc");
      select.innerHTML = '<option value="">-- Chọn danh mục --</option>';
      (data || []).forEach(dm => {
        const option = document.createElement("option");
        option.value = dm.id_danh_muc;
        option.textContent = dm.ten_danh_muc;
        select.appendChild(option);
      });
    })
    .catch(err => console.error("Lỗi khi tải danh mục:", err));
}

function renderDanhMucs() {
  const tableBody = document.getElementById('danhMucTableBody');
  if (!tableBody) return;
  tableBody.innerHTML = '';
  danhMucs.forEach(dm => {
    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${dm.id_danh_muc}</td>
      <td>${dm.ten_danh_muc}</td>
      <td><button class="btn btn-sm btn-info">Sửa</button></td>
    `;
  });
}

function handleAddCategory(e) {
  e.preventDefault();
  const tenDanhMuc = document.getElementById("ten_danh_muc").value.trim();
  if (!tenDanhMuc) return alert("Vui lòng nhập tên danh mục!");

  fetch('/product/add-category', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ten_danh_muc: tenDanhMuc })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Thêm danh mục thành công!");
      e.target.reset();
      //loadDanhMucs();
    })
    .catch(err => {
      console.error(err);
      alert("Thêm danh mục thất bại!");
    });
}

function handleAddProduct(e) {
  e.preventDefault();

  const ten_san_pham = document.getElementById("ten_san_pham").value.trim();
  const mo_ta = document.getElementById("mo_ta").value.trim();
  const giaStr = document.getElementById("gia").value.trim();
  const so_luong_ton_khoStr = document.getElementById("so_luong_ton_kho").value.trim();
  const hinh_anh = document.getElementById("hinh_anh").value.trim() || "";
  const id_danh_muc_str = document.getElementById("id_danh_muc").value;

  if (!ten_san_pham || !mo_ta || !giaStr || !so_luong_ton_khoStr || !id_danh_muc_str) {
    alert("Vui lòng điền đầy đủ và đúng thông tin sản phẩm!");
    return;
  }

  const gia = Number(giaStr);
  const so_luong_ton_kho = Number(so_luong_ton_khoStr);
  const id_danh_muc = Number(id_danh_muc_str);

  if (
    isNaN(gia) || gia < 0 ||
    isNaN(so_luong_ton_kho) || so_luong_ton_kho < 0 ||
    isNaN(id_danh_muc) || id_danh_muc <= 0
  ) {
    alert("Giá, số lượng tồn và danh mục phải là số hợp lệ và lớn hơn 0!");
    return;
  }

  const product = {
    ten_san_pham,
    mo_ta,
    gia,
    so_luong_ton_kho,
    hinh_anh,
    id_danh_muc
  };

  fetch('/product/add-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) {
        alert((data && data.message ? data.message : "Thêm sản phẩm thất bại!") + (data && data.error ? "\n" + data.error : ""));
      } else {
        alert(data.message || "Thêm sản phẩm thành công!");
        e.target.reset();
        renderSanPhams();
      }
    })
    .catch(err => {
      console.error(err);
      alert("Thêm sản phẩm thất bại!");
    });
}

function renderSanPhams() {
  fetch('/product/list-products')
    .then(res => res.json())
    .then(sanPhams => {
      const tableBody = document.getElementById('sanPhamTableBody');
      if (!tableBody) return;

      tableBody.innerHTML = '';
      sanPhams.forEach(sp => {
        const row = tableBody.insertRow();
        row.innerHTML = `
          <td>${sp.id_san_pham}</td>
          <td>${sp.ten_san_pham}</td>
          <td>${sp.mo_ta}</td>
          <td>${sp.gia}</td>
          <td>${sp.so_luong_ton_kho}</td>
          <td><img src="${sp.hinh_anh}" alt="Hình ảnh" style="max-height: 50px"/></td>
          <td>${sp.id_danh_muc}</td>
          <td><button class="btn btn-sm btn-info">Sửa</button></td>
        `;
      });
    })
    .catch(err => {
      console.error("Lỗi khi tải sản phẩm:", err);
    });
}

