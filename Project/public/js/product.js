// product.js
// Hiển thị danh sách sản phẩm với hiệu ứng loading, error, fade-in

const productApp = {
  async loadAllProducts(category = null, idDanhMuc = null) {
    // Hiện loading, ẩn error và products
    document.getElementById('loading-state').style.display = '';
    document.getElementById('error-state').style.display = 'none';
    document.getElementById('products-container').style.display = 'none';

    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Network error');
      const products = await res.json();

      // Lọc sản phẩm theo id danh mục hoặc tên danh mục
      let filteredProducts = products;
      if (idDanhMuc) {
        filteredProducts = products.filter(p => String(p.id_danh_muc) === String(idDanhMuc));
      } else if (category) {
        filteredProducts = products.filter(p => p.ten_danh_muc === category);
      } else {
        // Lọc theo query param nếu có
        function getQueryParam(name) {
          const urlParams = new URLSearchParams(window.location.search);
          return urlParams.get(name);
        }
        const selectedCategory = getQueryParam('category');
        if (selectedCategory) {
          filteredProducts = products.filter(p => p.ten_danh_muc === selectedCategory);
        }
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
                <!--<div class="product-description">${p.description}</div>-->
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
// Và gắn sự kiện filter cho sidebar danh mục

document.addEventListener('DOMContentLoaded', () => {
  productApp.loadAllProducts();

  // Gắn sự kiện click cho các danh mục (sau khi danh mục đã được render)
  const danhMucList = document.getElementById('danhmuc-list');
  if (danhMucList) {
    danhMucList.addEventListener('click', function(e) {
      if (e.target && e.target.tagName === 'A' && e.target.hasAttribute('data-id')) {
        e.preventDefault();
        const idDanhMuc = e.target.getAttribute('data-id');
        productApp.loadAllProducts(null, idDanhMuc);
      }
    });
  }
}); 

fetch('/api/danhmuc')
  .then(res => res.json())
  .then(data => {
    const ul = document.getElementById('danhmuc-list');
    ul.innerHTML = '';
    data.forEach((dm, idx) => {
      const li = document.createElement('li');
      li.className = 'list-group-item p-0 border-0 bg-transparent';
      li.innerHTML = `<a href="#" data-id="${dm.id_danh_muc}" class="list-group-item list-group-item-action rounded mb-2 py-2 px-3${idx === 0 ? ' active fw-bold' : ''}" style="color: #333; transition: background 0.2s, font-weight 0.2s;">${dm.ten_danh_muc}</a>`;
      ul.appendChild(li);
    });
    // Gắn lại sự kiện click để highlight active và in đậm
    ul.querySelectorAll('a[data-id]').forEach(a => {
      a.addEventListener('click', function(e) {
        ul.querySelectorAll('a[data-id]').forEach(item => { item.classList.remove('active', 'fw-bold'); });
        this.classList.add('active', 'fw-bold');
      });
    });
  })
  .catch(err => {
    document.getElementById('danhmuc-list').innerHTML = '<li>Lỗi tải danh mục</li>';
  });