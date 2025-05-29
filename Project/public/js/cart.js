document.addEventListener('DOMContentLoaded', renderCart);

async function renderCart() {
  const tbody = document.querySelector('.cart-table tbody');
  tbody.innerHTML = '<tr><td colspan="6">Đang tải...</td></tr>';
  try {
    const res = await fetch('/api/cart');
    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">Giỏ hàng trống</td></tr>';
      document.querySelectorAll('.cart-totals-value').forEach(el => el.textContent = '$0.00');
      return;
    }
    tbody.innerHTML = '';
    let total = 0;
    items.forEach(item => {
      const sp = item.SanPham || {};
      const price = sp.gia || 0;
      const subtotal = price * item.so_luong;
      total += subtotal;
      tbody.innerHTML += `
        <tr>
          <td><span class="remove-btn" data-id="${item.id_san_pham}">&times;</span></td>
          <td><img src="${sp.hinh_anh || '#'}" alt="${sp.ten_san_pham || ''}" class="img-fluid cart-image"></td>
          <td>${sp.ten_san_pham || ''}</td>
          <td>$${price.toFixed(2)}</td>
          <td>
          <input type="number" min="1" value="${item.so_luong}" class="form-control text-center quantity-input" style="width: 70px; margin: auto;" data-id="${item.id_san_pham}">
          </td>
          <td>$${subtotal.toFixed(2)}</td>
        </tr>
      `;
    });
    document.querySelectorAll('.cart-totals-value').forEach(el => el.textContent = `$${total.toFixed(2)}`);

    // Gắn lại sự kiện xóa sau khi render
    tbody.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', async function() {
        if (!confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) return;
        const id_san_pham = this.getAttribute('data-id');
        const res = await fetch('/api/cart/remove', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_san_pham })
        });
        const data = await res.json();
        if (data.success) {
          alert('Đã xóa sản phẩm khỏi giỏ hàng!');
          renderCart(); // Gọi lại renderCart thay vì reload trang
        } else {
          alert(data.message || 'Xóa không thành công!');
        }
      });
    });

    // Gắn sự kiện thay đổi số lượng
    tbody.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', async function() {
        let so_luong = parseInt(this.value);
        if (isNaN(so_luong) || so_luong < 1) {
          so_luong = 1;
          this.value = 1;
        }
        const id_san_pham = this.getAttribute('data-id');
        const res = await fetch('/api/cart/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_san_pham, so_luong })
        });
        const data = await res.json();
        if (data.success) {
          renderCart();
        } else {
          alert(data.message || 'Cập nhật số lượng thất bại!');
        }
      });
    });
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="6">Lỗi tải dữ liệu</td></tr>';
  }
}

// Checkout event (giữ nguyên)
document.querySelector('.btn-checkout').addEventListener('click', async (e) => {
  e.preventDefault();
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').id;
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentMethod })
  });
  const data = await res.json();
  if (data.success) {
    alert('Đặt hàng thành công!');
    location.reload();
  } else {
    alert(data.message || 'Có lỗi xảy ra!');
  }
});

