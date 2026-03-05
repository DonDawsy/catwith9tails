(() => {
  const storageKey = "cwt9t_lang";
  const fallbackLang = "en";

  if (!window.siteContent || !window.siteContent.translations || !window.siteContent.portfolioItems) {
    return;
  }

  const { translations, portfolioItems } = window.siteContent;
  const supportedLangs = Object.keys(translations);
  const state = {
    lang: supportedLangs.includes(localStorage.getItem(storageKey))
      ? localStorage.getItem(storageKey)
      : fallbackLang
  };

  const aboutCopy = document.getElementById("about-copy");
  const featuredGrid = document.getElementById("featured-grid");
  const galleryGrid = document.getElementById("gallery-grid");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const siteHeader = document.querySelector(".site-header");
  const nav = document.getElementById("primary-nav");
  const contactEmail = document.getElementById("contact-email");
  const sectionLinks = Array.from(document.querySelectorAll("[data-section-link]"));
  const langButtons = Array.from(document.querySelectorAll("[data-lang-btn]"));
  const metaDescription = document.querySelector('meta[name="description"]');

  let revealObserver;
  let sectionObserver;

  function byPath(object, path) {
    return path.split(".").reduce((acc, part) => {
      if (acc && Object.prototype.hasOwnProperty.call(acc, part)) {
        return acc[part];
      }
      return undefined;
    }, object);
  }

  function t(path, lang = state.lang) {
    const value = byPath(translations[lang], path);
    if (typeof value === "string") {
      return value;
    }
    return path;
  }

  function isReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function openMenu() {
    document.body.classList.add("menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  function updateMeta(lang) {
    document.documentElement.lang = lang;
    document.title = t("meta.title", lang);
    if (metaDescription) {
      metaDescription.setAttribute("content", t("meta.description", lang));
    }
  }

  function updateTranslationNodes(lang) {
    const nodes = document.querySelectorAll("[data-i18n]");
    nodes.forEach((node) => {
      const key = node.getAttribute("data-i18n");
      const value = t(key, lang);
      if (value !== key) {
        node.textContent = value;
      }
    });

    langButtons.forEach((button) => {
      const active = button.dataset.langBtn === lang;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    const switchLabel = lang === "no" ? "Sprakvalg" : "Language switch";
    const langSwitch = document.querySelector(".lang-switch");
    if (langSwitch) {
      langSwitch.setAttribute("aria-label", switchLabel);
    }
  }

  function renderAbout(lang) {
    const paragraphs = byPath(translations[lang], "about.paragraphs") || [];
    aboutCopy.innerHTML = "";

    paragraphs.forEach((paragraph, index) => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      p.className = "reveal";
      p.style.transitionDelay = isReducedMotion() ? "0ms" : `${Math.min(index * 65, 280)}ms`;
      aboutCopy.appendChild(p);
    });
  }

  function createPicture(item, lang, eager = false) {
    const picture = document.createElement("picture");

    const source = document.createElement("source");
    source.srcset = `${item.srcBase}.webp`;
    source.type = "image/webp";
    picture.appendChild(source);

    const image = document.createElement("img");
    image.src = `${item.srcBase}.jpg`;
    image.alt = item.alt[lang] || item.alt[fallbackLang] || "Storytelling portfolio photograph.";
    image.loading = eager ? "eager" : "lazy";
    image.decoding = "async";
    image.width = item.width;
    image.height = item.height;

    picture.appendChild(image);
    return picture;
  }

  function renderFeatured(lang) {
    const featuredItems = portfolioItems.filter((item) => item.featured);
    featuredGrid.innerHTML = "";

    featuredItems.forEach((item, index) => {
      const figure = document.createElement("figure");
      figure.className = "feature-card reveal";
      figure.style.transitionDelay = isReducedMotion() ? "0ms" : `${Math.min(index * 70, 350)}ms`;

      const pic = createPicture(item, lang);
      figure.appendChild(pic);

      const caption = document.createElement("figcaption");
      caption.textContent = item.captionKey ? t(item.captionKey, lang) : "";
      figure.appendChild(caption);

      featuredGrid.appendChild(figure);
    });
  }

  function renderGallery(lang) {
    galleryGrid.innerHTML = "";

    portfolioItems.forEach((item, index) => {
      const figure = document.createElement("figure");
      figure.className = "gallery-card reveal";
      figure.style.transitionDelay = isReducedMotion() ? "0ms" : `${Math.min((index % 12) * 50, 420)}ms`;

      const pic = createPicture(item, lang);
      figure.appendChild(pic);

      if (item.captionKey) {
        const caption = document.createElement("figcaption");
        caption.textContent = t(item.captionKey, lang);
        figure.appendChild(caption);
      }

      galleryGrid.appendChild(figure);
    });
  }

  function refreshObservers() {
    if (!isReducedMotion()) {
      if (revealObserver) {
        revealObserver.disconnect();
      }

      revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: "0px 0px -8% 0px",
          threshold: 0.12
        }
      );

      document.querySelectorAll(".reveal").forEach((node) => {
        revealObserver.observe(node);
      });
    } else {
      document.querySelectorAll(".reveal").forEach((node) => {
        node.classList.add("is-visible");
      });
    }

    if (sectionObserver) {
      sectionObserver.disconnect();
    }

    const sections = Array.from(document.querySelectorAll("[data-section]"));
    sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) {
          return;
        }

        const id = visible.target.id;
        sectionLinks.forEach((link) => {
          if (link.dataset.sectionLink === id) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      {
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.1, 0.25, 0.5]
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  function applyLanguage(lang) {
    state.lang = lang;
    localStorage.setItem(storageKey, lang);

    updateMeta(lang);
    updateTranslationNodes(lang);
    renderAbout(lang);
    renderFeatured(lang);
    renderGallery(lang);

    const subject = lang === "no" ? "Fortellerhenvendelse" : "Storytelling Inquiry";
    contactEmail.href = `mailto:neha.account@gmail.com?subject=${encodeURIComponent(subject)}`;

    refreshObservers();
  }

  function initializeMenu() {
    menuToggle.addEventListener("click", () => {
      if (document.body.classList.contains("menu-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        document.body.classList.contains("menu-open") &&
        !siteHeader.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });
  }

  function initializeLanguageButtons() {
    langButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const selectedLang = button.dataset.langBtn;
        if (selectedLang && selectedLang !== state.lang && supportedLangs.includes(selectedLang)) {
          applyLanguage(selectedLang);
        }
      });
    });
  }

  initializeMenu();
  initializeLanguageButtons();
  applyLanguage(state.lang);
})();
