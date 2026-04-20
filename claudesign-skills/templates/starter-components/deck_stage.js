class DeckStage extends HTMLElement {
  connectedCallback() {
    this.storageKey = `claude-design-deck:${location.pathname}`;
    this.stageWidth = Number.parseInt(this.getAttribute('stage-width') || '1600', 10);
    this.stageHeight = Number.parseInt(this.getAttribute('stage-height') || '900', 10);
    this.currentIndex = this.restoreIndex();
    this.attachStructure();
    this.bindEvents();
    this.updateScale();
    this.render();
  }

  attachStructure() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }

    const sections = [...this.querySelectorAll(':scope > section')];

    if (sections.length === 0) {
      const fallbackSection = document.createElement('section');

      while (this.firstChild) {
        fallbackSection.appendChild(this.firstChild);
      }

      this.appendChild(fallbackSection);
    }

    this.slides = [...this.querySelectorAll(':scope > section')];
    this.slides.forEach((slide, index) => {
      const fallbackLabel = `${String(index + 1).padStart(2, '0')} Slide`;
      slide.setAttribute('data-screen-label', slide.getAttribute('data-screen-label') || fallbackLabel);
      slide.setAttribute('data-om-validate', slide.getAttribute('data-om-validate') || 'slide-root');
    });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: relative;
          display: block;
          overflow: hidden;
          background: inherit;
          color: inherit;
        }

        :host([noscale]) .viewport {
          place-items: stretch;
        }

        :host([noscale]) .surface {
          transform: none;
          width: 100%;
          height: 100%;
        }

        .viewport {
          display: grid;
          place-items: center;
          height: 100%;
        }

        .surface {
          position: relative;
          width: ${this.stageWidth}px;
          height: ${this.stageHeight}px;
          transform-origin: top left;
          transition: transform 180ms ease-out;
        }

        ::slotted(section) {
          box-sizing: border-box;
          display: block;
          width: ${this.stageWidth}px;
          height: ${this.stageHeight}px;
        }

        .overlay {
          position: absolute;
          right: 20px;
          bottom: 18px;
          display: inline-flex;
          gap: 8px;
          align-items: center;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.8);
          color: white;
          font: 500 12px/1.2 system-ui, sans-serif;
          letter-spacing: 0.04em;
        }

        @media print {
          .overlay {
            display: none;
          }

          :host {
            display: block;
            break-inside: avoid;
          }

          .viewport,
          .surface {
            display: block;
            width: 100%;
            height: auto;
            transform: none;
          }

          ::slotted(section) {
            display: block !important;
            width: auto;
            min-height: 100vh;
            break-after: page;
          }
        }
      </style>
      <div class="viewport">
        <div class="surface">
          <slot></slot>
        </div>
      </div>
      <div class="overlay" part="overlay"></div>
    `;

    this.overlay = this.shadowRoot.querySelector('.overlay');
    this.surface = this.shadowRoot.querySelector('.surface');
  }

  bindEvents() {
    this.handleKeyDown = (event) => {
      if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        this.goToSlide(this.currentIndex + 1);
      }

      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        this.goToSlide(this.currentIndex - 1);
      }
    };

    this.handlePointerDown = (event) => {
      const midpoint = this.getBoundingClientRect().left + this.clientWidth / 2;
      this.goToSlide(event.clientX >= midpoint ? this.currentIndex + 1 : this.currentIndex - 1);
    };
    this.handleResize = () => this.updateScale();
    this.handleBeforePrint = () => this.render(true);
    this.handleAfterPrint = () => this.render();

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('beforeprint', this.handleBeforePrint);
    window.addEventListener('afterprint', this.handleAfterPrint);
    this.addEventListener('click', this.handlePointerDown);
    this.resizeObserver = new ResizeObserver(() => this.updateScale());
    this.resizeObserver.observe(this);
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('beforeprint', this.handleBeforePrint);
    window.removeEventListener('afterprint', this.handleAfterPrint);
    this.removeEventListener('click', this.handlePointerDown);
    this.resizeObserver?.disconnect();
  }

  restoreIndex() {
    const stored = Number.parseInt(localStorage.getItem(this.storageKey) || '0', 10);
    return Number.isFinite(stored) && stored >= 0 ? stored : 0;
  }

  persistIndex() {
    localStorage.setItem(this.storageKey, String(this.currentIndex));
  }

  goToSlide(nextIndex) {
    const boundedIndex = Math.max(0, Math.min(nextIndex, this.slides.length - 1));

    if (boundedIndex === this.currentIndex) {
      return;
    }

    this.currentIndex = boundedIndex;
    this.persistIndex();
    this.render();
  }

  updateScale() {
    if (!this.surface || this.hasAttribute('noscale')) {
      return;
    }

    const scale = Math.min(this.clientWidth / this.stageWidth, this.clientHeight / this.stageHeight);
    this.surface.style.transform = `scale(${Number.isFinite(scale) ? scale : 1})`;
  }

  render(showAllSlides = false) {
    this.slides.forEach((slide, index) => {
      slide.hidden = showAllSlides ? false : index !== this.currentIndex;
    });

    const currentSlide = this.slides[this.currentIndex];
    const label = currentSlide?.getAttribute('data-screen-label') || `Slide ${this.currentIndex + 1}`;

    this.setAttribute('data-screen-label', label);
    this.overlay.textContent = `${String(this.currentIndex + 1).padStart(2, '0')} / ${String(this.slides.length).padStart(2, '0')}`;
    window.parent?.postMessage?.({ slideIndexChanged: this.currentIndex }, '*');
    this.updateScale();
  }
}

if (!customElements.get('deck-stage')) {
  customElements.define('deck-stage', DeckStage);
}
