document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById("ordersTableBody");

    fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
            const orders = data.orders;
            orders.forEach(order => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${order.id_don_hang}</td>
                    <td>${order.tong_tien.toLocaleString()}đ</td>
                    <td>${order.ngay_tao}</td>
                    <td>
                        <button class="btn btn-sm btn-primary show-details-btn" data-id="${order.id}">
                            Chi Tiết
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
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Chi tiết sản phẩm</h5>
                                <ul class="list-group list-group-flush">
                                    ${order.chitietdonhang.map(item => `
                                        <li class="list-group-item">
                                            ${item.sanpham.ten_san_pham} - SL: ${item.so_luong} - Tổng: ${item.tong_gia_san_pham.toLocaleString()}đ
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    </td>
                `;
                tableBody.appendChild(detailsRow);
            });

            tableBody.querySelectorAll(".show-details-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const detailsRow = btn.closest("tr").nextElementSibling;
                    if (!detailsRow) return; // Không tìm thấy thì bỏ qua

                    if (detailsRow.style.display === "table-row") {
                        detailsRow.style.display = "none";
                        btn.textContent = "Chi Tiết";
                        btn.classList.replace("btn-danger", "btn-primary");
                    } else {
                        detailsRow.style.display = "table-row";
                        btn.textContent = "Ẩn";
                        btn.classList.replace("btn-primary", "btn-danger");
                    }
                });
            });
        })
        .catch(err => console.error(err));
});
