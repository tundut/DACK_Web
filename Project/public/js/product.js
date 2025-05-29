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
        productApp.loadAllProducts(null, idDanhMuc === 'all' ? null : idDanhMuc);
      }
    });
  }

  // Gắn sự kiện tìm kiếm xổ ra đúng style
  const searchBox = document.getElementById('search-box');
  const searchToggle = document.getElementById('search-toggle');
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  if (searchToggle && searchForm && searchInput) {
    searchToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      searchForm.classList.toggle('show');
      if (searchForm.classList.contains('show')) {
        searchInput.focus();
      }
    });
    // Ẩn form khi click ra ngoài
    document.addEventListener('click', function(e) {
      if (!searchBox.contains(e.target) && searchForm.classList.contains('show')) {
        searchForm.classList.remove('show');
      }
    });
    // Ẩn form khi submit
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      searchForm.classList.remove('show');
      const keyword = searchInput.value.trim().toLowerCase();
      if (!keyword) {
        productApp.loadAllProducts();
        return;
      }
      fetch('/api/products')
        .then(res => res.json())
        .then(products => {
          const filtered = products.filter(p =>
            (p.title && p.title.toLowerCase().includes(keyword))
          );
          const container = document.getElementById('products-container');
          document.getElementById('loading-state').style.display = 'none';
          document.getElementById('error-state').style.display = 'none';
          container.style.display = '';
          if (filtered.length === 0) {
            container.innerHTML = `<div class='text-center w-100 py-5 text-muted fs-4'>Không tìm thấy sản phẩm nào phù hợp!</div>`;
            return;
          }
          container.innerHTML = filtered.map(p => `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4 fade-in">
              <a href="/product/${p.id}" class="text-decoration-none text-dark">
                <div class="product-card">
                  <div class="product-image">
                    <img src="${p.image}" alt="${p.title}" />
                  </div>
                  <div class="product-content">
                    <div class="product-title">${p.title}</div>
                    <div class="product-price">${p.price}$</div>
                    <div class="product-stock ${p.stock === 0 ? 'out-of-stock' : ''}">
                      ${p.stock === 0 ? 'Hết hàng' : 'Còn hàng'}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          `).join('');
          setTimeout(() => {
            document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
          }, 100);
        });
    });
  }
});

fetch('/api/danhmuc')
  .then(res => res.json())
  .then(data => {
    const ul = document.getElementById('danhmuc-list');
    ul.innerHTML = '';
    // Thêm mục 'Tất cả' vào đầu danh sách
    const allLi = document.createElement('li');
    allLi.className = 'list-group-item p-0 border-0 bg-transparent';
    allLi.innerHTML = `<a href="#" data-id="all" class="list-group-item list-group-item-action rounded mb-2 py-2 px-3 fw-bold active" style="color: #333; transition: background 0.2s, font-weight 0.2s;">Tất cả</a>`;
    ul.appendChild(allLi);
    // Sự kiện click cho 'Tất cả'
    allLi.querySelector('a').addEventListener('click', function(e) {
      e.preventDefault();
      ul.querySelectorAll('a[data-id]').forEach(item => item.classList.remove('active', 'fw-bold'));
      this.classList.add('active', 'fw-bold');
      productApp.loadAllProducts();
    });
    // Render các danh mục còn lại
    data.forEach((dm, idx) => {
      const li = document.createElement('li');
      li.className = 'list-group-item p-0 border-0 bg-transparent';
      li.innerHTML = `<a href="#" data-id="${dm.id_danh_muc}" class="list-group-item list-group-item-action rounded mb-2 py-2 px-3" style="color: #333; transition: background 0.2s, font-weight 0.2s;">${dm.ten_danh_muc}</a>`;
      ul.appendChild(li);
    });
    // Gắn lại sự kiện click cho các danh mục còn lại
    ul.querySelectorAll('a[data-id]:not([data-id="all"])').forEach(a => {
      a.addEventListener('click', function(e) {
        e.preventDefault();
        ul.querySelectorAll('a[data-id]').forEach(item => item.classList.remove('active', 'fw-bold'));
        this.classList.add('active', 'fw-bold');
        const idDanhMuc = this.getAttribute('data-id');
        productApp.loadAllProducts(null, idDanhMuc);
      });
    });
  })
  .catch(err => {
    document.getElementById('danhmuc-list').innerHTML = '<li>Lỗi tải danh mục</li>';
  });


      // Danh sách URL ảnh nền động (có thể thêm nhiều ảnh nếu muốn random)
      const heroBackgrounds = [
        'https://i.pinimg.com/736x/f0/c1/b6/f0c1b61eea0cf856722c598237ec9c71.jpg',
        'https://i.pinimg.com/736x/cc/7a/c6/cc7ac6adf548c66e4088430872c8c820.jpg',
      ];
      // Lấy random 1 ảnh (hoặc chỉ lấy ảnh đầu nếu chỉ có 1)
      const bgUrl = heroBackgrounds[Math.floor(Math.random() * heroBackgrounds.length)];
      document.getElementById('hero-section').style.backgroundImage = `url('${bgUrl}')`;      
