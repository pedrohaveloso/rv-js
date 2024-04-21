// @ts-check

import { Proto } from "./proto/proto.js";

Proto.define(
  "counter",
  class CounterElement extends Proto.Element {
    constructor() {
      super();
    }

    counter = new Proto.Reactivity(0);

    increment() {
      console.log("a");
      this.counter.value++;
    }

    render() {
      this.innerHTML = Proto.html`
        <h1 id="value">${this.counter.value}</h1>

        <button id="increment" click="${() =>
          this.increment()}">increment</button>      
        <button id="decrement">decrement</button>      
    `;
    }

    after() {
      const h1 = this.el("#value", "h1");

      this.counter.subscribe((value) => {
        h1.innerText = value.toString();
      });

      // this.el("#increment").onclick = () => this.counter.value++;
      // this.el("#decrement").onclick = () => this.counter.value--;
    }
  }
);
