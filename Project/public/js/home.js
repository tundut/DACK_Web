const heroBackgrounds = [
    'https://i.pinimg.com/736x/f0/c1/b6/f0c1b61eea0cf856722c598237ec9c71.jpg',
    'https://i.pinimg.com/736x/cc/7a/c6/cc7ac6adf548c66e4088430872c8c820.jpg',
  ];
  // Lấy random 1 ảnh (hoặc chỉ lấy ảnh đầu nếu chỉ có 1)
  const bgUrl = heroBackgrounds[Math.floor(Math.random() * heroBackgrounds.length)];
  document.getElementById('hero-section').style.backgroundImage = `url('${bgUrl}')`; 