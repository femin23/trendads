/**
 * TRENDADS DIGITAL MARKETING - CLIENT SCRIPTS
 * Modules:
 *  0. Site Preloader & Rapid 3D Icon Cycler
 *  1. Hero Fluid Vector Flow Grid Canvas
 *  2. Lucide Icons Initializer
 *  3. Mobile Navigation & Scroll State Observer
 *  4. Editorial Filmstrip Carousel (Services Section)
 *  5. Interactive Modals (Services, Board Members, Process Steps, About Features)
 *  6. Toast Notification System
 *  7. WhatsApp Direct Contact Form
 */

// 0. Site Preloader & Rapid 3D Icon Cycler
(function initPreloaderCycler() {
  const cyclerImg = document.getElementById('cyclerImg');
  const iconPaths = [
    'assets/icons/3d/1.png',
    'assets/icons/3d/2.png',
    'assets/icons/3d/3.png',
    'assets/icons/3d/4.png',
    'assets/icons/3d/5.png',
    'assets/icons/3d/6.png',
    'assets/icons/3d/7.png',
    'assets/icons/3d/8.png',
    'assets/icons/instagram.png',
    'assets/icons/whatsapp.png',
    'assets/icons/linkedin.png',
    'assets/icons/facebook.png'
  ];

  let currentIndex = 0;
  let cycleInterval = null;

  if (cyclerImg) {
    cycleInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % iconPaths.length;
      cyclerImg.src = iconPaths[currentIndex];
      cyclerImg.classList.remove('pulse-swap');
      void cyclerImg.offsetWidth;
      cyclerImg.classList.add('pulse-swap');
    }, 140);
  }

  window.addEventListener('load', () => {
    const preloader = document.getElementById('sitePreloader');
    const progress = document.getElementById('preloaderProgress');
    if (progress) {
      progress.style.width = '100%';
    }
    setTimeout(() => {
      if (cycleInterval) clearInterval(cycleInterval);
      if (preloader) {
        preloader.classList.add('preloader-hidden');
      }
    }, 500);
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  // 1. Hero Fluid Vector Flow Grid Canvas
  function initHeroFluidCanvas() {
    const canvas = document.getElementById('heroFluidCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let time = 0;

    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    const handleResize = () => {
      const heroSection = document.getElementById('home') || canvas.parentElement;
      const rect = heroSection ? heroSection.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    handleResize();

    const render = () => {
      if (window.innerWidth < 768) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      time += 0.008;

      // Mouse smooth interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const spacing = 35;
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      ctx.lineWidth = 1.4;

      const lineBaseColor = '37, 99, 235';
      const accentBlue = '59, 130, 246';

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;

          let angle = Math.sin(x * 0.003 + time) + Math.cos(y * 0.003 + time);

          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let isNear = false;
          if (dist < 220 && dist > 0) {
            isNear = true;
            const pushAngle = Math.atan2(dy, dx) + Math.PI;
            const force = (1 - dist / 220);
            angle = angle * (1 - force) + pushAngle * force;
          }

          const lineLen = isNear ? 22 : 14;
          const x2 = x + Math.cos(angle) * lineLen;
          const y2 = y + Math.sin(angle) * lineLen;

          const alpha = isNear
            ? 0.75
            : (0.12 + Math.sin(x * 0.01 + y * 0.01 + time) * 0.08);

          ctx.strokeStyle = isNear
            ? `rgba(${accentBlue}, ${alpha})`
            : `rgba(${lineBaseColor}, ${alpha})`;

          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
  }

  initHeroFluidCanvas();

  // 2. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 3. Navbar Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.setAttribute('data-lucide', 'x');
      } else {
        icon.setAttribute('data-lucide', 'menu');
      }
      if (window.lucide) window.lucide.createIcons();
    });

    // Close menu when clicking link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 4. Navbar Active State & Dynamic Visibility on Scroll
  const sections = document.querySelectorAll('section[id], .services-scroll-pin-wrapper[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mainHeader = document.getElementById('header');
  const servicesPinWrapper = document.getElementById('services');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    // Hide main navbar while inside the Services section, show before and after
    if (mainHeader && servicesPinWrapper) {
      const rect = servicesPinWrapper.getBoundingClientRect();
      if (rect.top <= 60 && rect.bottom >= 60) {
        mainHeader.classList.add('navbar-hidden');
      } else {
        mainHeader.classList.remove('navbar-hidden');
      }
    }
  }, { passive: true });

  // 5. Global Modal Handling & Service Detail Data
  const serviceDetails = {
    branding: {
      title: "Branding & Identity",
      iconImg: "assets/services/branding-card.png",
      desc: "Perfect for businesses looking to build a strong, memorable, and professional brand identity.",
      features: [
        "Logo Design",
        "Brand Identity Development",
        "Brand Color Palette",
        "Typography Selection",
        "Brand Guidelines",
        "Business Card Design",
        "Letterhead Design",
        "Social Media Profile Branding",
        "Brand Asset Kit"
      ]
    },
    marketing: {
      title: "Digital Marketing",
      iconImg: "assets/services/digital-marketing-card.png",
      desc: "Designed to help businesses grow their online presence, engage audiences, and generate quality leads.",
      features: [
        "Social Media Management",
        "Content Strategy Planning",
        "Creative Post Designs",
        "Reel & Short Video Content",
        "Meta (Facebook & Instagram) Ad Management",
        "Google Business Profile Optimization",
        "Community Engagement Support",
        "Monthly Performance Report"
      ]
    },
    web: {
      title: "Website Development",
      iconImg: "assets/services/website-card.png",
      desc: "Custom high-performance websites engineered for rapid conversions, responsiveness, and business growth.",
      features: [
        "Custom Website Design",
        "Mobile-Friendly Development",
        "Basic UI/UX Design",
        "Contact Form Integration",
        "WhatsApp Integration",
        "Basic SEO Setup",
        "Google Analytics Setup",
        "Website Launch Support",
        "Domain & Hosting Architecture Support"
      ]
    },
    growth: {
      title: "Complete Digital Growth",
      iconImg: "assets/services/complete-card.png",
      desc: "An all-in-one complete solution for businesses looking to establish, market, and grow their brand online.",
      features: [
        "Complete Branding & Identity Kit",
        "Full Custom Website Development",
        "Social Media & Content Strategy",
        "Meta & Google Ad Management",
        "Google Business Profile & Local SEO",
        "WhatsApp & Lead Funnel Integrations",
        "Community Engagement & Monthly Reports",
        "Domain & Hosting Launch Setup"
      ]
    },
    software: {
      title: "Software Development",
      iconImg: "assets/services/software-card.png",
      desc: "Tailored enterprise software, custom web applications, SaaS platforms, and intelligent business automations.",
      features: [
        "Custom Web Application Development",
        "SaaS Product Engineering",
        "API Development & Third-Party Integrations",
        "CRM & Business Tool Automation",
        "Database Architecture & Optimization",
        "Security Hardening & QA Testing",
        "Cloud Deployment & Maintenance"
      ]
    }
  };

  const modal = document.getElementById('infoModal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');

  function openModal(htmlContent) {
    if (!modal || !modalBody) return;
    modalBody.innerHTML = htmlContent;
    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  function closeModal() {
    if (modal) modal.classList.remove('active');
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  function triggerServiceModal(serviceKey) {
    const data = serviceDetails[serviceKey];
    if (!data) return;
    const contentHtml = `
      <div style="text-align: left;">
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
          <div style="width: 56px; height: 56px; border-radius: 14px; background: var(--primary-light); display: flex; align-items: center; justify-content: center; padding: 6px;">
            <img src="${data.iconImg}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: contain;">
          </div>
          <h3 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800;">${data.title}</h3>
        </div>
        <p style="color: var(--text-muted); font-size: 1.05rem; margin-bottom: 24px; line-height: 1.6;">${data.desc}</p>
        <h4 style="font-family: var(--font-heading); font-size: 1rem; font-weight: 700; margin-bottom: 12px;">What We Deliver:</h4>
        <ul style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px;">
          ${data.features.map(f => `
            <li style="display: flex; align-items: center; gap: 10px; font-size: 0.95rem; color: var(--text-dark);">
              <i data-lucide="check-circle-2" style="width: 18px; color: var(--accent-green);"></i>
              ${f}
            </li>
          `).join('')}
        </ul>
        <a href="#contact" onclick="document.getElementById('infoModal').classList.remove('active')" class="btn btn-primary btn-block">
          Request a Proposal <i data-lucide="arrow-right" class="btn-icon"></i>
        </a>
      </div>
    `;
    openModal(contentHtml);
  }

  // 6. Editorial Filmstrip Carousel for Services
  (function initEditorialCarousel() {
    const container = document.getElementById('servicesEditorialCarousel');
    if (!container) return;

    const servicesList = [
      {
        id: "branding",
        title: "Branding &\nIdentity",
        highlight: "Build a strong, memorable, and category-defining visual brand identity that commands market authority.",
        stats: "9 DELIVERABLES &bull; 100% VECTOR KITS &bull; GUIDELINES",
        image: "assets/services/branding-card.png",
        bgImage: "assets/services/branding-bg.png",
        credit: "BY TRENDADS BRANDING",
        meta: ["LOGO DESIGN", "BRAND GUIDELINES", "ASSET KIT"],
        accent: "#7b61ff"
      },
      {
        id: "marketing",
        title: "Digital\nMarketing",
        highlight: "Grow your online presence, capture high-intent leads, and dominate feeds with targeted Meta & Google ad campaigns.",
        stats: "8 LEAD CHANNELS &bull; META ADS &bull; MONTHLY REPORTS",
        image: "assets/services/digital-marketing-card.png",
        bgImage: "assets/services/digital-marketing-bg.png",
        credit: "BY TRENDADS MARKETING",
        meta: ["LEAD GENERATION", "META ADS", "CONTENT STRATEGY"],
        accent: "#ff2f9c"
      },
      {
        id: "web",
        title: "Website\nDevelopment",
        highlight: "Custom high-performance web applications engineered for rapid loading, seamless UX, and high conversion rates.",
        stats: "TURNKEY LAUNCH &bull; WHATSAPP & FORMS &bull; SEO READY",
        image: "assets/services/website-card.png",
        bgImage: "assets/services/website-bg.png",
        credit: "BY TRENDADS WEB",
        meta: ["CUSTOM DESIGN", "RESPONSIVE UI/UX", "WHATSAPP SETUP"],
        accent: "#00c8ff"
      },
      {
        id: "growth",
        title: "Complete Digital\nGrowth",
        highlight: "An all-in-one powerhouse solution combining full Branding, custom Website Development, and high-impact Digital Marketing.",
        stats: "360° COMPLETE BUNDLE &bull; BRANDING + WEB + ADS",
        image: "assets/services/complete-card.png",
        bgImage: "assets/services/complete-bg.png",
        credit: "ALL-IN-ONE GROWTH BUNDLE",
        meta: ["FULL BRANDING", "CUSTOM WEB", "PERFORMANCE ADS"],
        accent: "#ff4114"
      },
      {
        id: "software",
        title: "Software\nDevelopment",
        highlight: "Tailored enterprise software, custom SaaS platforms, API integrations, and business automation systems engineered to scale.",
        stats: "SCALABLE ARCHITECTURE &bull; CUSTOM SAAS &bull; API & CRM",
        image: "assets/services/software-card.png",
        bgImage: "assets/services/software-bg.png",
        credit: "BY TRENDADS ENGINEERING",
        meta: ["CUSTOM SAAS", "API INTEGRATIONS", "SCALABLE APPS"],
        accent: "#10b981"
      }
    ];

    const bgImgA = document.getElementById('ecBgImgA') || document.getElementById('ecBgImg');
    const bgImgB = document.getElementById('ecBgImgB');
    let activeBgEl = bgImgA;
    let inactiveBgEl = bgImgB;
    const bgTintColor = document.getElementById('ecBgTintColor');
    const bgTintMultiply = document.getElementById('ecBgTintMultiply');

    // Preload background & card images for instant transitions
    servicesList.forEach(item => {
      if (item.bgImage) {
        const img = new Image();
        img.src = item.bgImage;
      }
      if (item.image) {
        const img = new Image();
        img.src = item.image;
      }
    });
    const titleText = document.getElementById('ecTitleText');
    const creditText = document.getElementById('ecCreditText');
    const highlightDesc = document.getElementById('ecHighlightDesc');
    const statsBadge = document.getElementById('ecStatsBadge');
    const metaPills = document.getElementById('ecMetaPills');
    const track = document.getElementById('ecStripTrack');
    const railThumb = document.getElementById('ecRailThumb');
    const indexCurrent = document.getElementById('ecIndexCurrent');
    const indexTotal = document.getElementById('ecIndexTotal');
    const prevBtn = document.getElementById('ecPrevBtn');
    const nextBtn = document.getElementById('ecNextBtn');

    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationId = 0;

    let boxWidth = container.clientWidth || 1000;
    let boxHeight = container.clientHeight || 680;
    let fullH = 260;
    let halfH = 130;
    let cardW = 195;
    let gap = 16;
    let step = cardW + gap;

    function measureLayout() {
      boxWidth = container.clientWidth || window.innerWidth || 1200;
      boxHeight = container.clientHeight || window.innerHeight || 700;
      const isMobile = boxWidth < 600;
      const isTablet = boxWidth < 992;

      if (isMobile) {
        cardW = Math.min(270, Math.max(200, Math.round(boxWidth * 0.58)));
        fullH = Math.round(cardW * 1.30);
        halfH = Math.round(fullH * 0.60);
        gap = 14;
      } else if (isTablet) {
        fullH = Math.min(360, Math.max(240, Math.round(boxHeight * 0.38)));
        halfH = Math.round(fullH * 0.54);
        cardW = Math.round(fullH * 0.74);
        gap = 16;
      } else {
        fullH = Math.min(420, Math.max(270, Math.round(boxHeight * 0.42)));
        halfH = Math.round(fullH * 0.52);
        cardW = Math.round(fullH * 0.75);
        gap = Math.max(16, Math.round(cardW * 0.08));
      }
      step = cardW + gap;
    }

    function xFor(index) {
      return boxWidth / 2 - (index * step + cardW / 2);
    }

    function renderCards() {
      if (!track) return;
      track.innerHTML = '';
      servicesList.forEach((item, i) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = `ec-card-item ${i === currentIndex ? 'is-active' : ''}`;
        card.setAttribute('aria-label', item.title.replace(/\n/g, ' '));
        card.setAttribute('data-index', i);
        card.style.width = `${cardW}px`;
        card.style.height = `${i === currentIndex ? fullH : halfH}px`;
        card.style.setProperty('--item-accent', item.accent);

        card.innerHTML = `
          <img src="${item.image}" alt="${item.title}" class="ec-card-img" draggable="false">
          <span class="ec-card-dim"></span>
          <div class="ec-card-badge">
            <span class="ec-card-badge-title">${item.title.replace(/\n/g, ' ')}</span>
            <span class="ec-card-badge-num">${String(i + 1).padStart(2, '0')}</span>
          </div>
        `;

        card.addEventListener('click', () => {
          if (isDragging) return;
          if (currentIndex === i) {
            triggerServiceModal(item.id);
          } else {
            goToIndex(i);
          }
        });

        track.appendChild(card);
      });
    }

    function updateCardsGeometry() {
      const cards = track.querySelectorAll('.ec-card-item');
      cards.forEach((card, i) => {
        card.style.width = `${cardW}px`;
        card.style.height = `${i === currentIndex ? fullH : halfH}px`;
        if (i === currentIndex) {
          card.classList.add('is-active');
        } else {
          card.classList.remove('is-active');
        }
      });
    }

    function goToIndex(nextIndex) {
      const last = servicesList.length - 1;
      currentIndex = Math.max(0, Math.min(last, nextIndex));
      const active = servicesList[currentIndex];

      // Update background with smooth crossfade & hue transition
      if (active) {
        const targetBg = active.bgImage || active.image;
        if (inactiveBgEl && activeBgEl) {
          if (activeBgEl.getAttribute('data-src') !== targetBg) {
            inactiveBgEl.src = targetBg;
            inactiveBgEl.setAttribute('data-src', targetBg);
            inactiveBgEl.classList.add('is-active');
            activeBgEl.classList.remove('is-active');

            const temp = activeBgEl;
            activeBgEl = inactiveBgEl;
            inactiveBgEl = temp;
          }
        } else if (activeBgEl) {
          activeBgEl.src = targetBg;
          activeBgEl.classList.add('is-active');
        }

        if (bgTintColor) bgTintColor.style.backgroundColor = active.accent;
        if (bgTintMultiply) bgTintMultiply.style.backgroundColor = active.accent;
      }

      // Update Headline with animated wipe
      if (titleText && active) {
        titleText.classList.add('wipe-enter');
        titleText.innerHTML = active.title.split('\n').map(l => `<span style="display:block">${l}</span>`).join('');
        requestAnimationFrame(() => {
          setTimeout(() => {
            titleText.classList.remove('wipe-enter');
          }, 30);
        });
      }

      if (creditText && active) {
        creditText.textContent = active.credit;
      }

      if (highlightDesc && active) {
        highlightDesc.style.opacity = '0';
        highlightDesc.style.transform = 'translateY(6px)';
        setTimeout(() => {
          highlightDesc.innerHTML = active.highlight;
          highlightDesc.style.opacity = '1';
          highlightDesc.style.transform = 'translateY(0)';
        }, 120);
      }

      if (statsBadge && active) {
        statsBadge.innerHTML = active.stats;
      }

      if (metaPills && active) {
        metaPills.innerHTML = active.meta.map(m => `<span class="ec-meta-pill">${m}</span>`).join('');
      }

      // Position rail counters
      if (indexCurrent) indexCurrent.textContent = String(currentIndex + 1).padStart(2, '0');
      if (indexTotal) indexTotal.textContent = String(servicesList.length).padStart(2, '0');
      if (railThumb) {
        railThumb.style.width = `${100 / servicesList.length}%`;
        railThumb.style.left = `${(currentIndex / servicesList.length) * 100}%`;
      }

      // Update card active heights
      updateCardsGeometry();

      // Track positioning
      const targetX = xFor(currentIndex);
      currentTranslate = targetX;
      prevTranslate = targetX;
      if (track) {
        track.style.transform = `translateX(${targetX}px)`;
      }

      if (window.lucide) window.lucide.createIcons();
    }

    // Measure and render on init
    measureLayout();
    renderCards();
    goToIndex(0);

    // Resize Observer for dynamic stage adaptation
    const ro = new ResizeObserver(() => {
      measureLayout();
      updateCardsGeometry();
      goToIndex(currentIndex);
    });
    ro.observe(container);

    // Pin wrapper for scroll-driven progression
    const pinWrapper = document.getElementById('services');
    let isProgrammaticScroll = false;
    const startBuffer = 0.08;
    const endBuffer = 0.92;

    function syncScrollWithIndex(index) {
      if (!pinWrapper) return;
      const rect = pinWrapper.getBoundingClientRect();
      const wrapperTop = window.scrollY + rect.top;
      const totalScrollable = pinWrapper.offsetHeight - window.innerHeight;
      if (totalScrollable > 0) {
        isProgrammaticScroll = true;
        const progressSlice = startBuffer + (index / (servicesList.length - 1)) * (endBuffer - startBuffer);
        const targetScroll = wrapperTop + progressSlice * totalScrollable;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        setTimeout(() => { isProgrammaticScroll = false; }, 500);
      }
    }

    // Scroll listener: Drives carousel progression only when section is centered on screen
    window.addEventListener('scroll', () => {
      if (isProgrammaticScroll || isDragging || !pinWrapper) return;
      const rect = pinWrapper.getBoundingClientRect();
      const totalScrollable = pinWrapper.offsetHeight - window.innerHeight;

      if (totalScrollable <= 0) return;

      if (rect.top > 0) {
        if (currentIndex !== 0) goToIndex(0);
        return;
      }

      if (rect.bottom < window.innerHeight) {
        if (currentIndex !== servicesList.length - 1) goToIndex(servicesList.length - 1);
        return;
      }

      const scrollDist = -rect.top;
      const rawProgress = Math.max(0, Math.min(1, scrollDist / totalScrollable));

      let activeProgress = 0;
      if (rawProgress < startBuffer) {
        activeProgress = 0;
      } else if (rawProgress > endBuffer) {
        activeProgress = 1;
      } else {
        activeProgress = (rawProgress - startBuffer) / (endBuffer - startBuffer);
      }

      const targetIndex = Math.min(servicesList.length - 1, Math.floor(activeProgress * servicesList.length));
      if (targetIndex !== currentIndex) {
        goToIndex(targetIndex);
      }
    }, { passive: true });

    // Prev / Next button listeners
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const prev = currentIndex === 0 ? servicesList.length - 1 : currentIndex - 1;
        goToIndex(prev);
        syncScrollWithIndex(prev);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const next = currentIndex === servicesList.length - 1 ? 0 : currentIndex + 1;
        goToIndex(next);
        syncScrollWithIndex(next);
      });
    }

    // Touch & Drag Handling for Filmstrip Track
    function setTrackPosition() {
      if (track) track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function getPositionX(e) {
      return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    function touchStart(e) {
      isDragging = true;
      startX = getPositionX(e);
      if (track) track.classList.add('is-dragging');
      animationId = requestAnimationFrame(animationLoop);
    }

    function touchMove(e) {
      if (!isDragging) return;
      const currentX = getPositionX(e);
      const diff = currentX - startX;
      currentTranslate = prevTranslate + diff;
    }

    function touchEnd() {
      if (!isDragging) return;
      isDragging = false;
      cancelAnimationFrame(animationId);
      if (track) track.classList.remove('is-dragging');

      const movedBy = currentTranslate - prevTranslate;
      const thrown = currentTranslate + movedBy * 0.3;
      const nearestIdx = Math.round((boxWidth / 2 - thrown - cardW / 2) / step);
      const clampedIdx = Math.max(0, Math.min(servicesList.length - 1, nearestIdx));
      goToIndex(clampedIdx);
      syncScrollWithIndex(clampedIdx);
    }

    function animationLoop() {
      setTrackPosition();
      if (isDragging) requestAnimationFrame(animationLoop);
    }

    if (track) {
      track.addEventListener('mousedown', touchStart);
      window.addEventListener('mousemove', touchMove);
      window.addEventListener('mouseup', touchEnd);

      track.addEventListener('touchstart', touchStart, { passive: true });
      window.addEventListener('touchmove', touchMove, { passive: true });
      window.addEventListener('touchend', touchEnd);
    }

    // Keyboard Arrow Keys
    container.addEventListener('keydown', (e) => {
      const last = servicesList.length - 1;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = Math.max(0, currentIndex - 1);
        goToIndex(prev);
        syncScrollWithIndex(prev);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = Math.min(last, currentIndex + 1);
        goToIndex(next);
        syncScrollWithIndex(next);
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToIndex(0);
        syncScrollWithIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToIndex(last);
        syncScrollWithIndex(last);
      }
    });
  })();

  // 7. Board Member Data & Modal Handling
  const boardMemberDetails = {
    neeraj: {
      name: "Neeraj Sudheer",
      role: "Founder & CEO",
      img: "assets/board/neeraj.png",
      bio: "Visionary founder steering TrendAds with strategic foresight, brand innovation, and exponential digital transformation architectures."
    },
    anumole: {
      name: "Anumole A",
      role: "Mentor & Strategic Advisor",
      img: "assets/board/anumole.png",
      bio: "Guides overarching company vision, executive mentoring, institutional strategy, and scalable enterprise governance."
    },
    nishad: {
      name: "Nishad. S",
      role: "Chief Operating Officer",
      img: "assets/board/nishad.png",
      bio: "Directs operational workflows, cross-functional delivery frameworks, quality assurance, and organizational growth systems."
    },
    vismay: {
      name: "Vismay V J",
      role: "CMO - Chief Marketing Officer",
      img: "assets/board/vismay.png",
      bio: "Spearheads omnichannel growth, performance marketing engines, media buying campaigns, and global brand equity."
    },
    nithin: {
      name: "Nithinkumar ks",
      role: "Creative Director",
      img: "assets/board/nithin.png",
      bio: "Leads artistic vision, high-concept brand aesthetics, multi-platform design direction, and visual storytelling."
    },
    alka: {
      name: "Alka Manoj",
      role: "Head of Content & Creative",
      img: "assets/board/alka.png",
      bio: "Drives content architecture, creative storytelling, multimedia production, and engaging viral brand narratives."
    },
    sreerag: {
      name: "Sreerag P.P",
      role: "Creative Head",
      img: "assets/board/sreerag.png",
      bio: "Crafts breakthrough visual identities, experiential graphic designs, UI assets, and creative campaign systems."
    },
    parveen: {
      name: "Parveen Musthafa",
      role: "Marketing Manager",
      img: "assets/board/parveen.png",
      bio: "Manages digital campaign execution, lead funnels, social community engagement, and ROI performance tracking."
    }
  };

  // Card click event to open individual member modal
  document.querySelectorAll('.team-card[data-member]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.team-social-link')) return;
      const key = card.getAttribute('data-member');
      const m = boardMemberDetails[key];
      if (m) {
        const memberHtml = `
          <div style="text-align: center; padding: 10px 0;">
            <div style="width: 120px; height: 120px; margin: 0 auto 16px auto; border-radius: 50%; overflow: hidden; border: 3px solid var(--primary); box-shadow: 0 10px 25px rgba(37,99,235,0.2);">
              <img src="${m.img}" alt="${m.name}" style="width: 100%; height: 100%; object-fit: cover; object-position: top center;">
            </div>
            <h3 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; margin-bottom: 4px; color: var(--text-dark);">${m.name}</h3>
            <span style="display: inline-block; font-size: 0.85rem; color: var(--primary); font-weight: 700; background: var(--bg-pill); padding: 4px 14px; border-radius: 999px; margin-bottom: 16px;">${m.role}</span>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px; max-width: 440px; margin-left: auto; margin-right: auto;">${m.bio}</p>
            <a href="#contact" onclick="document.getElementById('infoModal').classList.remove('active')" class="btn btn-primary btn-pill">
              Get in Touch <i data-lucide="arrow-right" class="btn-icon"></i>
            </a>
          </div>
        `;
        openModal(memberHtml);
      }
    });
  });

  // 8. Process Step Interactive Modal Details
  const processStepDetails = {
    '1': {
      num: '01',
      title: 'Discover & Strategic Audit',
      badge: 'Step 01 • Business & Market Discovery',
      accentColor: '#2563eb',
      accentBg: 'rgba(37, 99, 235, 0.1)',
      img: 'assets/icons/3d/5.png',
      desc: 'Before launching any campaign, we immerse ourselves in your business ecosystem. We analyze your brand identity, current performance bottlenecks, competitors, and exact customer buying journey to build an unbeatable strategic foundation.',
      deliverables: [
        'Comprehensive Brand & Digital Footprint Audit',
        'Competitor Landscape & Market Gap Analysis',
        'Ideal Customer Profile (ICP) & Intent Mapping',
        'Clear Growth KPIs, Milestones & Timeline Plan'
      ]
    },
    '2': {
      num: '02',
      title: 'Strategic Planning & Campaign Architecture',
      badge: 'Step 02 • Tailored Growth Strategy',
      accentColor: '#10b981',
      accentBg: 'rgba(16, 185, 129, 0.1)',
      img: 'assets/icons/3d/4.png',
      desc: 'We architect an omnichannel, high-converting digital blueprint engineered specifically for your business goals. Every channel, creative asset, and dollar spent is planned with mathematical precision for maximum ROI.',
      deliverables: [
        'Custom Conversion Funnel & Wireframe Strategy',
        'High-Converting Ad Angles & Content Calendar',
        'Omnichannel Selection: Meta, Google, SEO & Web',
        'ROI Projections, Budget Split & Target ROAS'
      ]
    },
    '3': {
      num: '03',
      title: 'Precision Execution & Creative Launch',
      badge: 'Step 03 • Creative & Technical Launch',
      accentColor: '#f97316',
      accentBg: 'rgba(249, 115, 22, 0.1)',
      img: 'assets/icons/3d/6.png',
      desc: 'Our specialist creative and tech team deploys lightning-fast web applications, high-converting ad visuals, compelling copywriting, and enterprise-grade tracking systems ready for rapid launch.',
      deliverables: [
        'Custom Web & Landing Page Development',
        'High-Impact Graphic Design, Video Ads & Ad Copy',
        'Server-Side Tracking: GA4, Meta CAPI & Pixel Setup',
        'Multivariate A/B Testing & Audience Setup'
      ]
    },
    '4': {
      num: '04',
      title: 'Performance Analysis & Exponential Scaling',
      badge: 'Step 04 • Optimization & Scaling',
      accentColor: '#ec4899',
      accentBg: 'rgba(236, 72, 153, 0.1)',
      img: 'assets/icons/3d/3.png',
      desc: 'Launch is just day one. We continuously analyze real-time conversion metrics, eliminate ad waste, optimize conversion rates, and aggressively scale profitable campaigns to dominate your market.',
      deliverables: [
        'Daily Bid & Budget Optimization for Highest ROAS',
        'Conversion Rate Optimization (CRO) & Heatmap Tuning',
        'Transparent Weekly & Monthly ROI Reporting',
        'Aggressive Scaling of Winning Ad Creatives & Channels'
      ]
    }
  };

  const processSteps = document.querySelectorAll('.process-step');
  processSteps.forEach((stepEl) => {
    stepEl.addEventListener('click', () => {
      const stepKey = stepEl.getAttribute('data-step') || '1';
      const step = processStepDetails[stepKey];
      if (step) {
        const stepHtml = `
          <div style="text-align: center; padding: 4px 0;">
            <div style="width: 68px; height: 68px; margin: 0 auto 12px auto; border-radius: 50%; background: ${step.accentBg}; border: 3px solid ${step.accentColor}; display: flex; align-items: center; justify-content: center; padding: 12px; box-shadow: 0 10px 24px rgba(0,0,0,0.1);">
              <img src="${step.img}" alt="${step.title}" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
            <span style="display: inline-block; font-size: 0.75rem; color: ${step.accentColor}; font-weight: 800; background: ${step.accentBg}; padding: 4px 14px; border-radius: 999px; margin-bottom: 10px; font-family: var(--font-heading); letter-spacing: 0.04em;">
              ${step.badge}
            </span>
            <h3 style="font-family: var(--font-heading); font-size: clamp(1.25rem, 5vw, 1.45rem); font-weight: 800; margin-bottom: 10px; color: var(--text-dark); line-height: 1.25;">
              ${step.title}
            </h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.55; margin-bottom: 16px; max-width: 460px; margin-left: auto; margin-right: auto; text-align: center;">
              ${step.desc}
            </p>
            
            <div style="text-align: left; background: var(--bg-alt); padding: 14px 16px; border-radius: 14px; border: 1px solid rgba(226, 232, 240, 0.9); margin-bottom: 20px; max-width: 460px; margin-left: auto; margin-right: auto;">
              <h4 style="font-family: var(--font-heading); font-size: 0.82rem; font-weight: 800; color: var(--text-dark); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">
                Key Actions &amp; Deliverables:
              </h4>
              <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 7px;">
                ${step.deliverables.map(d => `
                  <li style="display: flex; align-items: flex-start; gap: 8px; font-size: 0.84rem; color: var(--text-dark); line-height: 1.35;">
                    <span style="color: ${step.accentColor}; font-weight: 800; font-size: 0.95rem; line-height: 1;">✓</span>
                    <span>${d}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <a href="#contact" onclick="document.getElementById('infoModal').classList.remove('active')" class="btn btn-primary btn-pill btn-block" style="max-width: 280px; margin: 0 auto; justify-content: center;">
              Start This Process <i data-lucide="arrow-right" class="btn-icon"></i>
            </a>
          </div>
        `;
        openModal(stepHtml);
      }
    });

    stepEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        stepEl.click();
      }
    });
  });

  // 9. About Us Feature Cards Interactive Modal Details
  const aboutFeatureDetails = {
    'results': {
      title: 'Results-Driven Strategies',
      badge: 'Why Choose TrendAds • Performance Focus',
      accentColor: '#2563eb',
      accentBg: 'rgba(37, 99, 235, 0.1)',
      img: 'assets/icons/3d/5.png',
      desc: 'We prioritize tangible business outcomes over vanity metrics. Every marketing campaign, digital ad, and custom web application we build is strictly aligned with your target revenue, quality lead generation, and long-term business scalability.',
      deliverables: [
        'Clear ROI milestones and revenue targets defined upfront',
        'Full-funnel customer acquisition tracking & attribution',
        'Continuous Conversion Rate Optimization (CRO)',
        'Transparent weekly & monthly ROI performance reports'
      ]
    },
    'team': {
      title: 'Creative & Experienced Team',
      badge: 'Our Core Strength • Industry Experts',
      accentColor: '#8b5cf6',
      accentBg: 'rgba(139, 92, 246, 0.1)',
      img: 'assets/icons/3d/8.png',
      desc: 'Our team unites award-winning creative directors, full-stack web developers, certified Meta & Google ad specialists, and high-conversion copywriters with proven experience across diverse industries.',
      deliverables: [
        'Dedicated multidisciplinary specialists for your brand',
        'High-converting visual designs, motion graphics & video ads',
        'Next-generation responsive UI/UX and web app development',
        'Direct access to campaign strategists & senior project leads'
      ]
    },
    'data': {
      title: 'Data-Backed Decisions',
      badge: 'Precision Engineering • Analytics & Insight',
      accentColor: '#10b981',
      accentBg: 'rgba(16, 185, 129, 0.1)',
      img: 'assets/icons/3d/4.png',
      desc: 'No guesswork, no intuition-only marketing. We utilize advanced web analytics, server-side tracking (GA4, CAPI), heatmaps, and continuous multivariate A/B testing to optimize your ad spend with mathematical precision.',
      deliverables: [
        'Real-time conversion tracking & custom attribution modeling',
        'Deep competitor intelligence & market gap analysis',
        'User session recordings & conversion friction elimination',
        'Budget allocation steered by actual customer Lifetime Value (LTV)'
      ]
    },
    'client': {
      title: 'Client-First Approach',
      badge: 'Client Partnership • Dedicated Support',
      accentColor: '#f97316',
      accentBg: 'rgba(249, 115, 22, 0.1)',
      img: 'assets/icons/3d/1.png',
      desc: 'We treat your business as our own. We maintain open communication channels, provide honest strategic guidance, offer flexible scaling options, and guarantee rapid turnarounds on all creative and technical requests.',
      deliverables: [
        'Fast WhatsApp & Email priority responses',
        'Customized growth strategies tailored to your exact budget',
        '100% full ownership of all creative assets and accounts',
        'Honest consulting and proactive quarterly growth roadmaps'
      ]
    }
  };

  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach((cardEl) => {
    cardEl.addEventListener('click', () => {
      const featKey = cardEl.getAttribute('data-feature');
      const feat = aboutFeatureDetails[featKey];
      if (feat) {
        const featHtml = `
          <div style="text-align: center; padding: 4px 0;">
            <div style="width: 68px; height: 68px; margin: 0 auto 12px auto; border-radius: 50%; background: ${feat.accentBg}; border: 3px solid ${feat.accentColor}; display: flex; align-items: center; justify-content: center; padding: 12px; box-shadow: 0 10px 24px rgba(0,0,0,0.1);">
              <img src="${feat.img}" alt="${feat.title}" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
            <span style="display: inline-block; font-size: 0.75rem; color: ${feat.accentColor}; font-weight: 800; background: ${feat.accentBg}; padding: 4px 14px; border-radius: 999px; margin-bottom: 10px; font-family: var(--font-heading); letter-spacing: 0.04em;">
              ${feat.badge}
            </span>
            <h3 style="font-family: var(--font-heading); font-size: clamp(1.25rem, 5vw, 1.45rem); font-weight: 800; margin-bottom: 10px; color: var(--text-dark); line-height: 1.25;">
              ${feat.title}
            </h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.55; margin-bottom: 16px; max-width: 460px; margin-left: auto; margin-right: auto; text-align: center;">
              ${feat.desc}
            </p>
            
            <div style="text-align: left; background: var(--bg-alt); padding: 14px 16px; border-radius: 14px; border: 1px solid rgba(226, 232, 240, 0.9); margin-bottom: 20px; max-width: 460px; margin-left: auto; margin-right: auto;">
              <h4 style="font-family: var(--font-heading); font-size: 0.82rem; font-weight: 800; color: var(--text-dark); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">
                What Sets Us Apart:
              </h4>
              <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 7px;">
                ${feat.deliverables.map(d => `
                  <li style="display: flex; align-items: flex-start; gap: 8px; font-size: 0.84rem; color: var(--text-dark); line-height: 1.35;">
                    <span style="color: ${feat.accentColor}; font-weight: 800; font-size: 0.95rem; line-height: 1;">✓</span>
                    <span>${d}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <a href="#contact" onclick="document.getElementById('infoModal').classList.remove('active')" class="btn btn-primary btn-pill btn-block" style="max-width: 280px; margin: 0 auto; justify-content: center;">
              Partner With Us <i data-lucide="arrow-right" class="btn-icon"></i>
            </a>
          </div>
        `;
        openModal(featHtml);
      }
    });

    cardEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        cardEl.click();
      }
    });
  });

  // View All Members Button
  const viewMembersBtn = document.getElementById('viewMembersBtn');
  if (viewMembersBtn) {
    viewMembersBtn.addEventListener('click', () => {
      const boardHtml = `
        <div style="text-align: left;">
          <h3 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; margin-bottom: 8px;">Executive Board &amp; Leadership</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 24px;">Meet the visionary leadership team steering TrendAds forward.</p>
          <div style="display: flex; flex-direction: column; gap: 14px; max-height: 400px; overflow-y: auto; padding-right: 8px;">
            ${Object.values(boardMemberDetails).map(m => `
              <div style="display: flex; align-items: center; gap: 16px; padding: 12px; background: var(--bg-alt); border-radius: 14px; border: 1px solid rgba(226,232,240,0.8);">
                <img src="${m.img}" alt="${m.name}" style="width: 58px; height: 58px; border-radius: 50%; object-fit: cover; object-position: top center; border: 2px solid var(--primary);">
                <div>
                  <h4 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700; margin: 0; color: var(--text-dark);">${m.name}</h4>
                  <span style="font-size: 0.8rem; color: var(--primary); font-weight: 600;">${m.role}</span>
                  <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px; line-height: 1.4;">${m.bio}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      openModal(boardHtml);
    });
  }

  // 10. Toast Notification System
  function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i data-lucide="check-circle" style="color: var(--accent-green);"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.animation = 'slideInRight 0.3s reverse forwards';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // 11. Contact & Enquiry Form Handling -> Connects directly with WhatsApp (+91 81398 60663)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName') ? document.getElementById('formName').value.trim() : '';
      const email = document.getElementById('formEmail') ? document.getElementById('formEmail').value.trim() : '';
      const phone = document.getElementById('formPhone') ? document.getElementById('formPhone').value.trim() : '';
      const subject = document.getElementById('formSubject') ? document.getElementById('formSubject').value.trim() : '';
      const message = document.getElementById('formMessage') ? document.getElementById('formMessage').value.trim() : '';

      const waText = `*New Enquiry from TrendAds Website* 🚀\n\n` +
        `👤 *Name:* ${name}\n` +
        `📧 *Email:* ${email}\n` +
        `📱 *Phone:* ${phone || 'Not provided'}\n` +
        `📝 *Subject:* ${subject || 'General Enquiry'}\n` +
        `💬 *Message:* ${message}`;

      const waUrl = `https://wa.me/918139860663?text=${encodeURIComponent(waText)}`;

      showToast(`Thank you ${name}! Opening WhatsApp to connect with our team...`);
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 600);

      contactForm.reset();
    });
  }
});
