document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');
  const currentYearEl = document.getElementById('currentYear');

  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------------
     1. Sticky Header on Scroll
     ------------------------------------------------------------------------ */
  const handleHeaderScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ------------------------------------------------------------------------
     2. Mobile Navigation Drawer
     ------------------------------------------------------------------------ */
  const toggleMobileMenu = (forceClose = false) => {
    if (!mobileToggle || !mobileDrawer) return;
    const isOpen = forceClose ? false : !mobileDrawer.classList.contains('open');

    mobileDrawer.classList.toggle('open', isOpen);
    mobileToggle.classList.toggle('active', isOpen);
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
    mobileDrawer.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => toggleMobileMenu());
  }

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMobileMenu(true));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
      toggleMobileMenu(true);
    }
  });

  /* ------------------------------------------------------------------------
     3. Scroll Reveal Observer
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------------------
     4. Portfolio Category Filter
     ------------------------------------------------------------------------ */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedCategory = btn.getAttribute('data-filter');

      filterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      portfolioCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        const shouldShow = selectedCategory === 'all' || cardCategory === selectedCategory;

        if (shouldShow) {
          card.classList.remove('is-hidden');
          card.classList.add('is-visible');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
     5. Preset Environment Select from Architects CTA
     ------------------------------------------------------------------------ */
  const presetTriggers = document.querySelectorAll('[data-preset]');
  const environmentSelect = document.getElementById('environmentType');

  presetTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const presetValue = trigger.getAttribute('data-preset');
      if (environmentSelect && presetValue) {
        environmentSelect.value = presetValue;
      }
    });
  });

  /* ------------------------------------------------------------------------
     6. Phone Input Mask & Project Form Submission
     ------------------------------------------------------------------------ */
  const phoneInput = document.getElementById('clientWhatsapp');
  const projectForm = document.getElementById('projectForm');
  const formSuccess = document.getElementById('formSuccess');
  const successSummary = document.getElementById('successSummary');
  const whatsappRedirectBtn = document.getElementById('whatsappRedirectBtn');
  const resetFormBtn = document.getElementById('resetFormBtn');

  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let digits = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (digits.length > 6) {
        digits = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
      } else if (digits.length > 2) {
        digits = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      } else if (digits.length > 0) {
        digits = `(${digits}`;
      }
      e.target.value = digits;
    });
  }

  if (projectForm) {
    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('clientName');
      const envInput = document.getElementById('environmentType');
      const projectRadio = projectForm.querySelector('input[name="hasProject"]:checked');

      let isValid = true;

      [nameInput, phoneInput, envInput].forEach((field) => {
        if (!field) return;
        field.classList.remove('input-error');
        if (!field.value.trim()) {
          field.classList.add('input-error');
          isValid = false;
        }
      });

      if (phoneInput && phoneInput.value.replace(/\D/g, '').length < 10) {
        phoneInput.classList.add('input-error');
        isValid = false;
      }

      if (!isValid) return;

      const clientName = nameInput.value.trim();
      const clientPhone = phoneInput.value.trim();
      const environment = envInput.value;
      const hasProject = projectRadio ? projectRadio.value : 'Não informado';

      const message = [
        `Olá, equipe CRIART! Meu nome é ${clientName}.`,
        `Gostaria de solicitar um orçamento personalizado.`,
        `• Ambiente: ${environment}`,
        `• Projeto arquitetônico: ${hasProject}`,
        `• WhatsApp para contato: ${clientPhone}`
      ].join('\n');

      const whatsappUrl = `https://wa.me/5549999999999?text=${encodeURIComponent(message)}`;

      if (successSummary) {
        successSummary.textContent = `Obrigado, ${clientName}. Preparamos os detalhes para o ambiente "${environment}". Clique abaixo para iniciar seu atendimento direto no WhatsApp da Criart.`;
      }

      if (whatsappRedirectBtn) {
        whatsappRedirectBtn.href = whatsappUrl;
      }

      projectForm.hidden = true;
      if (formSuccess) {
        formSuccess.hidden = false;
      }
    });
  }

  if (resetFormBtn && projectForm && formSuccess) {
    resetFormBtn.addEventListener('click', () => {
      projectForm.reset();
      projectForm.hidden = false;
      formSuccess.hidden = true;
    });
  }
});
