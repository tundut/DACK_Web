// Sidebar toggle logic

document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebarMenu');
  const overlay = document.getElementById('sidebarOverlay');
  const closeBtn = document.getElementById('closeSidebar');

  function openSidebar() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
  }

  function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  }

  menuBtn.addEventListener('click', function() {
    openSidebar();
    loadCategories();
  });
  closeBtn.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);

  // Đóng sidebar khi nhấn phím ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeSidebar();
  });
});

async function loadCategories() {
  try {
    const res = await fetch('/api/danhmuc');
    const categories = await res.json();
    const list = document.getElementById('sidebar-categories');
    if (Array.isArray(categories) && list) {
      list.innerHTML = categories.map(cat =>
        `<li><a href="/product?category=${encodeURIComponent(cat.ten_danh_muc)}" class="text-decoration-none d-block py-2">${cat.ten_danh_muc}</a></li>`
      ).join('');
    }
  } catch (e) {
    // Có thể hiển thị lỗi hoặc để trống
  }
} 