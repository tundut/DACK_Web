document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById("ordersTableBody");

    fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
            if (data.message === "Chưa đăng nhập") {
                alert("Vui lòng đăng nhập để xem đơn hàng.");
                window.location.href = '/login';
                return;
            }
            
            const orders = data.orders;
            orders.forEach(order => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td><span class="badge bg-primary">#${order.id_don_hang}</span></td>
                    <td><span class="amount">${order.tong_tien.toLocaleString()}đ</span></td>
                    <td><span class="date">${order.ngay_tao}</span></td>
                    <td>
                        <button class="btn btn-details btn-primary show-details-btn" data-id="${order.id}">
                            <i class="fas fa-eye me-1"></i> Chi Tiết
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);

                const detailsRow = document.createElement("tr");
                detailsRow.classList.add("details-row");
                detailsRow.id = `details-${order.id_don_hang}`;
                detailsRow.style.display = "none";
                detailsRow.innerHTML = `
                    <td colspan="4">
                        <div class="details-card">
                            <h5 class="card-title">
                                <i class="fas fa-shopping-cart me-2"></i>
                                Chi tiết sản phẩm
                            </h5>
                            <table class="details-table align-middle text-center">
                                <thead>
                                    <tr>
                                        <th>Hình ảnh</th>
                                        <th>Sản phẩm</th>
                                        <th>Số lượng</th>
                                        <th>Đơn giá</th>
                                        <th>Tổng tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${order.chitietdonhang.map(item => `
                                        <tr>
                                            <td>
                                                <img src="${item.sanpham.hinh_anh}" 
                                                     alt="${item.sanpham.ten_san_pham}" 
                                                     class="product-image-details">
                                            </td>
                                            <td>
                                                <span class="product-name">${item.sanpham.ten_san_pham}</span>
                                            </td>
                                            <td>
                                                <span class="quantity-badge">${item.so_luong}</span>
                                            </td>
                                            <td>${(item.tong_gia_san_pham / item.so_luong).toLocaleString()}đ</td>
                                            <td class="amount">${item.tong_gia_san_pham.toLocaleString()}đ</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="4" class="text-end"><strong>Tổng cộng:</strong></td>
                                        <td class="amount">${order.tong_tien.toLocaleString()}đ</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </td>
                `;
                tableBody.appendChild(detailsRow);
            });

            tableBody.querySelectorAll(".show-details-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const detailsRow = btn.closest("tr").nextElementSibling;
                    if (!detailsRow) return;

                    if (detailsRow.style.display === "table-row") {
                        detailsRow.style.display = "none";
                        btn.innerHTML = '<i class="fas fa-eye me-1"></i> Chi Tiết';
                        btn.classList.replace("btn-danger", "btn-primary");
                    } else {
                        detailsRow.style.display = "table-row";
                        btn.innerHTML = '<i class="fas fa-times me-1"></i> Ẩn';
                        btn.classList.replace("btn-primary", "btn-danger");
                    }
                });
            });
        })
        .catch(err => console.error(err));
});

function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
}
