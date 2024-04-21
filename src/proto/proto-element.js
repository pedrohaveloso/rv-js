// @ts-check

import { generateId } from "./utils/generate-id.js";

/**
 * @class
 * @abstract
 */
export class ProtoElement extends HTMLElement {
  /**
   * @constructor
   * @param {{customId: string|null}} opts
   */
  constructor(opts = { customId: null }) {
    super();

    this._opts = opts;
  }

  /**
   * @method
   * @template {keyof HTMLElementTagNameMap} T
   * @param {string} key
   * @param {?T} tag
   * @return {HTMLElementTagNameMap[T]}
   */
  el(key, tag = null) {
    /** @type {HTMLElementTagNameMap[T] | null} */
    let element = null;

    switch (key[0]) {
      case "#" || ".":
        element = this.querySelector(`${key[0]}${this.id}-${key.substring(1)}`);

        break;

      default:
        element = this.querySelector(key);
    }

    if (element === null) {
      console.error(`Element ${key} (parent ${this.id}) is null.`);
    }

    return (
      element ??
      /** @type {HTMLElementTagNameMap[T]} */
      (document.createElement(String(tag)))
    );
  }

  /** @abstract */
  render() {}

  /** @abstract */
  after() {}

  /**
   * @method
   * @param {HTMLCollection} children
   */
  applyChildrenIds(children) {
    for (const child of children) {
      if (child.children.length > 0) {
        this.applyChildrenIds(child.children);
      }

      if (child.id !== null && child.id !== "") {
        child.id = `${this.id}-${child.id}`;
      }
    }
  }

  connectedCallback() {
    this.id = this._opts.customId ?? generateId();

    this.render();
    this.applyChildrenIds(this.children);
    this.after();
  }
}
