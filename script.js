// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const setHeaderHeight = () => {
    if (header) {
      document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    }
  };
  setHeaderHeight();
  window.addEventListener('resize', setHeaderHeight);
  window.addEventListener('orientationchange', setHeaderHeight);

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      setHeaderHeight();
      nav.classList.toggle('open');
      const isOpen = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Animated stat counters
  const nums = document.querySelectorAll('.stat-num[data-count]');
  if (nums.length) {
    const animate = (el) => {
      const target = el.getAttribute('data-count');
      const numeric = parseInt(target.replace(/[^\d]/g, ''), 10);
      const suffix = target.replace(/[\d,]/g, '');
      if (isNaN(numeric)) return;
      let start = 0;
      const duration = 1100;
      const startTime = performance.now();
      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * numeric) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    nums.forEach(el => io.observe(el));
  }

  // Services tabs (services page)
  const tabBtns = document.querySelectorAll('.svc-tab-btn');
  if (tabBtns.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.svc-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');
      });
    });
  }

  // Product category filter (products page)
  const catChecks = document.querySelectorAll('.filter-box [data-filter]');
  const productCards = document.querySelectorAll('.product-card[data-category]');
  const searchBox = document.querySelector('.search-input input');

  function applyFilters() {
    const active = Array.from(catChecks).filter(c => c.checked).map(c => c.dataset.filter);
    const query = (searchBox && searchBox.value || '').trim().toLowerCase();
    productCards.forEach(card => {
      const matchesCategory = active.length === 0 || active.includes(card.dataset.category);
      const matchesSearch = !query || card.dataset.name.toLowerCase().includes(query);
      card.style.display = (matchesCategory && matchesSearch) ? '' : 'none';
    });
  }
  if (catChecks.length) {
    catChecks.forEach(c => c.addEventListener('change', applyFilters));
  }
  if (searchBox) {
    searchBox.addEventListener('input', applyFilters);
  }

  // Inquiry form (contact page)
  const form = document.querySelector('.inquiry-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = document.querySelector('.form-note');
      if (note) {
        note.textContent = 'Thanks — your inquiry has been noted. Our trade desk will reach out within one business day.';
        note.classList.add('show');
      }
      form.reset();
    });
  }
});
