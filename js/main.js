// Inicializar SwiperJS
const swiper = new Swiper('.swiper', {
    loop: true,
    autoplay: { delay: 5000 },
    pagination: { el: '.swiper-pagination', clickable: true },
  });
  
 
  // Toggle menú hamburguesa
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');
  
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
  });

  const campeonesSwiper = new Swiper('.campeones-swiper', {
  slidesPerView: 1,
  spaceBetween: 15,
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    480: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
  },
});
