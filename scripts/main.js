const supportsFancyCursor = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const navMenu = document.getElementById("siteNav");
const menuToggle = document.getElementById("menuToggle");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = [...document.querySelectorAll("main section[id], footer[id]")];
const localTime = document.getElementById("localTime");
const revealElements = document.querySelectorAll(".reveal");

function setMenuState(isOpen) {
  navMenu?.classList.toggle("open", isOpen);
  menuToggle?.classList.toggle("is-open", isOpen);
  menuToggle?.setAttribute("aria-expanded", String(isOpen));
}

function syncActiveNav() {
  const scrollTop = window.scrollY + 180;
  const current = sections.find((section) => {
    const start = section.offsetTop;
    const end = start + section.offsetHeight;
    return scrollTop >= start && scrollTop < end;
  }) || sections[0];

  if (current === undefined) return;

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current.id}`);
  });
}

menuToggle?.addEventListener("click", () => {
  const isOpen = navMenu?.classList.contains("open") === true;
  setMenuState(isOpen === false);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuState(false);
  }
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

function updateLocalTime() {
  if (localTime === null) return;

  const formatter = new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  localTime.textContent = formatter.format(new Date());
}

updateLocalTime();
window.setInterval(updateLocalTime, 1000);

window.addEventListener("load", () => {
  document.body.classList.add("is-loaded");
  syncActiveNav();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    setMenuState(false);
  }
  syncActiveNav();
});

window.addEventListener("scroll", syncActiveNav, { passive: true });

if (supportsFancyCursor && prefersReducedMotion === false) {
  const cursor = document.getElementById("cursor");
  const cursorTrail = document.getElementById("cursorTrail");
  const cursorLabel = document.getElementById("cursorLabel");
  const cursorRipple = document.getElementById("cursorRipple");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let coreX = mouseX;
  let coreY = mouseY;
  let trailX = mouseX;
  let trailY = mouseY;
  let labelX = mouseX;
  let labelY = mouseY;
  let rippleTimeout = null;

  window.addEventListener("mousemove", (event) => {
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

    if (cursor !== null) {
      cursor.style.left = `${coreX}px`;
      cursor.style.top = `${coreY}px`;
    }

    if (cursorTrail !== null) {
      cursorTrail.style.left = `${trailX}px`;
      cursorTrail.style.top = `${trailY}px`;
    }

    if (cursorLabel !== null) {
      cursorLabel.style.left = `${labelX}px`;
      cursorLabel.style.top = `${labelY}px`;
    }

    window.requestAnimationFrame(animateCursor);
  }

  function setCursorMode(mode = "default", label = "") {
    if (cursor === null || cursorTrail === null || cursorLabel === null) return;

    cursor.classList.remove("active", "pointer", "trap");
    cursorTrail.classList.remove("active", "pointer", "trap");

    if (mode === "pointer") {
      cursor.classList.add("pointer");
      cursorTrail.classList.add("pointer");
    } else if (mode === "trap") {
      cursor.classList.add("trap");
      cursorTrail.classList.add("trap");
    } else if (mode === "active") {
      cursor.classList.add("active");
      cursorTrail.classList.add("active");
    }

    if (label.length > 0) {
      cursorLabel.textContent = label;
      cursorLabel.classList.add("visible");
    } else {
      cursorLabel.classList.remove("visible");
    }
  }

  document.querySelectorAll("a, button").forEach((element) => {
    const label = element.dataset.cursor || "open";
    element.addEventListener("mouseenter", () => setCursorMode("pointer", label));
    element.addEventListener("mouseleave", () => setCursorMode());
  });

  document.querySelectorAll(".interactive").forEach((element) => {
    const label = element.dataset.cursor || "view";
    element.addEventListener("mouseenter", () => setCursorMode("active", label));
    element.addEventListener("mouseleave", () => setCursorMode());
  });

  window.addEventListener("mousedown", () => {
    if (cursor === null || cursorTrail === null || cursorRipple === null) return;

    cursor.classList.add("active");
    cursorTrail.classList.add("active");
    cursorRipple.classList.remove("play");
    void cursorRipple.offsetWidth;
    cursorRipple.style.left = `${mouseX}px`;
    cursorRipple.style.top = `${mouseY}px`;
    cursorRipple.classList.add("play");
    clearTimeout(rippleTimeout);
    rippleTimeout = window.setTimeout(() => cursorRipple.classList.remove("play"), 520);
  });

  window.addEventListener("mouseup", () => {
    cursor?.classList.remove("active");
    cursorTrail?.classList.remove("active");
  });

  animateCursor();
}
