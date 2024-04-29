// @ts-check

const Proto = {
  html: String.raw,

  /**
   * @param {string} name
   *
   * @param {{render?: () => string, after?: () => void}} body
   */
  createElement(name, body) {
    class Element extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        if (body.render) {
          shadow.innerHTML = body.render();
        }

        if (body.after) {
          body.after();
        }
      }
    }

    customElements.define(name, Element);
  },
};

export const counterElement = () =>
  Proto.createElement("counter-element", {
    render() {
      return Proto.html`
        Hello World
      `;
    },
  });
