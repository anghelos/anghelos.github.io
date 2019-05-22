$(document).ready(function () {

    //----------------------Carousel

    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 3,
        spaceBetween: 40,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            direction: 'horizontal',

            pagination: {
                el: '.swiper-pagination'
            },
        },
    });

});
