// @ts-check

/**
 * @class
 * @template T
 */
export class ProtoReactivity {
  /**
   * @typedef {{
   *    autoNotify?: boolean,
   *    subscribe?: ((value: T) => void)[]
   * }} opts
   */

  /**
   * @constructor
   * @param {T} initialValue
   * @param {opts} opts
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
   * @return {void}
   */
  notify() {
    this.observers.forEach((observer) => observer(this.value));
  }
}
