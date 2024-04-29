// @ts-check

const Proto = {
  html: String.raw,

  /**
   * @template {keyof HTMLElementTagNameMap} T
   * @param {any} parent
   * @param {string} key
   * @param {?T} tag
   * @return {HTMLElementTagNameMap[T]}
   */
  select(parent, key, tag = null) {
    /** @type {HTMLElementTagNameMap[T] | null | undefined} */
    let element = parent.querySelector(key);

    if (element === null || element === undefined) {
      console.error(`Element ${key} (parent ${this.id}) is null or undefined.`);
    }

    return (
      element ??
      /** @type {HTMLElementTagNameMap[T]} */
      (document.createElement(String(tag)))
    );
  },

  /**
   * @param {string} name
   * @param {{template: string, mounted?: (shadow: ShadowRoot, attributes: NamedNodeMap) => void}} params
   */
  createElement(name, params) {
    customElements.define(
      name,
      class extends HTMLElement {
        constructor() {
          super();
        }

        connectedCallback() {
          const shadow = this.attachShadow({ mode: "open" });
          shadow.innerHTML = params.template;

          if (params.mounted) {
            params.mounted(shadow, this.attributes);
          }
        }
      }
    );
  },
};

Proto.createElement("p-home", {
  template: Proto.html`<main>
    <c-counter counter="10"></c-counter>
    <c-counter></c-counter>
    <c-counter></c-counter>
    <c-counter></c-counter>
  </main>`,
});

Proto.createElement("c-counter", {
  template: Proto.html`
    <h1 id="counter">0</h1>
    <button id="increment">Increment</button>
  `,

  mounted(shadow, attributes) {
    const counterText = Proto.select(shadow, "#counter");

    counterText.innerHTML = attributes["counter"].value;

    Proto.select(shadow, "#increment").onclick = (_) => {
      counterText.innerText = (Number(counterText.innerText) + 1).toString();
    };
  },
});
