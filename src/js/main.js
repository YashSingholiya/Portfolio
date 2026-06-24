/* =========================================================
   Yash Singholiya — Portfolio Interactions
   ========================================================= */
(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  /* ===================== PRELOADER ===================== */
  window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      setTimeout(() => preloader.classList.add("preloader--hide"), 500);
    }
  });

  /* ===================== MOBILE NAV ===================== */
  const navMenu = document.getElementById("nav-menu");
  const navToggle = document.getElementById("nav-toggle");
  const navClose = document.getElementById("nav-close");

  navToggle?.addEventListener("click", () => navMenu.classList.add("show-menu"));
  navClose?.addEventListener("click", () => navMenu.classList.remove("show-menu"));
  document.querySelectorAll(".nav__link").forEach((link) =>
    link.addEventListener("click", () => navMenu.classList.remove("show-menu"))
  );

  /* ===================== HEADER BLUR + PROGRESS + SCROLLUP ===================== */
  const header = document.getElementById("header");
  const scrollUp = document.getElementById("scroll-up");
  const progress = document.getElementById("scroll-progress");

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle("blur-header", y >= 40);
    scrollUp?.classList.toggle("show-scroll", y >= 350);

    if (progress) {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${(y / docH) * 100}%`;
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ===================== ACTIVE NAV LINK (scroll spy) ===================== */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav__link");

  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) =>
              link.classList.toggle(
                "active-link",
                link.getAttribute("href") === `#${id}`
              )
            );
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ===================== REVEAL ON SCROLL ===================== */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const revealObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.revealDelay || 0;
            setTimeout(() => entry.target.classList.add("reveal-in"), delay);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => revealObs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("reveal-in"));
  }

  /* ===================== TYPING EFFECT ===================== */
  const typedEl = document.getElementById("typed");
  if (typedEl) {
    const roles = [
      "Android Developer",
      "Software Engineer",
      "Full Stack Developer",
      "CSE @ IIT Jodhpur",
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const type = () => {
      const current = roles[roleIndex];
      typedEl.textContent = current.slice(0, charIndex);

      if (!deleting && charIndex < current.length) {
        charIndex++;
        setTimeout(type, 80);
      } else if (deleting && charIndex > 0) {
        charIndex--;
        setTimeout(type, 40);
      } else {
        if (!deleting) {
          deleting = true;
          setTimeout(type, 1600);
        } else {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(type, 300);
        }
      }
    };
    type();
  }

  /* ===================== PROJECT FILTERING ===================== */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      projectCards.forEach((card) => {
        const show = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hide", !show);
      });
    });
  });

  /* ===================== SPOTLIGHT HOVER ===================== */
  if (!isTouch) {
    document.querySelectorAll(".card-spotlight").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        card.style.setProperty("--my", `${e.clientY - rect.top}px`);
      });
    });
  }

  /* ===================== CUSTOM CURSOR ===================== */
  if (!isTouch) {
    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    let mx = 0, my = 0, rx = 0, ry = 0;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot) {
        dot.style.left = `${mx}px`;
        dot.style.top = `${my}px`;
      }
    });

    const renderRing = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring) {
        ring.style.left = `${rx}px`;
        ring.style.top = `${ry}px`;
      }
      requestAnimationFrame(renderRing);
    };
    renderRing();

    const hoverTargets = "a, button, .skill, .project-card, .filter-btn, input, textarea, .home__social-link";
    document.querySelectorAll(hoverTargets).forEach((el) => {
      el.addEventListener("mouseenter", () => ring?.classList.add("cursor--hover"));
      el.addEventListener("mouseleave", () => ring?.classList.remove("cursor--hover"));
    });
  }

  /* ===================== MOUSE-FOLLOW GLOW ===================== */
  if (!isTouch && !prefersReduced) {
    const glow = document.getElementById("glow");
    window.addEventListener("mousemove", (e) => {
      if (glow) {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      }
    });
  }

  /* ===================== PARTICLE BACKGROUND ===================== */
  const canvas = document.getElementById("particles");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let w, h;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = Math.min(90, Math.floor((w * h) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(148, 163, 184, 0.55)";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.16 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    };

    resize();
    draw();
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });
  }

  /* ===================== CONTACT FORM (EmailJS) ===================== */
  const contactForm = document.getElementById("contact-form");
  const contactMessage = document.getElementById("contact-message");

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (typeof emailjs === "undefined") {
      contactMessage.textContent = "Email service unavailable. Please email me directly.";
      return;
    }
    contactMessage.style.color = "var(--text-muted)";
    contactMessage.textContent = "Sending...";

    emailjs
      .sendForm("service_tt017pv", "template_w119izl", "#contact-form", "68KQJd8VUuMFoHB3u")
      .then(() => {
        contactMessage.style.color = "var(--accent-2)";
        contactMessage.textContent = "Message sent successfully ✓";
        contactForm.reset();
        setTimeout(() => (contactMessage.textContent = ""), 4000);
      })
      .catch(() => {
        contactMessage.style.color = "#f87171";
        contactMessage.textContent = "Something went wrong. Please try again.";
      });
  });

  /* ===================== FOOTER YEAR ===================== */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
