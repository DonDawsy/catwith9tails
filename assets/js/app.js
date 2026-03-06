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
  const excludedFullGalleryIds = new Set([
    "IMG_0172",
    "img-2184",
    "img-2840",
    "img-7295",
    "img-7300",
    "img-7323"
  ]);

  let revealObserver;
  let lightbox;
  let trackedSections = [];
  let activeSectionId = "";
  let activeSectionFrame = 0;

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

  function setActiveSection(id) {
    if (!id || activeSectionId === id) {
      return;
    }

    activeSectionId = id;
    sectionLinks.forEach((link) => {
      if (link.dataset.sectionLink === id) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function getScrollSpyTargetY() {
    const headerHeight = siteHeader ? siteHeader.getBoundingClientRect().height : 0;
    return headerHeight + Math.min(window.innerHeight * 0.18, 160);
  }

  function updateActiveSection() {
    if (!trackedSections.length) {
      return;
    }

    const targetY = getScrollSpyTargetY();
    let nextSectionId = trackedSections[0].id;

    trackedSections.forEach((section) => {
      if (section.getBoundingClientRect().top <= targetY) {
        nextSectionId = section.id;
      }
    });

    const reachedPageBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (reachedPageBottom) {
      nextSectionId = trackedSections[trackedSections.length - 1].id;
    }

    setActiveSection(nextSectionId);
  }

  function scheduleActiveSectionUpdate() {
    if (activeSectionFrame) {
      return;
    }

    activeSectionFrame = window.requestAnimationFrame(() => {
      activeSectionFrame = 0;
      updateActiveSection();
    });
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

    const ariaNodes = document.querySelectorAll("[data-i18n-aria-label]");
    ariaNodes.forEach((node) => {
      const key = node.getAttribute("data-i18n-aria-label");
      const value = t(key, lang);
      if (value !== key) {
        node.setAttribute("aria-label", value);
      }
    });

    langButtons.forEach((button) => {
      const active = button.dataset.langBtn === lang;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    updateLightboxText(lang);
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
    image.alt = item.alt[lang] || item.alt[fallbackLang] || t("ui.flipItemLabel", lang);
    image.loading = eager ? "eager" : "lazy";
    image.decoding = "async";
    image.width = item.width;
    image.height = item.height;

    picture.appendChild(image);
    return picture;
  }

  function getBacksideContent(item, lang) {
    const fallbackBackside = item.backside && item.backside[fallbackLang] ? item.backside[fallbackLang] : {};
    const localBackside = item.backside && item.backside[lang] ? item.backside[lang] : fallbackBackside;

    return {
      subtitle: localBackside.subtitle || fallbackBackside.subtitle || "",
      text:
        localBackside.text ||
        fallbackBackside.text ||
        item.alt[lang] ||
        item.alt[fallbackLang] ||
        t("ui.flipFallbackText", lang)
    };
  }

  function buildFlipAriaLabel(item, lang, isFlipped) {
    const actionLabel = isFlipped ? t("ui.flipToFront", lang) : t("ui.flipToBack", lang);
    const itemLabel = item.alt[lang] || item.alt[fallbackLang] || t("ui.flipItemLabel", lang);
    return `${actionLabel}: ${itemLabel}`;
  }

  function setCardFlipState(button, item, lang, shouldFlip) {
    button.classList.toggle("is-flipped", shouldFlip);
    button.setAttribute("aria-pressed", String(shouldFlip));
    button.setAttribute("aria-label", buildFlipAriaLabel(item, lang, shouldFlip));
  }

  function buildGalleryAriaLabel(item, lang) {
    const actionLabel = t("ui.openImageView", lang);
    const itemLabel = item.alt[lang] || item.alt[fallbackLang] || t("ui.flipItemLabel", lang);
    return `${actionLabel}: ${itemLabel}`;
  }

  function createFlippableCard(item, lang, cardClassName, transitionDelay, eager = false) {
    const figure = document.createElement("figure");
    figure.className = `${cardClassName} reveal`;
    figure.style.transitionDelay = transitionDelay;

    const flipButton = document.createElement("button");
    flipButton.type = "button";
    flipButton.className = "portfolio-flip";
    setCardFlipState(flipButton, item, lang, false);

    const flipInner = document.createElement("div");
    flipInner.className = "portfolio-flip-inner";

    const frontFace = document.createElement("div");
    frontFace.className = "portfolio-flip-face portfolio-flip-front";

    const frontMedia = document.createElement("div");
    frontMedia.className = "portfolio-flip-media";
    frontMedia.appendChild(createPicture(item, lang, eager));
    frontFace.appendChild(frontMedia);

    if (item.captionKey) {
      const frontCaption = document.createElement("p");
      frontCaption.className = "portfolio-front-caption";
      frontCaption.textContent = t(item.captionKey, lang);
      frontFace.appendChild(frontCaption);
    }

    const backFace = document.createElement("div");
    backFace.className = "portfolio-flip-face portfolio-flip-back";
    const backside = getBacksideContent(item, lang);

    if (backside.subtitle) {
      const backSubtitle = document.createElement("p");
      backSubtitle.className = "portfolio-back-subtitle";
      backSubtitle.textContent = backside.subtitle;
      backFace.appendChild(backSubtitle);
    }

    const backText = document.createElement("p");
    backText.className = "portfolio-back-text";
    backText.textContent = backside.text;
    backFace.appendChild(backText);

    flipInner.appendChild(frontFace);
    flipInner.appendChild(backFace);
    flipButton.appendChild(flipInner);
    figure.appendChild(flipButton);

    flipButton.addEventListener("click", () => {
      const nextFlippedState = !flipButton.classList.contains("is-flipped");
      setCardFlipState(flipButton, item, lang, nextFlippedState);
    });

    flipButton.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && flipButton.classList.contains("is-flipped")) {
        event.preventDefault();
        setCardFlipState(flipButton, item, lang, false);
      }
    });

    return figure;
  }

  function createGalleryCard(item, lang, transitionDelay) {
    const figure = document.createElement("figure");
    figure.className = "gallery-card reveal";
    figure.style.transitionDelay = transitionDelay;

    const imageButton = document.createElement("button");
    imageButton.type = "button";
    imageButton.className = "gallery-image-button";
    imageButton.setAttribute("aria-label", buildGalleryAriaLabel(item, lang));

    const media = document.createElement("div");
    media.className = "gallery-image-media";
    media.appendChild(createPicture(item, lang));
    imageButton.appendChild(media);

    imageButton.addEventListener("click", () => {
      openImageLightbox(item, lang, imageButton);
    });

    figure.appendChild(imageButton);
    return figure;
  }

  function createImageLightbox() {
    const root = document.createElement("div");
    root.className = "image-lightbox";
    root.hidden = true;
    root.setAttribute("aria-hidden", "true");

    const frame = document.createElement("figure");
    frame.className = "image-lightbox-frame";
    frame.setAttribute("role", "dialog");
    frame.setAttribute("aria-modal", "true");

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "image-lightbox-close";

    const closeLabel = document.createElement("span");
    closeLabel.className = "sr-only";

    const closeGlyph = document.createElement("span");
    closeGlyph.textContent = "x";
    closeGlyph.setAttribute("aria-hidden", "true");

    closeButton.appendChild(closeLabel);
    closeButton.appendChild(closeGlyph);

    const picture = document.createElement("picture");
    picture.className = "image-lightbox-media";

    const source = document.createElement("source");
    source.type = "image/webp";

    const image = document.createElement("img");
    image.decoding = "async";

    picture.appendChild(source);
    picture.appendChild(image);

    frame.appendChild(closeButton);
    frame.appendChild(picture);
    root.appendChild(frame);
    document.body.appendChild(root);

    closeButton.addEventListener("click", () => {
      closeImageLightbox();
    });

    root.addEventListener("click", (event) => {
      if (event.target === root) {
        closeImageLightbox();
      }
    });

    return {
      root,
      frame,
      closeButton,
      closeLabel,
      source,
      image,
      activeItem: null,
      trigger: null
    };
  }

  function isImageLightboxOpen() {
    return !!(lightbox && !lightbox.root.hidden);
  }

  function updateLightboxText(lang) {
    if (!lightbox) {
      return;
    }

    lightbox.closeLabel.textContent = t("ui.closeImageView", lang);
    lightbox.frame.setAttribute("aria-label", t("ui.imageDialogLabel", lang));

    if (!lightbox.activeItem) {
      return;
    }

    const alt =
      lightbox.activeItem.alt[lang] ||
      lightbox.activeItem.alt[fallbackLang] ||
      t("ui.flipItemLabel", lang);

    lightbox.image.alt = alt;
  }

  function openImageLightbox(item, lang, trigger = null) {
    if (!lightbox) {
      return;
    }

    lightbox.activeItem = item;
    lightbox.trigger = trigger;

    lightbox.source.srcset = `${item.srcBase}.webp`;
    lightbox.image.src = `${item.srcBase}.jpg`;

    updateLightboxText(lang);

    lightbox.root.hidden = false;
    lightbox.root.classList.add("is-open");
    lightbox.root.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    lightbox.closeButton.focus();
  }

  function closeImageLightbox(restoreFocus = true) {
    if (!isImageLightboxOpen()) {
      return;
    }

    lightbox.root.classList.remove("is-open");
    lightbox.root.hidden = true;
    lightbox.root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");

    if (restoreFocus && lightbox.trigger && document.contains(lightbox.trigger)) {
      lightbox.trigger.focus();
    }

    lightbox.activeItem = null;
    lightbox.trigger = null;
  }

  function renderFeatured(lang) {
    const featuredItems = portfolioItems
      .filter((item) => item.featured)
      .sort((a, b) => {
        const aOrder = Number.isFinite(a.featuredOrder) ? a.featuredOrder : Number.POSITIVE_INFINITY;
        const bOrder = Number.isFinite(b.featuredOrder) ? b.featuredOrder : Number.POSITIVE_INFINITY;
        return aOrder - bOrder;
      });
    featuredGrid.innerHTML = "";

    featuredItems.forEach((item, index) => {
      const transitionDelay = isReducedMotion() ? "0ms" : `${Math.min(index * 70, 350)}ms`;
      const card = createFlippableCard(item, lang, "feature-card", transitionDelay, index < 2);
      featuredGrid.appendChild(card);
    });
  }

  function renderGallery(lang) {
    galleryGrid.innerHTML = "";

    const fullGalleryItems = portfolioItems.filter((item) => !excludedFullGalleryIds.has(item.id));

    fullGalleryItems.forEach((item, index) => {
      const transitionDelay = isReducedMotion() ? "0ms" : `${Math.min((index % 12) * 50, 420)}ms`;
      const card = createGalleryCard(item, lang, transitionDelay);
      galleryGrid.appendChild(card);
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

    trackedSections = Array.from(document.querySelectorAll("[data-section]"));
    scheduleActiveSectionUpdate();
  }

  function applyLanguage(lang) {
    closeImageLightbox(false);

    state.lang = lang;
    localStorage.setItem(storageKey, lang);

    updateMeta(lang);
    updateTranslationNodes(lang);
    renderAbout(lang);
    renderFeatured(lang);
    renderGallery(lang);

    const subject = lang === "no" ? "Fortellerhenvendelse" : "Storytelling Inquiry";
    contactEmail.href = `mailto:catwith9tales@gmail.com?subject=${encodeURIComponent(subject)}`;

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
      const link = event.target.closest("a[data-section-link]");
      if (link) {
        setActiveSection(link.dataset.sectionLink);
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (isImageLightboxOpen()) {
          event.preventDefault();
          closeImageLightbox();
          return;
        }

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

      scheduleActiveSectionUpdate();
    });

    window.addEventListener("scroll", scheduleActiveSectionUpdate, { passive: true });
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

  lightbox = createImageLightbox();
  initializeMenu();
  initializeLanguageButtons();
  applyLanguage(state.lang);
})();
