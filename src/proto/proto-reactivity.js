// @ts-check
"use strict";

import { ProtoElement } from "./proto-element.js";

/**
 * @class
 * @template T
 */
export class ProtoReactivity {
  /**
   * Create a reactive variable with the given initial value.
   *
   * ### Examples of uses:
   * 
   * ```js
   * const counter = new Proto.Reactivity(0);
   *
   * counter.subscribe((value) => console.log(`The value is: ${value}.`));
   *
   * counter.value = 5;  // Logs: The value is: 5.
   * counter.value = 10; // Logs: The value is: 10.
   *
   * counter.unsubscribe((value) => console.log(value));
   * ```
   * 
   * 
   * ### Reactivity in a Proto.Element:
   * 
   * ```js
   * class CounterElement extends Proto.Element {
   *   ...
   * 
   *   counter = new Proto.Reactivity(0, { autoReload: [this, "counter"] });
   *  
   *   render() {
   *     this.innerHTML = Proto.html`<h1 p-data="counter"></h1>`;
   *   }
   * }
   * ```
   * 
   * @constructor
   * @param {T} initialValue
   * @param {{
   *    autoNotify?: boolean,
   *    autoReload?: [ProtoElement, string],
   *    subscribe?: ((value: T) => void)[]
   * }} opts
   */
  constructor(initialValue, opts = { autoNotify: true }) {
    this.observers = [];

    this._opts = opts;

    Object.defineProperty(this, "value", {
      set(newValue) {
        this._value = newValue;

        if (this._opts.autoNotify !== false) {
          this.notify();
        }
      },

      get() {
        return this._value;
      },
    });

    this._opts.subscribe?.forEach((subscribe) => {
      this.subscribe(subscribe);
    });

    this.value = initialValue;
  }

  /**
   * @method
   * @param {(value: T) => void} observer
   * @return {void}
   */
  subscribe(observer) {
    this.observers.push(observer);
  }

  /**
   * @method
   * @param {(value: T) => void} observer
   * @return {void}
   */
  unsubscribe(observer) {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  /**
   * @method
   */
  #autoReload() {
    if (
      this._opts.autoReload &&
      this._opts.autoReload[0] instanceof ProtoElement
    ) {
      this._opts.autoReload[0].reload(this._opts.autoReload[1], this.value);
    }
  }

  /**
   * @method
   * @return {void}
   */
  notify() {
    this.#autoReload();

    this.observers.forEach((observer) => observer(this.value));
  }
}
