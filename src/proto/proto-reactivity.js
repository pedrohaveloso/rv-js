// @ts-check

/**
 * @class
 * @template T
 */
export class ProtoReactivity {
  /**
   * @constructor
   * @param {T} initialValue
   * @param {{autoNotify: boolean}} opts
   */
  constructor(initialValue, opts = { autoNotify: true }) {
    this.observers = [];
    this.opts = opts;

    Object.defineProperty(this, "value", {
      set(newValue) {
        this._value = newValue;

        if (this.opts.autoNotify) {
          this.notify();
        }
      },

      get() {
        return this._value;
      },
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

  unsubscribe(observer) {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  notify() {
    this.observers.forEach((observer) => observer(this.value));
  }
}
