document.addEventListener('DOMContentLoaded', () => {
const navbar = document.querySelector('.navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
    // Cuộn xuống và đã qua 100px → ẩn navbar
    navbar.style.transform = 'translateY(-100%)';
    navbar.style.transition = 'transform 0.3s ease-in-out';
    } else {
    // Cuộn lên → hiện navbar
    navbar.style.transform = 'translateY(0)';
    navbar.style.transition = 'transform 0.3s ease-in-out';
    }

    lastScrollY = currentScrollY;
});
});