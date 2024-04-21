// @ts-check

import { Proto } from "./proto/proto.js";

class CounterElement extends Proto.Element {
  constructor() {
    super();
  }

  counter = new Proto.Reactivity(0);

  render() {
    this.innerHTML = Proto.html`
      <h1 id="counter-text">${this.counter.value}</h1>
      <button id="increment">Increment</button>
      <button id="decrement">Decrement</button>
    `;
  }

  after() {
    const counterText = this.select("#counter-text");

    this.counter.subscribe((value) => {
      counterText.innerText = value.toString();
    });

    this.select("#increment").onclick = () => this.counter.value++;
    this.select("#decrement").onclick = () => this.counter.value--;
  }
}

customElements.define("p-counter", CounterElement);
