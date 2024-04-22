// @ts-check

import { Proto } from "./proto/proto.js";

Proto.define(
  "counter",
  class CounterElement extends Proto.Element {
    constructor() {
      super();
    }

    counter = new Proto.Reactivity(0);

    render() {
      this.innerHTML = Proto.html`
        <h1 id="value">${this.counter.value}</h1>

        <button id="increment">increment</button>      
        <button id="decrement">decrement</button>      
      `;
    }

    after() {
      const h1 = this.sel("#value", "h1");

      this.counter.subscribe((value) => {
        h1.innerText = value.toString();
      });

      this.sel("#increment").onclick = () => this.counter.value++;
      this.sel("#decrement").onclick = () => this.counter.value--;
    }
  }
);
