document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  navToggle?.addEventListener('click', () => {
    nav?.classList.toggle('open');
  });

  // Hero slideshow
  const slides = document.querySelectorAll('.hero-slideshow .slide');
  let currentSlide = 0;
  if (slides.length) {
    slides[currentSlide].classList.add('active');
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 5000);
  }

  // Animate elements on scroll
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.animate').forEach(el => observer.observe(el));

  // Floating CTA pulse animation
  const ctaButton = document.querySelector('.btn-associate');
  if (ctaButton) {
    setInterval(() => ctaButton.classList.toggle('pulse'), 2000);
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Load recent events
  async function loadRecentEvents() {
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('Network response not ok');
      const events = await res.json();
      const container = document.getElementById('eventsContainer');
      if (container) {
        container.innerHTML = events.map(evt =>
          `<div class="card event-card animate">
             <h4>${evt.title}</h4>
             <p>${new Date(evt.date).toLocaleDateString('pt-BR')}</p>
             <p>${evt.description}</p>
           </div>`
        ).join('');
        document.querySelectorAll('.event-card').forEach(card => observer.observe(card));
      }
    } catch (err) {
      // fail silently
    }
  }
  loadRecentEvents();

  // Load member statistics
  async function loadMemberStats() {
    try {
      const res = await fetch('/api/members/stats');
      if (!res.ok) throw new Error('Network response not ok');
      const data = await res.json();
      const statsEl = document.getElementById('memberStats');
      if (statsEl) statsEl.textContent = `Sócios ativos: ${data.totalMembers}`;
    } catch {}
  }
  loadMemberStats();

  // Lightbox for gallery
  const galleryImages = document.querySelectorAll('.gallery img');
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox?.querySelector('.lightbox-img');
  const btnClose = lightbox?.querySelector('.lightbox-close');
  const btnNext = lightbox?.querySelector('.lightbox-next');
  const btnPrev = lightbox?.querySelector('.lightbox-prev');
  let currentIndex = 0;

  function openLightbox(index) {
    if (!lbImg) return;
    currentIndex = index;
    lbImg.src = galleryImages[index].src;
    lightbox?.classList.add('active');
  }

  function closeLightbox() {
    lightbox?.classList.remove('active');
  }

  function showNext() {
    openLightbox((currentIndex + 1) % galleryImages.length);
  }

  function showPrev() {
    openLightbox((currentIndex - 1 + galleryImages.length) % galleryImages.length);
  }

  galleryImages.forEach((img, i) => img.addEventListener('click', () => openLightbox(i)));
  btnClose?.addEventListener('click', closeLightbox);
  btnNext?.addEventListener('click', showNext);
  btnPrev?.addEventListener('click', showPrev);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Form validation (if applicable)
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(input => {
        if (!input.value.trim()) { valid = false; input.classList.add('error'); }
        else { input.classList.remove('error'); }
      });
      if (valid) { alert('Obrigado! Entraremos em contato.'); form.reset(); }
      else { alert('Preencha todos os campos!'); }
    });
  });

  // Highlight active menu link
  document.querySelectorAll('.nav a').forEach(link => {
    if (link.pathname === window.location.pathname) link.classList.add('active');
    else link.classList.remove('active');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const btn      = document.querySelector('.nav-toggle');
  const drawer   = document.getElementById('drawer');
  const backdrop = document.getElementById('backdrop');

  // Se algum deles for null, o menu não vai abrir
  if (!btn || !drawer || !backdrop) {
    console.error('Drawer JS: elemento não encontrado', { btn, drawer, backdrop });
    return;
  }

  btn.addEventListener('click', () => {
    drawer.classList.toggle('open');
    backdrop.classList.toggle('show');
  });

  backdrop.addEventListener('click', () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('show');
  });
});


let startX = 0;
drawer.addEventListener('touchstart', e => {
  startX = e.touches[0].pageX;
});
drawer.addEventListener('touchmove', e => {
  const delta = e.touches[0].pageX - startX;
  if (delta < -50) { // swipe para a esquerda
    drawer.classList.remove('open');
    backdrop.classList.remove('show');
    btn.classList.remove('open');
  }
});




const wrapper = document.getElementById('wrapper');
const video   = document.getElementById('meuVideo');
const btn     = document.getElementById('btn');
const bar     = document.getElementById('bar');
const prog    = document.getElementById('progress');

btn.addEventListener('click', () => {
  if (video.paused) {
    video.play();
    btn.textContent = '❚❚';
    wrapper.classList.remove('paused');
  } else {
    video.pause();
    btn.textContent = '►';
    wrapper.classList.add('paused');
  }
});

video.addEventListener('timeupdate', () => {
  const pct = (video.currentTime / video.duration) * 100;
  prog.style.width = pct + '%';
});

bar.addEventListener('click', e => {
  const newTime = (e.offsetX / bar.clientWidth) * video.duration;
  video.currentTime = newTime;
});
