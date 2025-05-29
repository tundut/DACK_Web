// Giả sử API trả về chi tiết sản phẩm dạng:
// {
//   id, title, price, description, sizeOptions, colorOptions, colorName, images, mainImage
// }

document.addEventListener('DOMContentLoaded', async () => {
  // Lấy id sản phẩm từ URL: /product/123
  const pathParts = window.location.pathname.split('/');
  const productId = pathParts[pathParts.length - 1];

  // Gọi API lấy chi tiết sản phẩm
  let product;
  try {
    const res = await fetch(`/api/products/${productId}`);
    if (!res.ok) throw new Error('Không tìm thấy sản phẩm');
    product = await res.json();
  } catch (err) {
    document.querySelector('.container').innerHTML = `<div class="alert alert-danger text-center my-5">Không thể tải sản phẩm!</div>`;
    return;
  }

  // Render thông tin sản phẩm
  document.getElementById('product-title').textContent = product.title || '';
  document.getElementById('product-price').textContent = product.price ? product.price.toLocaleString('vi-VN') + '₫' : '';
  document.getElementById('product-description').textContent = product.description || '';

  // Render size options nếu có
  if (product.sizeOptions && product.sizeOptions.length > 0) {
    const sizeSelect = document.getElementById('product-size');
    sizeSelect.innerHTML = product.sizeOptions.map(size =>
      `<option${size === product.size ? ' selected' : ''}>${size}</option>`
    ).join('');
  }

  // Render các màu
  if (product.colorOptions && product.colorOptions.length > 0) {
    const colorContainer = document.getElementById('product-colors');
    colorContainer.innerHTML = product.colorOptions.map((color, idx) => `
      <button type="button"
        class="btn btn-light border rounded-circle p-0${color.code === product.colorCode ? ' selected' : ''}"
        style="width:32px;height:32px;background:${color.code}"
        data-color="${color.code}"
        title="${color.name}">
      </button>
    `).join('');

    // Sự kiện chọn màu
    colorContainer.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', function() {
        colorContainer.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        // Đổi tên màu
        const colorObj = product.colorOptions.find(c => c.code === this.dataset.color);
        document.getElementById('product-color-name').textContent = colorObj ? colorObj.name : '';
        // Đổi ảnh chính nếu có
        if (colorObj && colorObj.mainImage) {
          setMainImage(colorObj.mainImage);
        }
      });
    });
  }

  // Render ảnh chính và thumbnails
  function setMainImage(src) {
    document.getElementById('main-product-image').src = src;
    // Đánh dấu thumbnail đang chọn
    document.querySelectorAll('#product-thumbnails img').forEach(img => {
      img.classList.toggle('selected', img.src.endsWith(src));
    });
  }

  if (product.images && product.images.length > 0) {
    const thumbContainer = document.getElementById('product-thumbnails');
    thumbContainer.innerHTML = product.images.map((img, idx) => `
      <img src="${img}" class="rounded-3 border${idx === 0 ? ' selected' : ''}" 
        style="width:54px;height:54px;object-fit:contain;cursor:pointer;">
    `).join('');
    setMainImage(product.images[0]);
    // Sự kiện click thumbnail
    thumbContainer.querySelectorAll('img').forEach(img => {
      img.addEventListener('click', function() {
        setMainImage(this.src);
      });
    });
  } else if (product.mainImage) {
    setMainImage(product.mainImage);
  }
});

document.addEventListener('DOMContentLoaded', function() {
    const btnAddToCart = document.querySelector('.btn-primary.btn-lg');
    if (btnAddToCart) {
        btnAddToCart.addEventListener('click', async function() {
            // Lấy id sản phẩm từ URL
            const match = window.location.pathname.match(/\/product\/(\d+)/);
            const id_san_pham = match ? match[1] : null;
            if (!id_san_pham) return alert('Không xác định được sản phẩm');
            try {
                const res = await fetch('/api/cart/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_san_pham, so_luong: 1 })
                });
                const data = await res.json();
                if (data.success) {
                    alert('Đã thêm vào giỏ hàng!');
                } 
                else if (data.message === "Chưa đăng nhập") {
                    alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
                }
                else {
                    alert(data.message || 'Lỗi khi thêm vào giỏ hàng');
                }
            } catch (err) {
                alert('Lỗi kết nối máy chủ');
            }
        });
    }
});
