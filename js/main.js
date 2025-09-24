 // Hero slider
    const heroSwiper = new Swiper('.hero-swiper', {
      loop: true,
      autoplay: { delay: 5000 },
      pagination: { el: '.hero-pagination', clickable: true },
    });

    // Campeones slider
    const campeonesSwiper = new Swiper('.campeones-swiper', {
      slidesPerView: 1,
      spaceBetween: 15,
      loop: true,
      navigation: {
        nextEl: '.campeones-next',
        prevEl: '.campeones-prev',
      },
      pagination: {
        el: '.campeones-pagination',
        clickable: true,
      },
      breakpoints: {
        480: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
      },
    });


