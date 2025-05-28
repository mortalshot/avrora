function initSliders() {
  if (document.querySelector('.homebanner__slider')) {
    new Swiper('.homebanner__slider', {
      speed: 800,
      spaceBetween: 40,
      watchOverflow: true,
      autoHeight: true,
      lazy: {
        loadPrevNext: true, // Предзагрузка следующего и предыдущего слайда
        loadOnTransitionStart: true, // Начинать загрузку при начале перехода
      },
      preloadImages: false, // Отключаем стандартную предзагрузку
    });
  }

  if (document.querySelector('.cases__slider')) {
    const casesSlider = new Swiper('.cases__slider', {
      speed: 800,
      spaceBetween: 40,
      watchOverflow: true,
      autoHeight: true,

      lazy: {
        loadPrevNext: false,
        loadOnTransitionStart: false,
      },
      preloadImages: false,

      navigation: {
        nextEl: '.cases__slider .swiper-arrow_next',
        prevEl: '.cases__slider .swiper-arrow_prev',
      },

      scrollbar: {
        el: '.cases__slider .swiper-scrollbar',
        draggable: true,
      }
    });
  }

  if (document.querySelector('.template3__slider')) {
    const casesSlider = new Swiper('.template3__slider', {
      speed: 800,
      slidesPerView: 1,
      spaceBetween: 12,
      watchOverflow: true,
      autoHeight: false,

      lazy: {
        loadPrevNext: false,
        loadOnTransitionStart: false,
      },
      preloadImages: false,

      scrollbar: {
        el: '.template3__slider .swiper-scrollbar',
        draggable: true,
      }
    });
  }

  if (document.querySelector('.widget-cases__slider')) {
    new Swiper('.widget-cases__slider', {
      speed: 800,
      spaceBetween: 8,
      watchOverflow: true,
      slidesPerView: 1.2,
      slidesPerGroup: 1,

      lazy: {
        loadPrevNext: false,
        loadOnTransitionStart: false,
      },
      preloadImages: false,

      scrollbar: {
        el: '.widget-cases__slider .swiper-scrollbar',
        draggable: true,
      },

      breakpoints: {
        480: {
          spaceBetween: 8,
          slidesPerView: 2,
        },
        575: {
          spaceBetween: 8,
          slidesPerView: 2.5,
        },
        768: {
          spaceBetween: 8,
          slidesPerView: 3,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 16,
        },
        1280: {
          slidesPerView: 3.72,
          spaceBetween: 16,
        },
        1650: {
          spaceBetween: 30,
          slidesPerView: 3.72,
        },
        1800: {
          spaceBetween: 40,
          slidesPerView: 4,
        }
      }
    });
  }

  if (document.querySelector('.product-gallery__main')) {
    if (document.querySelector('.product-gallery__thumbs')) {
      const productThumbsSwiper = new Swiper('.product-gallery__thumbs .swiper', {
        observer: true,
        observeParents: true,
        slidesPerView: 3,
        spaceBetween: 8,
        speed: 400,
        loop: true,
        lazy: {
          loadPrevNext: false,
          loadOnTransitionStart: false,
        },
        preloadImages: false,

        navigation: {
          prevEl: document.querySelector('.product-gallery__thumbs .swiper-arrow_prev'),
          nextEl: document.querySelector('.product-gallery__thumbs .swiper-arrow_next'),
        },

        breakpoints: {
          480: {
            spaceBetween: 8,
            slidesPerView: 5,
          },
          575: {
            spaceBetween: 8,
            slidesPerView: 6,
          },
          768: {
            spaceBetween: 8,
            slidesPerView: 7,
          },
          992: {
            spaceBetween: 8,
            slidesPerView: 4,
          },
          1280: {
            spaceBetween: 8,
            slidesPerView: 5,
          },
          1440: {
            spaceBetween: 16,
            slidesPerView: 5,
          },
          1650: {
            spaceBetween: 16,
            slidesPerView: 7,
          },
        }
      });

      new Swiper('.product-gallery__main', {
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 20,
        speed: 800,
        watchOverflow: true,
        loop: true,
        lazy: {
          loadPrevNext: false,
          loadOnTransitionStart: false,
        },
        preloadImages: false,

        thumbs: {
          swiper: productThumbsSwiper
        },
      });
    }
    else {
      new Swiper('.product-gallery__main', {
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 20,
        speed: 800,
        watchOverflow: true,
      });
    }
  }

  if (document.querySelector('.team-widget__slider')) {
    new Swiper('.team-widget__slider', {
      speed: 800,
      slidesPerView: 2,
      spaceBetween: 10,
      watchOverflow: true,

      lazy: {
        loadPrevNext: false,
        loadOnTransitionStart: false,
      },
      preloadImages: false,

      breakpoints: {
        480: {
          slidesPerView: 3,
          spaceBetween: 8,
        },
        575: {
          slidesPerView: 4,
          spaceBetween: 8,
        },
        768: {
          slidesPerView: 5,
          spaceBetween: 8,
        },
        992: {
          slidesPerView: 6,
          spaceBetween: 8,
        },
        1180: {
          slidesPerView: 7,
          spaceBetween: 8,
        },
        1280: {
          slidesPerView: 8,
          spaceBetween: 8,
        },
        1480: {
          slidesPerView: 9,
          spaceBetween: 8,
        },
      },
    });
  }

  if (document.querySelector('.logofuse__slider')) {
    new Swiper('.logofuse__slider', {
      speed: 800,
      spaceBetween: 0,
      watchOverflow: true,
      slidesPerView: 2,
      slidesPerGroup: 4,
      grid: {
        rows: 2,
        fill: 'row'
      },

      lazy: {
        loadPrevNext: false,
        loadOnTransitionStart: false,
      },
      preloadImages: false,
    });
  }
}

window.addEventListener("load", function (e) {
  initSliders();
});