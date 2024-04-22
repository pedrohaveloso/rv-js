// @ts-check
"use strict";

import { Proto } from "./proto/proto.js";

Proto.define(
  "counter",
  class CounterElement extends Proto.Element {
    constructor() {
      super();
    }

    counter = new Proto.Reactivity(0, { autoReload: [this, "counter"] });

    render() {
      this.innerHTML = Proto.html`
        <h1 p-data="counter"></h1>

        <button id="increment">increment</button>      
        <button id="decrement">decrement</button>      
      `;
    }

    after() {
      this.sel("#increment").onclick = () => (this.counter.value = 1000);
      this.sel("#decrement").onclick = () => this.counter.value--;
    }
  }
);
