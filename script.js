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

  document.querySelectorAll(".servicos-list, .diferenciais-list, .cidades-list").forEach(function (list) {
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

})();
