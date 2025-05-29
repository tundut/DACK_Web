const heroBackgrounds = [
    'https://i.pinimg.com/736x/f0/c1/b6/f0c1b61eea0cf856722c598237ec9c71.jpg',
    'https://i.pinimg.com/736x/cc/7a/c6/cc7ac6adf548c66e4088430872c8c820.jpg',
];
// Lấy random 1 ảnh (hoặc chỉ lấy ảnh đầu nếu chỉ có 1)
const bgUrl = heroBackgrounds[Math.floor(Math.random() * heroBackgrounds.length)];
document.getElementById('hero-section').style.backgroundImage = `url('${bgUrl}')`; 

const featureSwiper = new Swiper('.feature-swiper', {
    loop: true,
    spaceBetween: 30,
    slidesPerView: 3,
    slidesPerGroup: 1,
    navigation: {
        nextEl: '.feature-swiper .swiper-button-next',
        prevEl: '.feature-swiper .swiper-button-prev',
    },
    pagination: {
        el: '.feature-swiper .swiper-pagination',
        clickable: true,
    },
});

const accessoriesSwiper = new Swiper('.accessories-swiper', {
    loop: true,
    spaceBetween: 30,
    slidesPerView: 3,
    slidesPerGroup: 1,
    navigation: {
        nextEl: '.accessories-swiper .swiper-button-next',
        prevEl: '.accessories-swiper .swiper-button-prev',
    },
    pagination: {
        el: '.accessories-swiper .swiper-pagination',
        clickable: true,
    },
});


function getFeatureProduct(){
    fetch('/api/products/featured')
    .then(res => res.json())
    .then(data => {
        const featured = data.filter(item => [1, 2, 3, 4, 5].includes(item.id));
        renderFeatureProducts(featured);
        const accessories = data.filter(item => [6, 7, 8, 9, 10].includes(item.id));
        renderAccessoryProducts(accessories);
    });
}

function renderFeatureProducts(products) {
    const container = document.querySelector('.feature-swiper .swiper-wrapper');
    container.innerHTML = '';
    products.forEach(product => {
        const productHTML = `
            <div class="swiper-slide">
                <div class="card text-center card">
                    <img src="${product.image}" class="card-img-top" alt="${product.ten_san_pham}">
                    <div class="card-body">
                        <h5 class="card-title fw-bold">${product.ten_san_pham}</h5>
                        <p class="card-text">$${product.price}</p>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productHTML;
    });
    featureSwiper.update();
}

function renderAccessoryProducts(products) {
    const container = document.querySelector('.accessories-swiper .swiper-wrapper');
    container.innerHTML = '';
    products.forEach(product => {
        const productHTML = `
            <div class="swiper-slide">
                <div class="card text-center card">
                    <img src="${product.image}" class="card-img-top" alt="${product.ten_san_pham}">
                    <div class="card-body">
                        <h5 class="card-title fw-bold">${product.ten_san_pham}</h5>
                        <p class="card-text">$${product.price}</p>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productHTML;
    });
    featureSwiper.update();
}

addEventListener('DOMContentLoaded', () => {
    getFeatureProduct();
});