// product.js
// Hiển thị danh sách sản phẩm với hiệu ứng loading, error, fade-in

const productApp = {
  async loadAllProducts() {
    // Hiện loading, ẩn error và products
    document.getElementById('loading-state').style.display = '';
    document.getElementById('error-state').style.display = 'none';
    document.getElementById('products-container').style.display = 'none';

    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Network error');
      const products = await res.json();

      // Lọc sản phẩm theo danh mục nếu có category trên URL
      function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
      }
      const selectedCategory = getQueryParam('category');
      let filteredProducts = products;
      if (selectedCategory) {
        filteredProducts = products.filter(p => p.ten_danh_muc === selectedCategory);
      }

      // Ẩn loading, hiện products
      document.getElementById('loading-state').style.display = 'none';
      document.getElementById('error-state').style.display = 'none';
      const container = document.getElementById('products-container');
      container.style.display = '';
      container.innerHTML = filteredProducts.map(p => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4 fade-in">
          <a href="/product/${p.id}" class="text-decoration-none text-dark">
            <div class="product-card">
              <div class="product-image">
                <img src="${p.image}" alt="${p.title}" />
              </div>
              <div class="product-content">
                <div class="product-title">${p.title}</div>
                <div class="product-description">${p.description}</div>
                <div class="product-price">${p.price}$</div>
                <div class="product-stock ${p.stock === 0 ? 'out-of-stock' : ''}">
                  ${p.stock === 0 ? 'Hết hàng' : 'Còn hàng'}
                </div>
              </div>
            </div>
          </a>
        </div>
      `).join('');
      // Hiệu ứng fade-in
      setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
      }, 100);
    } catch (err) {
      // Ẩn loading, hiện error
      document.getElementById('loading-state').style.display = 'none';
      document.getElementById('error-state').style.display = '';
      document.getElementById('products-container').style.display = 'none';
    }
  }
};

// Tự động load khi vào trang
document.addEventListener('DOMContentLoaded', () => {
  productApp.loadAllProducts();
}); 