// ===== Mobile nav toggle =====
(function () {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // Close on link click (mobile)
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) close();
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();

// ===== Header shadow on scroll =====
(function () {
  const header = document.getElementById("header");
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// ===== Smooth scroll offset for sticky header =====
(function () {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const header = document.getElementById("header");
      const offset = header ? header.offsetHeight + 8 : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();

// ===== Contact form validation =====
(function () {
  const form = document.getElementById("bookingForm");
  if (!form) return;
  const status = document.getElementById("formStatus");

  // Set min date to today
  const dateInput = document.getElementById("date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
  }

  const fields = ["name", "email", "phone", "dogName", "service", "date", "time", "message"];
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhone = (v) => /[\d\s()+\-]{7,}/.test(v);

  const validators = {
    name: (v) => v.trim().length >= 2,
    email: (v) => isEmail(v.trim()),
    phone: (v) => isPhone(v.trim()),
    dogName: (v) => v.trim().length >= 1,
    service: (v) => v.trim().length >= 1,
    date: (v) => v.trim().length >= 1,
    time: (v) => v.trim().length >= 1,
    message: (v) => v.trim().length >= 5,
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;

    fields.forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;
      const valid = validators[id](input.value);
      input.classList.toggle("invalid", !valid);
      if (!valid) ok = false;
    });

    if (!ok) {
      status.textContent = "Please fill in all required fields with valid details.";
      status.className = "form__status err";
      return;
    }

    const dogName = document.getElementById("dogName").value;
    const service = document.getElementById("service").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    status.textContent = `Thanks! We received your booking request for ${dogName} (${service}) on ${date} — ${time}. We'll confirm shortly!`;
    status.className = "form__status ok";
    form.reset();
  });

  // Clear invalid state as the user types
  fields.forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("input", () => input.classList.remove("invalid"));
    input.addEventListener("change", () => input.classList.remove("invalid"));
  });
})();

// ===== Reveal on scroll =====
(function () {
  const targets = document.querySelectorAll(
    ".service-card, .review, .gallery__item, .why__visual-card, .pricing__table, .contact__form, .social__card, .ig-tile"
  );
  if (!targets.length || !("IntersectionObserver" in window)) return;

  targets.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((el) => io.observe(el));
})();
