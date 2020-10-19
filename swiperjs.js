var bannerSwiper = new Swiper ('.banner .swiper-container', {
    direction: 'horizontal',//滑动方向horizontal水平、vertical垂直
    loop: true,
    effect : 'fade',//默认为"fade"（位移切换），可设置为'slide'（普通切换、默认）,"fade"（淡入）"cube"（方块）"coverflow"（3d流）"flip"（3d翻转）。
    autoplay: true,//可选选项，自动滑动
    /*autoplay: {
    delay: 3000,时间
    stopOnLastSlide: false, //当切换到最后一个slide时停止自动切换
    },*/
    // 如果需要分页器
    pagination: {
      el: '.banner .swiper-pagination',
      clickable :true,//圆点允许点击
    },
    
    // 如果需要前进后退按钮
    navigation: {
      nextEl: '.banner .swiper-button-next',
      prevEl: '.banner .swiper-button-prev',
    },

  });


var galleryThumbs = new Swiper('.product_swiper .gallery-thumbs', {
    spaceBetween:10,
    slidesPerView: 5,
    freeMode: true,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
    navigation: {
        nextEl: '.product_swiper .swiper-button-next',
        prevEl: '.product_swiper .swiper-button-prev',
    },
    breakpoints: {

        768: {
            slidesPerView:3,
            spaceBetween: 10,
        },
    },
});

var galleryTop = new Swiper('.product_swiper .gallery-top', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    thumbs: {
        swiper: galleryThumbs,
        slideThumbActiveClass: 'swiper-slide-thumb-active',
    }
});



var galleryThumbs = new Swiper('.product_swiper2 .gallery-thumbs', {
    spaceBetween:10,
    slidesPerView: 5,
    freeMode: true,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
    navigation: {
        nextEl: '.product_swiper2 .swiper-button-next',
        prevEl: '.product_swiper2 .swiper-button-prev',
    },
    breakpoints: {

        768: {
            slidesPerView:3,
            spaceBetween: 10,
        },
    },
});

var galleryTop = new Swiper('.product_swiper2 .gallery-top', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    thumbs: {
        swiper: galleryThumbs,
        slideThumbActiveClass: 'swiper-slide-thumb-active',
    }
});