class DeckStage extends HTMLElement {
  connectedCallback() {
    this.setAttribute('data-screen-label', '01 Title');
    window.parent?.postMessage?.({ slideIndexChanged: 0 }, '*');
  }
}

customElements.define('deck-stage', DeckStage);
