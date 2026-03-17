const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const supportsFancyCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

document.querySelectorAll('img[data-fallback-src]').forEach((image) => {
  image.addEventListener('error', () => {
    const fallbackSrc = image.dataset.fallbackSrc;
    if (fallbackSrc && image.src !== fallbackSrc) {
      image.src = fallbackSrc;
    }
  }, { once: true });
});

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((el) => observer.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add('visible'));
}

const navLinks = [...document.querySelectorAll('.nav a')];
const sections = [...document.querySelectorAll('main section')];
const navMenu = document.getElementById('navMenu');
const menuToggle = document.getElementById('menuToggle');
const topbar = document.querySelector('.topbar');

function updateNavIndicator(target) {
  if (!target || !topbar) return;
  const targetRect = target.getBoundingClientRect();
  const topbarRect = topbar.getBoundingClientRect();
  const left = targetRect.left - topbarRect.left + (targetRect.width / 2) - 2;
  topbar.style.setProperty('--nav-indicator-left', `${left}px`);
}

function setMenuState(isOpen) {
  navMenu.classList.toggle('open', isOpen);
  menuToggle?.setAttribute('aria-expanded', String(isOpen));
  menuToggle?.setAttribute('aria-label', isOpen ? '关闭导航' : '打开导航');
}

function syncActiveNav() {
  const scrollTop = window.scrollY + 160;
  const current = sections.find((section) => {
    const start = section.offsetTop;
    const end = start + section.offsetHeight;
    return scrollTop >= start && scrollTop < end;
  }) || sections[0];

  if (!current) return;

  navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${current.id}`));
  updateNavIndicator(document.querySelector('.nav a.active'));
}

menuToggle?.addEventListener('click', () => {
  setMenuState(!navMenu.classList.contains('open'));
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => setMenuState(false));
  link.addEventListener('mouseenter', () => updateNavIndicator(link));
  link.addEventListener('focus', () => updateNavIndicator(link));
});

window.addEventListener('load', () => {
  syncActiveNav();
  updateNavIndicator(document.querySelector('.nav a.active') || navLinks[0]);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 840) {
    setMenuState(false);
  }
  updateNavIndicator(document.querySelector('.nav a.active') || navLinks[0]);
});

let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    syncActiveNav();
    ticking = false;
  });
}, { passive: true });

const commandOutput = {
  whoami: [
    '王一轩 / engineer and product candidate',
    'focus: testing awareness, product understanding, c++ and web implementation',
  ],
  skills: [
    'C / C++ / Linux / Qt / MySQL / HTML / CSS / JavaScript',
    'data structures, system programming, tcp/ip, gui development',
  ],
  product: [
    'focus: requirement analysis, prd breakdown, prototype collaboration',
    'goal: connect technical implementation with product-oriented communication',
  ],
  experience: [
    'internship: electronic software intern, supporting in-car dynamic lighting product delivery',
    'work: c++ feature development, python automation testing, cross-team collaboration',
  ],
  quality: [
    'focus: test lifecycle, testcase design, interface verification and sql checking',
    'goal: add quality awareness and validation thinking to product and engineering work',
  ],
  projects: [
    'featured: Real Time Snake Engine / High Concurrency Memory Pool',
    'direction: showcase c++ fundamentals, system design and engineering evidence',
  ],
  goals: [
    'target role priority: technical product',
    'goal: present quality awareness, product thinking and engineering depth together',
  ],
};

const terminalBody = document.getElementById('terminalBody');
document.querySelectorAll('.terminal-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    const lines = commandOutput[chip.dataset.command];
    if (!lines || !terminalBody) return;

    const fragment = document.createDocumentFragment();
    const commandLine = document.createElement('div');
    commandLine.className = 'terminal-line';
    commandLine.innerHTML = `<span class="terminal-prompt">&gt;</span><span>${chip.dataset.command}</span>`;
    fragment.appendChild(commandLine);

    lines.forEach((line) => {
      const outputLine = document.createElement('div');
      outputLine.className = 'terminal-line';
      outputLine.innerHTML = `<span class="terminal-ok">ok</span><span>${line}</span>`;
      fragment.appendChild(outputLine);
    });

    terminalBody.replaceChildren(fragment);
  });
});

document.querySelectorAll('.tilt-card').forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    if (prefersReducedMotion) return;
    const rect = card.getBoundingClientRect();
    const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
    const rotateX = (0.5 - (event.clientY - rect.top) / rect.height) * 10;
    card.style.setProperty('--tiltX', `${rotateX.toFixed(2)}deg`);
    card.style.setProperty('--tiltY', `${rotateY.toFixed(2)}deg`);
  });

  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--tiltX', '0deg');
    card.style.setProperty('--tiltY', '0deg');
  });
});

const back = document.getElementById('parallaxBack');
const mid = document.getElementById('parallaxMid');
const front = document.getElementById('parallaxFront');

if (!prefersReducedMotion) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (back) back.style.transform = `translate3d(0, ${y * -0.06}px, 0)`;
    if (mid) mid.style.transform = `translate3d(0, ${y * -0.12}px, 0)`;
    if (front) front.style.transform = `translate3d(0, ${y * -0.18}px, 0)`;
  }, { passive: true });
}

if (supportsFancyCursor) {
  const cursor = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');
  const cursorLabel = document.getElementById('cursorLabel');
  const cursorRipple = document.getElementById('cursorRipple');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let coreX = mouseX;
  let coreY = mouseY;
  let trailX = mouseX;
  let trailY = mouseY;
  let labelX = mouseX;
  let labelY = mouseY;
  let rippleTimeout = null;

  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }, { passive: true });

  function animateCursor() {
    coreX += (mouseX - coreX) * 0.3;
    coreY += (mouseY - coreY) * 0.3;
    trailX += (mouseX - trailX) * 0.11;
    trailY += (mouseY - trailY) * 0.11;
    labelX += (mouseX - labelX) * 0.18;
    labelY += (mouseY - labelY) * 0.18;

    cursor.style.left = `${coreX}px`;
    cursor.style.top = `${coreY}px`;
    cursorTrail.style.left = `${trailX}px`;
    cursorTrail.style.top = `${trailY}px`;
    cursorLabel.style.left = `${labelX}px`;
    cursorLabel.style.top = `${labelY}px`;

    window.requestAnimationFrame(animateCursor);
  }

  function setCursorMode(mode = 'default', label = '') {
    cursor.classList.remove('active', 'pointer', 'trap');
    cursorTrail.classList.remove('active', 'pointer', 'trap');

    if (mode === 'pointer') {
      cursor.classList.add('pointer');
      cursorTrail.classList.add('pointer');
    } else if (mode === 'trap') {
      cursor.classList.add('trap');
      cursorTrail.classList.add('trap');
    } else if (mode === 'active') {
      cursor.classList.add('active');
      cursorTrail.classList.add('active');
    }

    if (label) {
      cursorLabel.textContent = label;
      cursorLabel.classList.add('visible');
    } else {
      cursorLabel.classList.remove('visible');
    }
  }

  document.querySelectorAll('a, button').forEach((el) => {
    const label = el.dataset.cursor || 'open';
    el.addEventListener('mouseenter', () => setCursorMode('pointer', label));
    el.addEventListener('mouseleave', () => setCursorMode());
  });

  document.querySelectorAll('.tilt-card, .interactive').forEach((el) => {
    const label = el.dataset.cursor || 'view';
    el.addEventListener('mouseenter', () => setCursorMode('active', label));
    el.addEventListener('mouseleave', () => setCursorMode());
  });

  document.querySelectorAll('.terminal, .profile-stage').forEach((el) => {
    const label = el.dataset.cursor || 'explore';
    el.addEventListener('mouseenter', () => setCursorMode('trap', label));
    el.addEventListener('mouseleave', () => setCursorMode());
  });

  window.addEventListener('mousedown', () => {
    cursor.classList.add('active');
    cursorTrail.classList.add('active');
    cursorRipple.classList.remove('play');
    void cursorRipple.offsetWidth;
    cursorRipple.style.left = `${mouseX}px`;
    cursorRipple.style.top = `${mouseY}px`;
    cursorRipple.classList.add('play');
    clearTimeout(rippleTimeout);
    rippleTimeout = window.setTimeout(() => cursorRipple.classList.remove('play'), 520);
  });

  window.addEventListener('mouseup', () => {
    cursor.classList.remove('active');
    cursorTrail.classList.remove('active');
  });

  animateCursor();
}
