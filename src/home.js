// @ts-check
"use strict";

import { Proto } from "./proto/proto.js";

class CounterElement extends Proto.Element {
  constructor() {
    super();
  }

  counter = this.reactive(0, "counter");

  render() {
    return Proto.html`
      <div>
        <h1>
          Counter:
          <span proto-text="counter"></span>
        </h1>
        <button id="increment">Increment</button>
      </div>
    `;
  }

  after() {
    this.select("#increment").onclick = () => {
      this.counter.value++;
    };
  }
}

Proto.Element.define("counter-el", CounterElement);
