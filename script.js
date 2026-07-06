(function () {
  var PHONE = "5554981517397";
  var MESSAGE = "Olá, Amilton! Vi seu site e gostaria de um orçamento.";
  var url = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(MESSAGE);

  document.querySelectorAll("[data-whatsapp-link]").forEach(function (link) {
    link.setAttribute("href", url);
  });
})();

/* ==========================================================
   GSAP + ScrollTrigger — animações de todas as seções após o HERO
   ========================================================== */
(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  if (reduceMotion || !hasGsap) {
    document.querySelectorAll("[data-gsap] , .reveal").forEach(function (el) {
      el.style.opacity = 1;
      el.style.transform = "none";
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  var defaultTrigger = { start: "top 82%", once: true };

  /* Simple fade-up blocks */
  gsap.utils.toArray('[data-gsap="fade-up"]').forEach(function (el) {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 32 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: Object.assign({ trigger: el }, defaultTrigger)
      }
    );
  });

  /* Circuitos (linhas de serviço): entram deslizando + revelam a lista com stagger */
  gsap.utils.toArray('[data-gsap="circuito"]').forEach(function (circuito) {
    var tag = circuito.querySelector(".circuito-tag");
    var items = circuito.querySelectorAll('[data-gsap="stagger-item"]');

    var tl = gsap.timeline({
      scrollTrigger: Object.assign({ trigger: circuito }, defaultTrigger)
    });

    tl.set(circuito, { autoAlpha: 1 });
    if (tag) {
      tl.fromTo(tag, { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.out" });
    }
    if (items.length) {
      tl.fromTo(
        items,
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.12 },
        tag ? "-=0.25" : 0
      );
    }
  });

  document.querySelectorAll(".diferenciais-list, .cidades-list").forEach(function (list) {
    var items = list.querySelectorAll('[data-gsap="stagger-item"]');
    if (!items.length) return;
    gsap.fromTo(
      items,
      { autoAlpha: 0, y: 20 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: Object.assign({ trigger: list }, defaultTrigger)
      }
    );
  });

  /* Parallax leve na foto de diferenciais */
  var parallaxMedia = document.querySelector('[data-gsap="parallax-media"]');
  if (parallaxMedia) {
    gsap.fromTo(
      parallaxMedia.querySelector("img"),
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: parallaxMedia,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );
    gsap.fromTo(
      parallaxMedia,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: Object.assign({ trigger: parallaxMedia }, defaultTrigger)
      }
    );
  }

  /* Split-text simples no headline final: divide em palavras e anima */
  document.querySelectorAll('[data-gsap="split-text"]').forEach(function (heading) {
    var words = heading.textContent.trim().split(/\s+/);
    heading.innerHTML = words
      .map(function (w) {
        return '<span class="split-word"><span class="split-word-inner">' + w + "</span></span>";
      })
      .join(" ");

    gsap.fromTo(
      heading.querySelectorAll(".split-word-inner"),
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 0.7,
        ease: "power4.out",
        stagger: 0.045,
        scrollTrigger: Object.assign({ trigger: heading }, defaultTrigger)
      }
    );
  });

  /* Botão de CTA final: pulso sutil e contínuo para chamar atenção */
  var ctaBtn = document.querySelector(".btn-pulse");
  if (ctaBtn) {
    gsap.to(ctaBtn, {
      scale: 1.045,
      duration: 1.1,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      scrollTrigger: { trigger: ctaBtn, start: "top 90%" }
    });
  }

  /* Painel de disjuntores: leve efeito de "liga" sequencial ao entrar em view */
  var painelStrip = document.querySelector('[data-breaker-strip]');
  if (painelStrip) {
    var toggles = painelStrip.querySelectorAll(".breaker-toggle");
    gsap.fromTo(
      toggles,
      { autoAlpha: 0, y: -6 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        ease: "back.out(2)",
        stagger: 0.06,
        scrollTrigger: { trigger: painelStrip, start: "top 88%", once: true }
      }
    );
  }
})();

(function () {
  var slider = document.querySelector("[data-slider]");
  if (!slider) return;

  var track = slider.querySelector("[data-slider-track]");
  var slides = Array.prototype.slice.call(track.children);
  var prevBtn = slider.querySelector("[data-slider-prev]");
  var nextBtn = slider.querySelector("[data-slider-next]");
  var dotsWrap = slider.querySelector("[data-slider-dots]");

  slides.forEach(function (_, i) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", "Ir para foto " + (i + 1));
    dot.addEventListener("click", function () { goTo(i); });
    dotsWrap.appendChild(dot);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function slidesPerView() {
    return window.innerWidth >= 700 ? 2 : 1;
  }

  function currentIndex() {
    var slideWidth = slides[0].getBoundingClientRect().width + 16;
    return Math.round(track.scrollLeft / slideWidth);
  }

  function goTo(index) {
    var perView = slidesPerView();
    var maxIndex = Math.max(0, slides.length - perView);
    index = Math.max(0, Math.min(index, maxIndex));
    var slideWidth = slides[0].getBoundingClientRect().width + 16;
    track.scrollTo({ left: index * slideWidth, behavior: "smooth" });
  }

  function updateDots() {
    var idx = currentIndex();
    dots.forEach(function (d, i) { d.classList.toggle("is-active", i === idx); });
  }

  prevBtn.addEventListener("click", function () { goTo(currentIndex() - 1); });
  nextBtn.addEventListener("click", function () { goTo(currentIndex() + 1); });
  track.addEventListener("scroll", function () {
    window.clearTimeout(track._scrollTimeout);
    track._scrollTimeout = window.setTimeout(updateDots, 100);
  });

  updateDots();
})();

(function () {
  var breakers = document.querySelectorAll("[data-breaker]");
  var circuitos = document.querySelectorAll(".circuito[id]");
  if (!breakers.length || !circuitos.length) return;

  var map = {};
  breakers.forEach(function (b) {
    map[b.getAttribute("href").slice(1)] = b;
  });

  if (!("IntersectionObserver" in window)) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link) return;
        link.classList.toggle("is-active", entry.isIntersecting);
      });
    },
    { rootMargin: "-30% 0px -55% 0px" }
  );
  circuitos.forEach(function (el) { observer.observe(el); });
})();
