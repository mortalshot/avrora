// Подключение функционала "Чертоги Фрилансера"
import { isMobile, _slideUp, _slideDown, bodyLockToggle, bodyUnlock, bodyLock, bodyLockStatus, removeClasses, _slideToggle } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";

// Флаг для отслеживания состояния блокировки кнопки копирования
let isCopyCoolDown = false;
let isCatalogArrowCoolDown = false;

document.addEventListener('click', function (e) {
  const targetElement = e.target;

  // Копируем содержимое при клике на кнопку
  if (targetElement.classList.contains('js-copy-button') || targetElement.closest('.js-copy-button')) {
    if (isCopyCoolDown) {
      return;
    };

    const parent = targetElement.closest('.copy-item');
    const copyText = parent.querySelector('.copy-item__text');
    const textToCopy = copyText.textContent.trim();
    const button = targetElement.closest('.js-copy-button');
    const customText = button.dataset.text;

    // Создаем и добавляем тултип
    const tooltip = document.createElement('div');
    tooltip.className = 'copy-item__tooltip';
    tooltip.textContent = customText && customText.trim() !== ''
      ? customText
      : 'Скопировано в буфер обмена';
    parent.appendChild(tooltip);

    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    // Показываем тултип
    _slideDown(tooltip, 300);
    isCopyCoolDown = true;

    // Через 1.5 секунды начинаем скрывать тултип
    setTimeout(() => {
      _slideUp(tooltip, 300);

      // После завершения анимации удаляем тултип и снимаем блокировку
      setTimeout(() => {
        tooltip.remove();
        isCopyCoolDown = false;
      }, 300);
    }, 2000);
  }

  // Отображение виджета каталога
  const catalogButton = targetElement.closest('.js-catalog-button');
  const menuRow = document.querySelector('.header-menu__row');
  if (catalogButton && bodyLockStatus) {
    document.body.classList.toggle('_catalog-show');
    // bodyLock();
    return;
  }
  if (!targetElement.closest('.header-catalog') && document.body.classList.contains('_catalog-show')) {
    // bodyUnlock();
    document.body.classList.remove('_catalog-show');
  }
  if (targetElement.closest('.header-catalog__close') && document.body.classList.contains('_catalog-show')) {
    document.body.classList.remove('_catalog-show');

    const activeItem = document.querySelector('.header-catalog__item._active');
    if (activeItem) {
      const itemList = activeItem.querySelector('.header-catalog__sub-list');
      activeItem.classList.remove('_active');
      _slideUp(itemList, 0);
    }
  }

  const catalogArrow = targetElement.closest('.header-catalog__arrow');
  if (catalogArrow) {
    if (isCatalogArrowCoolDown) {
      console.log('Кнопка временно заблокирована');
      return;
    }

    isCatalogArrowCoolDown = true;

    setTimeout(() => {
      isCatalogArrowCoolDown = false;
    }, 300);

    const parentItem = catalogArrow.closest('.header-catalog__item_has-children');
    const activeItems = document.querySelectorAll('.header-catalog__item_has-children._list-show');
    const isSameItemActive = parentItem.classList.contains('_list-show');

    // Закрываем все открытые элементы

    activeItems.forEach(item => {
      item.classList.remove('_list-show');
    });

    if (!isSameItemActive) {
      parentItem.classList.add('_list-show');
    }
  }

  /* if (targetElement.classList.contains('js-category-button') || targetElement.closest('.js-category-button')) {
    const parent = targetElement.closest('.widget-category');
    parent.classList.toggle('_active');
  } */

  if (targetElement.classList.contains('js-card-add') || targetElement.closest('.js-card-add')) {
    const parent = targetElement.closest('.product-card');
    parent.classList.toggle('_popup-show');
  }
  if (!targetElement.closest('.product-card') && document.querySelector('.product-card._popup-show')) {
    document.querySelector('.product-card._popup-show').classList.remove('_popup-show');
    removeClasses(document.querySelectorAll('.product-card._popup-show'), '_popup-show')
  }
})

// Размещаем .header-catalog__wrapper
if (document.querySelector('.header-menu__row') && window.innerWidth >= 992) {
  function calcMenuRowIndent() {
    const menuRow = document.querySelector('.header-menu__row');
    const menuWrapper = document.querySelector('.header-catalog__wrapper');
    if (!menuRow || !menuWrapper) return;

    // Получаем позицию элемента с учетом скролла
    const menuRowRect = menuRow.getBoundingClientRect();
    const absoluteTop = menuRow.offsetTop;
    const scrollY = window.scrollY || window.pageYOffset;

    // Рассчитываем отступы с учетом проскролленных пикселей
    const pixelsFromLeft = menuRowRect.left;
    const pixelsFromTop = absoluteTop - scrollY;
    const menuRowHeight = menuRow.offsetHeight;

    // Устанавливаем CSS-переменные
    menuWrapper.style.setProperty('--distance-to-left', `${pixelsFromLeft}px`);
    menuWrapper.style.setProperty('--distance-to-top', `${pixelsFromTop}px`);
    menuWrapper.style.setProperty('--row-height', `${menuRowHeight}px`);
  }

  document.addEventListener('DOMContentLoaded', calcMenuRowIndent);

  // Оптимизированный обработчик ресайза
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(calcMenuRowIndent, 100);
  });

  // Обработчик скролла с троттлингом
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if ((window.scrollY || window.pageYOffset) < 50) {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(calcMenuRowIndent, 50);
    }
  });
}

function initCatalogMenu() {
  const menuContainers = document.querySelectorAll('[data-catalog-container]');

  menuContainers.forEach(container => {
    const list = container.querySelector('[data-catalog-list]');
    const toggleBtn = container.querySelector('[data-catalog-button]');
    const breakpointSettings = container.getAttribute('data-catalog-container');

    if (!list || !toggleBtn || !breakpointSettings) return;

    // Парсим настройки брейкпоинта
    const [breakpointValue, breakpointType] = breakpointSettings.split(',').map(item => item.trim());
    const breakpoint = parseInt(breakpointValue);

    // Проверяем, нужно ли активировать аккордеон
    const isActiveMode =
      (breakpointType === 'max' && window.innerWidth <= breakpoint) ||
      (breakpointType !== 'max' && window.innerWidth >= breakpoint);

    // Удаляем старый обработчик
    toggleBtn.removeEventListener('click', handleToggle);

    if (!isActiveMode) {
      // Режим "всегда открыт"
      _slideDown(list, 0);
      container.classList.remove('_active');
      return;
    }

    // Режим аккордеона
    _slideUp(list, 0);
    container.classList.remove('_active');

    // Обработчик клика
    function handleToggle(e) {
      e.preventDefault();

      // Закрываем все другие открытые списки
      document.querySelectorAll('[data-catalog-container]._active').forEach(openContainer => {
        if (openContainer !== container) {
          const openList = openContainer.querySelector('[data-catalog-list]');
          openContainer.classList.remove('_active');
          _slideUp(openList, 300);
        }
      });

      // Переключаем текущий список
      container.classList.toggle('_active');
      _slideToggle(list, 300);
    }

    toggleBtn.addEventListener('click', handleToggle);
  });
}

// Инициализация
document.addEventListener('DOMContentLoaded', initCatalogMenu);

// Реакция на ресайз
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(initCatalogMenu, 100);
});

// Прячем плавающее меню, когда доскралливаем до футера
function setupFloatingMenuObserver() {
  const floatingMenu = document.querySelector('.floating-menu');
  const footer = document.querySelector('.footer');
  const headerMenu = document.querySelector('.header-menu');

  if (!floatingMenu || !footer || !headerMenu) return;

  let footerObserver;
  let headerObserver;

  function handleIntersection(entries) {
    entries.forEach(entry => {
      // Проверяем, какой элемент вызвал срабатывание
      const target = entry.target;
      const shouldHide = entry.isIntersecting;

      // Если сработал header-menu - скрываем floating-menu
      if (target === headerMenu && shouldHide) {
        floatingMenu.style.opacity = '0';
        floatingMenu.style.pointerEvents = 'none';
      }
      // Если header-menu скрылся - проверяем footer
      else if (target === headerMenu && !shouldHide) {
        // Проверяем, не пересекается ли footer
        const footerRect = footer.getBoundingClientRect();
        const isFooterVisible = footerRect.top < window.innerHeight;

        if (!isFooterVisible) {
          floatingMenu.style.opacity = '1';
          floatingMenu.style.pointerEvents = 'auto';
        }
      }
      // Если сработал footer - скрываем floating-menu
      else if (target === footer) {
        floatingMenu.style.opacity = shouldHide ? '0' : '1';
        floatingMenu.style.pointerEvents = shouldHide ? 'none' : 'auto';
      }
    });
  }

  function initObserver() {
    // Удаляем старые observer'ы если есть
    if (footerObserver) footerObserver.disconnect();
    if (headerObserver) headerObserver.disconnect();

    // Активируем только на ширине от 992px
    if (window.innerWidth >= 992) {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: `-${floatingMenu.offsetHeight}px 0px 0px 0px`
      };

      // Создаем observer для футера
      footerObserver = new IntersectionObserver(handleIntersection, observerOptions);
      footerObserver.observe(footer);

      // Создаем observer для header-menu
      headerObserver = new IntersectionObserver(handleIntersection, {
        threshold: 0.5,
        rootMargin: '0px 0px 0px 0px'
      });
      headerObserver.observe(headerMenu);
    } else {
      // На маленьких экранах всегда показываем меню
      floatingMenu.style.opacity = '1';
      floatingMenu.style.pointerEvents = 'auto';
    }
  }

  // Инициализируем при загрузке
  initObserver();

  // Переинициализируем при изменении размера окна
  window.addEventListener('resize', () => {
    clearTimeout(window.floatingMenuResizeTimer);
    window.floatingMenuResizeTimer = setTimeout(initObserver, 100);
  });
}
window.addEventListener('DOMContentLoaded', setupFloatingMenuObserver);

function setMinHeightForStepsTabs() {
  const allStepsTabs = document.querySelectorAll('.steps__tabs');

  allStepsTabs.forEach(stepsTab => {
    // Проверяем наличие data-tabs атрибута
    const breakpoint = stepsTab.getAttribute('data-tabs');
    if (!breakpoint) return;

    // Находим все .steps__body внутри текущего .steps__tabs
    const stepsBodies = stepsTab.querySelectorAll('.steps__body');
    const tabsNavigation = stepsTab.querySelector('.tabs__navigation');

    if (!tabsNavigation) return;

    // Проверяем текущую ширину экрана
    const screenWidth = window.innerWidth;
    const breakpointValue = parseInt(breakpoint);

    if (screenWidth >= breakpointValue) {
      // Для больших экранов - устанавливаем min-height
      const navigationHeight = tabsNavigation.offsetHeight;
      stepsBodies.forEach(body => {
        body.style.minHeight = `${navigationHeight}px`;
      });
    } else {
      // Для маленьких экранов - удаляем min-height
      stepsBodies.forEach(body => {
        body.style.minHeight = '';
      });
    }
  });
}
document.addEventListener('DOMContentLoaded', setMinHeightForStepsTabs);
// Оптимизированная обработка ресайза
let stepResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(stepResizeTimer);
  stepResizeTimer = setTimeout(setMinHeightForStepsTabs, 100);
});

document.addEventListener('DOMContentLoaded', function () {
  // !Работа с брифом
  const steps = document.querySelectorAll('.brief__step');
  const navItems = document.querySelectorAll('.brief__nav li');
  const prevButtons = document.querySelectorAll('.js-button-prev');
  const nextButtons = document.querySelectorAll('.js-button-next');

  // Функция для проверки обязательных полей
  function validateStep(step) {
    const requiredInputs = step.querySelectorAll('.input[data-required]');
    let isValid = true;

    requiredInputs.forEach(input => {
      // Проверяем только наличие значения
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('_form-error');
        // Добавляем класс ошибки родителю с классом form-item
        input.closest('.form-item')?.classList.add('_form-error');
      }
    });

    return isValid;
  }

  // Функция для обновления навигации
  function updateNav(currentIndex) {
    navItems.forEach(item => {
      item.classList.remove('_current', '_done', '_invalid');
    });

    navItems.forEach((item, index) => {
      if (index === currentIndex) {
        item.classList.add('_current');
      } else if (index < currentIndex) {
        item.classList.add('_done');
      }
    });
  }

  // Функция для переключения шага
  function changeStep(newIndex) {
    const currentStep = document.querySelector('.brief__step._active');
    const currentIndex = Array.from(steps).indexOf(currentStep);

    // Проверяем текущий шаг только при переходе вперед
    if (newIndex > currentIndex && !validateStep(currentStep)) {
      return false;
    }

    // Переключаем шаги
    currentStep.classList.remove('_active');
    steps[newIndex].classList.add('_active');
    updateNav(newIndex);
  }

  // Обработчики для кнопок навигации
  prevButtons.forEach(button => {
    button.addEventListener('click', () => {
      const currentIndex = Array.from(steps).indexOf(button.closest('.brief__step'));
      if (currentIndex > 0) changeStep(currentIndex - 1);
    });
  });

  nextButtons.forEach(button => {
    button.addEventListener('click', () => {
      const currentIndex = Array.from(steps).indexOf(button.closest('.brief__step'));
      if (currentIndex < steps.length - 1) changeStep(currentIndex + 1);
    });
  });

  // Кликабельная навигация
  navItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const currentIndex = Array.from(steps).indexOf(document.querySelector('.brief__step._active'));
      if (index !== currentIndex && (index < currentIndex || validateStep(steps[currentIndex]))) {
        changeStep(index);
      }
    });
  });

  // Сброс ошибок при вводе
  document.addEventListener('input', (e) => {
    if (e.target.matches('.input[data-required]')) {
      e.target.classList.remove('_form-error');
      e.target.closest('.form-item')?.classList.remove('_form-error');
    }
  });

  // Инициализация
  const activeStep = document.querySelector('.brief__step._active');
  if (activeStep) updateNav(Array.from(steps).indexOf(activeStep));

  // !Обработка прикрепления файлов
  // Находим все файловые блоки на странице
  const fileItems = document.querySelectorAll('.file-item');

  // Инициализируем каждый блок
  fileItems.forEach(initFileItem);
});

// Обработка прикрепления файлов
function initFileItem(fileItem) {
  const fileInput = fileItem.querySelector('.file-item__input');
  const fileButton = fileItem.querySelector('.js-file-button');

  // Создаем контейнер для списка файлов
  const fileListContainer = document.createElement('div');
  fileListContainer.className = 'file-list';
  fileItem.appendChild(fileListContainer);

  // Обработка клика на кнопку
  fileButton.addEventListener('click', function (e) {
    e.preventDefault();
    fileInput.click();
  });

  // Функция для отображения списка файлов
  function renderFileList(files) {
    fileListContainer.innerHTML = '';

    if (files.length === 0) {
      return;
    }

    const listTitle = document.createElement('div');
    listTitle.className = 'file-list__title';
    listTitle.textContent = `Выбрано файлов: ${files.length}`;
    fileListContainer.appendChild(listTitle);

    const list = document.createElement('ul');
    list.className = 'file-list__items';

    files.forEach((file, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'file-list__item';

      const fileInfo = document.createElement('div');
      fileInfo.className = 'file-list__info';
      fileInfo.innerHTML = `
        <span class="file-list__name">${file.name}</span>
        <span class="file-list__size">${formatFileSize(file.size)}</span>
      `;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'file-list__delete';
      deleteBtn.innerHTML = '&times;';
      deleteBtn.addEventListener('click', function (e) {
        e.preventDefault();
        removeFile(index);
      });

      listItem.appendChild(fileInfo);
      listItem.appendChild(deleteBtn);
      list.appendChild(listItem);
    });

    fileListContainer.appendChild(list);
  }

  // Функция для удаления файла
  function removeFile(index) {
    const dataTransfer = new DataTransfer();
    const files = Array.from(fileInput.files);

    files.splice(index, 1);

    files.forEach(file => {
      dataTransfer.items.add(file);
    });

    fileInput.files = dataTransfer.files;
    triggerChangeEvent();
  }

  // Функция для форматирования размера файла
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Функция для триггера события change
  function triggerChangeEvent() {
    const event = new Event('change');
    fileInput.dispatchEvent(event);
  }

  // Обработка выбора файлов через input
  fileInput.addEventListener('change', function () {
    renderFileList(Array.from(this.files));
  });

  // Обработка drag and drop
  fileItem.addEventListener('dragover', function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.add('dragover');
  });

  fileItem.addEventListener('dragenter', function (e) {
    e.preventDefault();
    e.stopPropagation();
  });

  fileItem.addEventListener('dragleave', function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove('dragover');
  });

  fileItem.addEventListener('drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove('dragover');

    if (e.dataTransfer.files.length) {
      const dataTransfer = new DataTransfer();
      const currentFiles = fileInput.files ? Array.from(fileInput.files) : [];
      const newFiles = Array.from(e.dataTransfer.files);
      const allFiles = [...currentFiles, ...newFiles];

      // Проверка на максимальное количество файлов
      if (allFiles.length > 10) {
        alert('Можно загрузить не более 10 файлов');
        return;
      }

      // Проверка на размер файлов
      for (let file of newFiles) {
        if (file.size > 10 * 1024 * 1024) {
          alert(`Файл ${file.name} превышает 10MB и не будет загружен`);
          return;
        }
      }

      allFiles.forEach(file => {
        dataTransfer.items.add(file);
      });

      fileInput.files = dataTransfer.files;
      triggerChangeEvent();
    }
  });
}

// Глобальные обработчики для предотвращения открытия файлов
document.addEventListener('dragover', function (e) {
  e.preventDefault();
  e.stopPropagation();
});

document.addEventListener('drop', function (e) {
  e.preventDefault();
  e.stopPropagation();
});

// !Добавляем sticky для элементов, которые подходят под условия
function checkStickyItems() {
  const stickyItems = document.querySelectorAll('._sticky-item');
  const header = document.querySelector('.header');

  if (!stickyItems.length || !header) return;

  const viewportHeight = window.innerHeight;
  const headerHeight = header.offsetHeight;
  const maxAllowedHeight = viewportHeight - headerHeight - 8;

  stickyItems.forEach(item => {
    const itemHeight = item.offsetHeight;

    if (itemHeight < maxAllowedHeight) {
      item.classList.add('_sticky-item_stick');
    } else {
      item.classList.remove('_sticky-item_stick');
    }
  });
}

// Проверяем при полной загрузке страницы (включая стили и изображения)
window.addEventListener('load', () => {
  checkStickyItems();

  // На всякий случай добавляем небольшую задержку (если load сработал рано)
  setTimeout(checkStickyItems, 300);
});

// Cледим за изменением размера окна (с debounce)
let stickyResizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(stickyResizeTimeout);
  stickyResizeTimeout = setTimeout(checkStickyItems, 100);
});

document.addEventListener('DOMContentLoaded', function () {
  const rows = document.querySelectorAll('[data-title]');

  // Функция для проверки ширины экрана
  function isMobile() {
    return window.innerWidth < 992;
  }

  // Функция для управления видимостью строк
  function handleRows() {
    if (isMobile()) {
      // Мобильный режим (< 992px)
      rows.forEach(row => {
        row.style.height = '48px';
        row.style.overflow = 'hidden';
        row.style.transition = 'height 0.3s ease';
        row.style.cursor = 'pointer';

        // Обработчик клика
        row.addEventListener('click', function () {
          // Если строка уже активна — закрываем
          if (this.classList.contains('_active')) {
            this.classList.remove('_active');
            this.style.height = '48px';
          } else {
            // Закрываем все остальные строки
            rows.forEach(r => {
              r.classList.remove('_active');
              r.style.height = '48px';
            });
            // Открываем текущую
            this.classList.add('_active');
            this.style.height = this.scrollHeight + 'px';
          }
        });
      });
    } else {
      // Десктопный режим (≥ 992px)
      rows.forEach(row => {
        row.style.height = 'auto';
        row.style.overflow = 'visible';
        row.classList.remove('_active');
      });
    }
  }

  // Вызываем при загрузке
  handleRows();

  // Обновляем при изменении размера окна
  window.addEventListener('resize', handleRows);

  const hoverSpollers = document.querySelectorAll('.stages__spollers');
  if (hoverSpollers.length) {
    hoverSpollers.forEach(spollerBlock => {
      const items = spollerBlock.querySelectorAll('details');
      items.forEach(item => {
        const title = item.querySelector('summary');
        const content = title.nextElementSibling;

        title.addEventListener('mouseenter', () => {
          if (!item.open) {
            item.open = true;
            title.classList.add('_spoller-active');
            _slideDown(content);
          }
        });
      });
    });
  }
});