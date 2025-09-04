let items = document.querySelectorAll('.item');
let paginations = document.querySelectorAll('.pagination-block-image');
let currentItem = 0;
let isEnabled = true;


function changeCurrentItem(n) {
  currentItem = (n + items.length) % items.length;
  document.querySelector('.current-number').textContent = (currentItem + 1).toString().padStart(2, '0');
  paginations.forEach(dot => dot.classList.remove('active'));
  paginations[currentItem].classList.add('active');
}

function hideItem(direction) {
  isEnabled = false;
  items[currentItem].classList.add(direction);
  items[currentItem].addEventListener('animationend', function () {
    this.classList.remove('current', direction);
  });
}

function showItem(direction) {
  items[currentItem].classList.add('next', direction);
  items[currentItem].addEventListener('animationend', function () {
    this.classList.remove('next', direction);
    this.classList.add('current');
    isEnabled = true;
  });
}

function previousItem(n) {
  hideItem('to-right');
  changeCurrentItem(n - 1);
  showItem('from-left');
}

function nextItem(n) {
  hideItem('to-left');
  changeCurrentItem(n + 1);
  showItem('from-right');
}

document.querySelector('.prev-arrow').addEventListener('click', function () {
  if (isEnabled) {
    previousItem(currentItem);
  }
});

document.querySelector('.next-arrow').addEventListener('click', function () {
    if (isEnabled) {
      nextItem(currentItem);
    }
  });

paginations.forEach((dot, index) => {
dot.addEventListener('click', () => {
    if (!isEnabled || index === currentItem) return;
    
    const directionOut = index > currentItem ? 'to-left' : 'to-right';
    const directionIn = index > currentItem ? 'from-right' : 'from-left';

    hideItem(directionOut);
    changeCurrentItem(index);
    showItem(directionIn);
  });
});

document.querySelector('.total-amount-number').textContent = items.length.toString().padStart(2, '0');
document.querySelector('.current-number').textContent = (currentItem + 1).toString().padStart(2, '0');

let el = document.querySelector('.carousel');

const swipedetect = (el) => {
    let surface = el;
    let startX = 0;
    let startY = 0;
    let distX = 0;
    let distY = 0;

    let startTime = 0;
    let elapsedTime = 0;

    let threshold = 150;
    let restraint = 100;
    let allowedTime = 1200;

    surface.addEventListener('mousedown', function(e) {
        startX = e.pageX;
        startY = e.pageY;
        startTime = new Date().getTime();
        e.preventDefault();
    })

    surface.addEventListener('mouseup', function(e) {
        distX = e.pageX - startX;
        distY = e.pageY - startY;
        elapsedTime = new Date().getTime() - startTime;
        
        if (elapsedTime <= allowedTime) {
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                if (distX > 0) {
                    if (isEnabled) {
                        previousItem(currentItem)
                    }
                } else {
                    if (isEnabled) {
                        nextItem(currentItem)
                    }
                } 
            }
        }
        e.preventDefault();
    })

    surface.addEventListener('touchstart', function(e) {

        if (e.target.classList.contains('prev-arrow') || e.target.classList.contains('next-arrow')) {
            if (e.target.classList.contains('prev-arrow')) {
                if (isEnabled) {
                        previousItem(currentItem)
                }
            } else if (e.target.classList.contains('next-arrow')) {
                if (isEnabled) {
                        nextItem(currentItem)
                }
            }
        }

        let touchObj = e.changedTouches[0];
        startX = touchObj.pageX;
        startY = touchObj.pageY;
        startTime = new Date().getTime();
        e.preventDefault();
    })

    surface.addEventListener('touchmove', function(e) {
        e.preventDefault();
    })

    surface.addEventListener('touchend', function(e) {
        let touchObj = e.changedTouches[0];
        distX = touchObj.pageX - startX;
        distY = touchObj.pageY - startY;
        elapsedTime = new Date().getTime() - startTime;
        
        if (elapsedTime <= allowedTime) {
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                if (distX > 0) {
                    if (isEnabled) {
                        previousItem(currentItem)
                    }
                } else {
                    if (isEnabled) {
                        nextItem(currentItem)
                    }
                } 
            }
        }
        e.preventDefault();
    })
}

swipedetect(el)



// Explore section comparation pictires
document.addEventListener('DOMContentLoaded', () => {
  const divider = document.getElementById('slider-divider');
  const afterImage = document.querySelector('.after-image');
  const container = document.querySelector('.image-right-block');


function initializeDivider() {
    const rect = container.getBoundingClientRect();
    const initialPosition = rect.width * 0.613889;
    divider.style.left = `${initialPosition}px`;
    afterImage.style.clipPath = `inset(0 0 0 ${initialPosition}px)`;
  }

  window.addEventListener('load', initializeDivider);
  window.addEventListener('resize', initializeDivider);

  let isDragging = false;

  divider.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateDividerPosition(e.clientX);
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  divider.addEventListener('touchstart', (e) => {
    isDragging = true;
    e.preventDefault();
  });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updateDividerPosition(e.touches[0].clientX);
  });

  document.addEventListener('touchend', () => {
    isDragging = false;
  });

  function updateDividerPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    offsetX = Math.max(0, Math.min(offsetX, rect.width));
    const percentage = (offsetX / rect.width) * 100;
    divider.style.left = `${percentage}%`;
    afterImage.style.clipPath = `inset(0 0 0 ${percentage}%)`;
  }
});

//Gallery section

const images = document.querySelectorAll('.gallery .column img, .gallery-mobile .column img, .gallery-mobile-768 .column img, .gallery-mobile-420 .column img');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    const img = entry.target;
    if (entry.isIntersecting) {
      img.style.animationDelay = `${index * 0.1}s`;
      img.classList.add('active-img');
    } else {
      img.classList.remove('active-img');
      img.style.animationDelay = '';
    }
  });
}, {
  threshold: 0.2,
  rootMargin: '50px'
});

images.forEach(img => {
  observer.observe(img);
});

// Tickets section

document.addEventListener("DOMContentLoaded", function () {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZGVycmlsODciLCJhIjoiY21kcWdhc3U3MDZidjJtcHZkcW12NnYxOCJ9.OkF6NDFHgnIszxyUjUyOcw';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [2.3364, 48.86091],
    zoom: 16,
  });

  map.addControl(new mapboxgl.NavigationControl(), 'top-right');

  const markers = [
    [2.3364, 48.86091],
    [2.3333, 48.8602],
    [2.3397, 48.8607],
    [2.3330, 48.8619],
    [2.3365, 48.8625]
  ];

  markers.forEach(coords => {
    const marker = new mapboxgl.Marker({ color: '#000' })
      .setLngLat(coords)
      .addTo(map);

    marker.getElement().addEventListener('click', () => {
      const [lng, lat] = coords;
      const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
      window.open(url, '_blank');
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.querySelector('#popupDate');
  const arrowIcon = document.querySelector('#dateArrow');
  const dateTitle = document.querySelector('#dateTitle');

  const fp = flatpickr(dateInput, {
    dateFormat: "d.m.Y",
    allowInput: false,
    clickOpens: false,
    minDate: "today",

    onChange: function(selectedDates, dateStr, instance) {
      dateTitle.textContent = formatDate(selectedDates[0]);
    },
    onOpen: () => {
      arrowIcon.classList.add('rotate-up');
      arrowIcon.classList.remove('rotate-down');
    },
    onClose: () => {
      arrowIcon.classList.add('rotate-down');
      arrowIcon.classList.remove('rotate-up');
    }
  });

  const today = new Date();
  dateTitle.textContent = formatDate(today);

  let isOpen = false;
  arrowIcon.addEventListener('click', () => {
    isOpen ? fp.close() : fp.open();
    isOpen = !isOpen;
  });

  function formatDate(dateObj) {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const selectHeader = document.getElementById('ticketSelect');
  const optionsList = document.getElementById('selectOptions');
  const arrowIconType = document.getElementById('arrowIconType');
  const selectedOption = document.querySelector('.selected-option');

  selectHeader.addEventListener('click', () => {
    optionsList.style.display = optionsList.style.display === 'block' ? 'none' : 'block';
    arrowIconType.classList.toggle('rotate');
  });

  document.querySelectorAll('#selectOptions li').forEach(option => {
    option.addEventListener('click', () => {
      selectedOption.textContent = option.textContent;
      optionsList.style.display = 'none';
      arrowIconType.classList.remove('rotate');
      const exhibition = document.getElementById('exhibitionType');
      exhibition.textContent = option.textContent;
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
const timeSelectHeader = document.getElementById('timeSelectHeader');
const timeOptionsList = document.getElementById('selectTimeOptions');
const arrowIconTime = document.getElementById('arrowIconTime');

function getCurrentRoundedTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  minutes = minutes < 30 ? '00' : '30';
  hours = hours.toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

const selectedTimeOption = document.querySelector('.selected-time-option');
const overviewTime = document.getElementById('currentTimeTitle');

const initialTime = 'Time';
if (selectedTimeOption) selectedTimeOption.textContent = initialTime;
if (overviewTime) overviewTime.textContent = initialTime;

function toggleTimeDropdown() {
  const list = document.getElementById('selectTimeOptions');
  const arrow = document.getElementById('arrowIconTime');
  const isOpen = list.style.display === 'block';
  list.style.display = isOpen ? 'none' : 'block';
  arrow?.classList.toggle('rotate', !isOpen);
}

document.getElementById('timeSelectHeader')?.addEventListener('click', toggleTimeDropdown);
document.getElementById('arrowIconTime')?.addEventListener('click', toggleTimeDropdown);

document.querySelectorAll('#selectTimeOptions li').forEach(option => {
  option.addEventListener('click', () => {
    const time = option.textContent;

    selectedTimeOption.textContent = time;
    overviewTime.textContent = time;

    localStorage.setItem('selectedTime', time);

    document.getElementById('selectTimeOptions').style.display = 'none';
    document.getElementById('arrowIconTime')?.classList.remove('rotate');
  });
});
});


const cardNumber = document.getElementById('titleNumber');

cardNumber.addEventListener('keypress', (e) => {
  if (!/\d/.test(e.key)) {
    e.preventDefault();
  }
});

cardNumber.addEventListener('input', () => {
  let digitsOnly = cardNumber.value.replace(/\D/g, '');
  digitsOnly = digitsOnly.slice(0, 16);
  const groups = digitsOnly.match(/.{1,4}/g);
  cardNumber.value = groups ? groups.join(' ') : '';
});

const expDate = document.getElementById('blockMonth');
const buttonUp = document.getElementById('buttonGroupUp');
const buttonDown = document.getElementById('buttonGroupDown');

const validMonth = (n) => Number.isInteger(n) && n >= 1 && n <= 12;
const render = () => { expDate.value = String(currentValue).padStart(2, '0'); };

let currentValue = Number(expDate.value);
if (!validMonth(currentValue)) currentValue = 1;
render();

buttonUp.addEventListener('click', () => {
  const next = currentValue + 1;
  if (validMonth(next)) { currentValue = next; render(); }
});

buttonDown.addEventListener('click', () => {
  const next = currentValue - 1;
  if (validMonth(next)) { currentValue = next; render(); }
});

expDate.addEventListener('change', () => {
  const next = Number(expDate.value);
  if (validMonth(next)) { currentValue = next; render(); }
  else { render(); }
});

const expYear = document.getElementById('blockYear');
const buttonYearUp = document.getElementById('yearButtonUp');
const buttonYearDown = document.getElementById('yearButtonDown');
const currentYear = new Date().getFullYear();
let selectedYear = currentYear;
const maxYear = currentYear + 20;

const validYear = (n) => Number.isInteger(n) && n >= currentYear && n <= maxYear;
const renderYear = () => { expYear.value = String(selectedYear)};
renderYear();

buttonYearUp.addEventListener('click', () => {
  const nextYear = selectedYear + 1;
  if (validYear(nextYear)) {selectedYear = nextYear; renderYear();}
})

buttonYearDown.addEventListener('click', () => {
  const nextYear = selectedYear - 1;
  if (validYear(nextYear)) {selectedYear = nextYear; renderYear();}
})

expYear.addEventListener('change', () => {
  const nextYear = Number(expYear.value);
  if (validYear(nextYear)) {selectedYear = nextYear;}
  renderYear();
})

const cvcInput = document.getElementById('cardsCvcInput');

cvcInput.addEventListener('input', () => {
  let value = cvcInput.value.replace(/\D/g, '');

  if (value.length > 4) {
    value = value.slice(0, 4);
  }

  cvcInput.value = value;
});

const inputName = document.getElementById('popupName');
const errorName = document.querySelector('.error__name');

inputName.addEventListener('input', () => {
  let validStr = inputName.value.replace(/[^A-Za-zА-Яа-я\s]/g, '');

  if (validStr.length > 15) {
    validStr = validStr.slice(0, 15);
  }

  if (validStr.length > 0 && validStr.length < 3) {
    errorName.style.display = 'block';
    inputName.classList.add('invalid'); 
  } else {
    errorName.style.display = 'none';
    inputName.classList.remove('invalid');
  }

  inputName.value = validStr;
});

const inputEmail = document.getElementById('popupEmail');
const errorEmail = document.querySelector('.error__email');

const EMAIL_RE = /^[\p{L}0-9_-]{3,15}@[A-Za-z]{4,}\.[A-Za-z]{2,}$/u;

inputEmail.addEventListener('input', () => {
  let value = inputEmail.value.replace(/\s+/g, '');

  const [rawUser = '', rawRest = ''] = value.split('@');

  const user = rawUser.replace(/[^\p{L}0-9_-]/gu, '').slice(0, 15);

  let domain = '';
  let tld = '';
  const hasAt = value.includes('@');
  const hasDot = rawRest.includes('.');
  if (rawRest) {
    const parts = rawRest.split('.', 2);
    domain = (parts[0] || '').replace(/[^A-Za-z]/g, '');
    tld    = (parts[1] || '').replace(/[^A-Za-z]/g, '');
  }

  const composed = user + (hasAt ? '@' : '') + domain + (hasDot ? '.' + tld : '');
  inputEmail.value = composed;

  const ok = EMAIL_RE.test(composed);
  if (composed && !ok) {
    errorEmail.style.display = 'block';
    inputEmail.classList.add('invalid');
  } else {
    errorEmail.style.display = 'none';
    inputEmail.classList.remove('invalid');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const PRICE = {
    'Permanent exhibition': 20,
    'Temporary exhibition': 25,
    'Combined Admission': 40,
  };

  const basicInput  = document.getElementById('basicAmount');
  const seniorInput = document.getElementById('seniorAmount');
  const totalSpan   = document.getElementById('totalAmount');
  const typeRadios  = document.querySelectorAll('input[name="ticket"]');

  const popupPriceInfos = document.querySelectorAll('.popup__price .popup__price_info');
  const popupTotal = document.querySelector('.popup__price_total .total__amount');
  const basicInputModal  = document.getElementById('basicInput');
  const seniorInputModal = document.getElementById('seniorInput');
  const basicButtonMinus = document.getElementById('basicButtonMinus');
  const basicButtonPlus  = document.getElementById('basicButtonPlus');
  const seniorButtonMinus = document.getElementById('seniorButtonMinus');
  const seniorButtonPlus  = document.getElementById('seniorButtonPlus');

  const selectedOptionEl = document.querySelector('.custom-select-header .selected-option');
  const optionsList = document.getElementById('selectOptions');
  const exhibitionEl = document.getElementById('exhibitionType');

  const getType = () => (document.querySelector('input[name="ticket"]:checked')?.value || 'Permanent exhibition');
  const getQ = (el) => Math.max(0, parseInt(el?.value, 10) || 0);
  const euro = (n) => `${n} €`;

  function setQuantities(qB, qS) {
    if (basicInput) basicInput.value = qB;
    if (seniorInput) seniorInput.value = qS;
    if (basicInputModal) basicInputModal.value = qB;
    if (seniorInputModal) seniorInputModal.value = qS;
  }

  function setType(type) {
    typeRadios.forEach(r => r.checked = (r.value === type));
    if (selectedOptionEl) selectedOptionEl.textContent = type;
    if (exhibitionEl) exhibitionEl.textContent = type;
  }

  function updateTotal() {
    const type = getType();
    const unitBasic = PRICE[type];
    const unitSenior = Math.floor(unitBasic / 2);

    const qBasic = getQ(basicInput);
    const qSenior = getQ(seniorInput);

    const sumBasic = qBasic * unitBasic;
    const sumSenior = qSenior * unitSenior;
    const sum = sumBasic + sumSenior;

    if (totalSpan) totalSpan.textContent = (sum);

    if (popupPriceInfos?.length >= 2) {
      const [rowBasic, rowSenior] = popupPriceInfos;

      rowBasic.querySelector('.info__price_amount').textContent = String(qBasic);
      rowBasic.querySelector('.info__price_title').textContent  = `Basic (${euro(unitBasic)})`;
      rowBasic.querySelector('.info__total').textContent        = euro(sumBasic);

      rowSenior.querySelector('.info__price_amount').textContent = String(qSenior);
      rowSenior.querySelector('.info__price_title').textContent  = `Senior (${euro(unitSenior)})`;
      rowSenior.querySelector('.info__total').textContent        = euro(sumSenior);
    }
    if (popupTotal) popupTotal.textContent = euro(sum);

    setQuantities(qBasic, qSenior);

    localStorage.setItem('tickets_state', JSON.stringify({ type, qBasic, qSenior, sum }));
  }

  function restoreState() {
    try {
      const raw = localStorage.getItem('tickets_state');
      if (raw) {
        const { type, qBasic, qSenior } = JSON.parse(raw);
        if (type) setType(type);
        setQuantities(qBasic ?? 0, qSenior ?? 0);
      }
    } finally {
      updateTotal();
    }
  }

  basicInput?.addEventListener('change', updateTotal);
  seniorInput?.addEventListener('change', updateTotal);

  typeRadios.forEach(r => {
    r.addEventListener('change', () => {
      setType(getType());
      updateTotal();
    });
  });

  basicButtonMinus?.addEventListener('click', () => {
    if (+basicInputModal.value > 0) basicInputModal.value = +basicInputModal.value - 1;
    setQuantities(+basicInputModal.value, +seniorInputModal.value);
    updateTotal();
  });
  basicButtonPlus?.addEventListener('click', () => {
    basicInputModal.value = +basicInputModal.value + 1;
    setQuantities(+basicInputModal.value, +seniorInputModal.value);
    updateTotal();
  });
  seniorButtonMinus?.addEventListener('click', () => {
    if (+seniorInputModal.value > 0) seniorInputModal.value = +seniorInputModal.value - 1;
    setQuantities(+basicInputModal.value, +seniorInputModal.value);
    updateTotal();
  });
  seniorButtonPlus?.addEventListener('click', () => {
    seniorInputModal.value = +seniorInputModal.value + 1;
    setQuantities(+basicInputModal.value, +seniorInputModal.value);
    updateTotal();
  });

  basicInputModal?.addEventListener('change', () => {
    setQuantities(+basicInputModal.value, +seniorInputModal.value);
    updateTotal();
  });
  seniorInputModal?.addEventListener('change', () => {
    setQuantities(+basicInputModal.value, +seniorInputModal.value);
    updateTotal();
  });

  optionsList?.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    const label = li.textContent.trim();
    setType(label);
    updateTotal();
    optionsList.style.display = 'none';
  });

  restoreState();

  window.updateTotal = updateTotal;
});

