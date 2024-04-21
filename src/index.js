// @ts-check

import { Proto } from "./proto/proto.js";

Proto.define(
  "counter",
  class CounterElement extends Proto.Element {
    constructor() {
      super();
    }

    show = new Proto.Reactivity(true);
    counter = new Proto.Reactivity(0);

    render() {
      this.innerHTML = Proto.html`
      <h1 id="value">${this.counter.value}</h1>
      <button id="increment">increment</button>      
      <button id="decrement">decrement</button>      
    `;
    }

    after() {
      const h1 = this.select("#value", "h1");

      this.counter.subscribe((value) => {
        h1.innerText = value.toString();

        value > 10 ? (this.show.value = false) : (this.show.value = true);
      });

      this.show.subscribe((value) => {
        h1.style.display = value ? "flex" : "none";
      });

      this.select("#increment").onclick = () => this.counter.value++;
      this.select("#decrement").onclick = () => this.counter.value--;
    }
  }
);
