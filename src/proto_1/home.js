// @ts-check
"use strict";

import { Proto } from "./proto.js";

Proto.define(
  "counter-el",
  class CounterElement extends Proto.Element {
    constructor() {
      super();
    }

    counter = this.reactive(0, "counter");

    increment() {
      this.counter.value++;
    }

    render() {
      return Proto.html`
        <div>
          <h1>
            Hello.
          </h1>
          <p proto:text="counter"></p>
          <button proto:onclick="increment">Increment</button>
        </div>
      `;
    }
  }
);
