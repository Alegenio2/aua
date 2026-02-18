document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Swiper Principal
    if (document.querySelector('.swiper')) {
        new Swiper('.swiper', {
            loop: true,
            autoplay: { delay: 5000, disableOnInteraction: false },
            pagination: { el: '.swiper-pagination', clickable: true },
            effect: 'fade', // Opcional: queda muy elegante para el estilo Age
        });
    }

    // Inicializar Swiper de Campeones
    if (document.querySelector('.swiperlateral')) {
        new Swiper('.swiperlateral', {
            loop: true,
            autoplay: { delay: 4000 },
            grabCursor: true,
            slidesPerView: 1,
        });
    }

    // Menú Hamburguesa mejorado
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('main-nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que el click se propague
            nav.classList.toggle('active');
        });

        // Cerrar menú al hacer click fuera (UX mejorada)
        document.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    }
});


