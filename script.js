// TRENDADS DIGITAL MARKETING - PURE JAVASCRIPT LOGIC

document.addEventListener('DOMContentLoaded', () => {
  // 0. Initialize Hero Fluid Vector Flow Grid Canvas
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

  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Navbar Mobile Menu Toggle
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

  // 3. Navbar Active State on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

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
  });

  // 4. Service Detail Data & Modal Handling
  const serviceDetails = {
    branding: {
      title: "Branding & Identity",
      iconImg: "assets/icon_pack/4.png",
      desc: "Our branding and identity services establish your business's visual persona, tone of voice, and emotional connection with your market.",
      features: [
        "Brand Strategy & Positioning",
        "Logo Design & Brand Guidelines",
        "Visual Identity Systems",
        "Packaging & Print Assets",
        "Brand Refresh & Rebranding"
      ]
    },
    social: {
      title: "Social Media Marketing",
      iconImg: "assets/icon_pack/3.png",
      desc: "Drive engagement and build a loyal brand community across Instagram, LinkedIn, Facebook, and YouTube.",
      features: [
        "Social Media Content Creation",
        "Community Management",
        "Influencer Marketing Campaigns",
        "Social Growth Analytics",
        "Platform Specific Strategy"
      ]
    },
    performance: {
      title: "Performance Marketing",
      iconImg: "assets/icon_pack/5.png",
      desc: "Maximized ROI through targeted Google Ads, Meta Ads, and programmatic advertising campaigns.",
      features: [
        "PPC & Paid Search Management",
        "Meta Ads (FB & Instagram)",
        "Retargeting & Remarketing",
        "Conversion Rate Optimization (CRO)",
        "A/B Testing & Funnel Analytics"
      ]
    },
    web: {
      title: "Web Development",
      iconImg: "assets/icon_pack/6.png",
      desc: "Custom high-performance web applications and landing pages engineered for rapid loading and seamless conversions.",
      features: [
        "Custom Frontend Development",
        "Responsive & Mobile-First UX/UI",
        "E-Commerce Solutions",
        "CMS Integration (WordPress/Webflow)",
        "Speed & Security Optimization"
      ]
    },
    seo: {
      title: "SEO Optimization",
      iconImg: "assets/icon_pack/2.png",
      desc: "Dominating organic search results through comprehensive technical SEO, content authority, and link building.",
      features: [
        "Technical SEO Audits",
        "Keyword Research & Strategy",
        "On-Page & Off-Page SEO",
        "Local SEO & Google Business Profile",
        "Competitor Rank Tracking"
      ]
    },
    content: {
      title: "Content Marketing",
      iconImg: "assets/icon_pack/7.png",
      desc: "Compelling storytelling and authority content designed to capture lead intent and foster audience trust.",
      features: [
        "Content Strategy & Copywriting",
        "Blog & Article Publishing",
        "Video Scriptwriting & Assets",
        "Case Studies & E-Books",
        "Email Marketing Campaigns"
      ]
    }
  };

  const modal = document.getElementById('infoModal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');

  function openModal(htmlContent) {
    modalBody.innerHTML = htmlContent;
    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  function closeModal() {
    modal.classList.remove('active');
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Service Card Click Listeners
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      const serviceKey = card.getAttribute('data-service');
      const data = serviceDetails[serviceKey];
      if (data) {
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
    });
  });

  // 5. Board Member Data & Modal
  const boardMemberDetails = {
    arun: { name: "Arun Nair", role: "Chairman", img: "assets/member_arun.jpg", bio: "Arun brings 18+ years of global leadership in digital transformation and venture growth across Asia & MENA regions." },
    sneha: { name: "Sneha Menon", role: "Managing Director", img: "assets/member_sneha.jpg", bio: "Sneha specializes in brand positioning, scaling high-impact digital initiatives, and client success ecosystems." },
    vishnu: { name: "Vishnu Prasad", role: "Marketing Director", img: "assets/member_vishnu.jpg", bio: "Vishnu leads omnichannel performance strategies, turning customer insights into multi-million dollar revenue engines." },
    divya: { name: "Divya Nair", role: "Operations Head", img: "assets/member_divya.jpg", bio: "Divya ensures agile campaign delivery, quality control, and cross-functional operational excellence." },
    rohit: { name: "Rohit Krishnan", role: "Technology Head", img: "assets/member_rohit.jpg", bio: "Rohit oversees web architectures, analytics infrastructure, and AI-assisted marketing automation tools." },
    anjali: { name: "Anjali Suresh", role: "Finance Head", img: "assets/member_anjali.jpg", bio: "Anjali manages corporate finance, budget optimizations, and commercial scaling strategies for TrendAds." }
  };

  const viewMembersBtn = document.getElementById('viewMembersBtn');
  if (viewMembersBtn) {
    viewMembersBtn.addEventListener('click', () => {
      const boardHtml = `
        <div style="text-align: left;">
          <h3 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; margin-bottom: 8px;">Executive Board &amp; Leadership</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 24px;">Meet the visionary leadership team steering TrendAds forward.</p>
          <div style="display: flex; flex-direction: column; gap: 16px; max-height: 360px; overflow-y: auto; padding-right: 8px;">
            ${Object.values(boardMemberDetails).map(m => `
              <div style="display: flex; align-items: center; gap: 16px; padding: 12px; background: var(--bg-alt); border-radius: 12px;">
                <img src="${m.img}" alt="${m.name}" style="width: 54px; height: 54px; border-radius: 50%; object-fit: cover;">
                <div>
                  <h4 style="font-family: var(--font-heading); font-size: 1rem; font-weight: 700; margin: 0;">${m.name}</h4>
                  <span style="font-size: 0.8rem; color: var(--primary); font-weight: 600;">${m.role}</span>
                  <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">${m.bio}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      openModal(boardHtml);
    });
  }

  // 6. Toast Notification System
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

  // 7. Contact Form Handling
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName').value;
      showToast(`Thank you ${name}! Your message has been sent successfully.`);
      contactForm.reset();
    });
  }

  // 8. Newsletter Form Handling
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast("Subscribed! You'll receive our monthly digital growth updates.");
      newsletterForm.reset();
    });
  }
});
