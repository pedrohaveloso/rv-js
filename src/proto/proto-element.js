// @ts-check
"use strict";

import { ProtoReactivity } from "./proto-reactivity.js";
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
  select(key, tag = null) {
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
      console.error(`Element ${key} (parent ${this.id}) is null or undefined.`);
    }

    return (
      element ??
      /** @type {HTMLElementTagNameMap[T]} */
      (document.createElement(String(tag)))
    );
  }

  /**
   * @method
   * @template {keyof HTMLElementTagNameMap} T
   * @param {string} key
   * @param {?T} tag
   * @return {HTMLElementTagNameMap[T]}
   */
  sel(key, tag = null) {
    return this.select(key, tag);
  }

  /** @abstract */
  render() {}

  /** @abstract */
  after() {}

  /**
   * @method
   * @param {HTMLCollection} children
   */
  #applyChildrenIds(children = this.children) {
    for (const child of children) {
      if (child.children.length > 0) {
        this.#applyChildrenIds(child.children);
      }

      if (child.id !== null && child.id !== "") {
        child.id = `${this.id}-${child.id}`;
      }
    }
  }

  /**
   * @method
   */
  #load() {
    const elements = this.querySelectorAll("[p-data]");

    elements.forEach((element) => {
      const protoData = element.getAttribute("p-data");

      if (!protoData) {
        console.error(
          `Proto-data of element (parent: ${this.id}) is empty. \n Element: ${element.outerHTML}`
        );

        return;
      }

      if (typeof this[protoData] === "undefined") {
        console.error(
          `Proto-data "${protoData}" (parent: ${this.id}) does not exist in class. \n Element: ${element.outerHTML}`
        );

        return;
      }

      if (!(this[protoData] instanceof ProtoReactivity)) {
        console.error(
          `Proto-data "${protoData}" (parent: ${this.id}) is not a valid type (Proto.Reactivity). \n Element: ${element.outerHTML}`
        );

        return;
      }

      element.innerHTML = this[protoData]["value"];
    });
  }

  /**
   * @method
   * @param {string} name
   * @param {any} value
   */
  reload(name, value) {
    const elements = this.querySelectorAll(`[p-data="${name}"]`);

    elements.forEach((element) => {
      element.innerHTML = value;
    });
  }

  connectedCallback() {
    this.id = this._opts.customId ?? generateId();

    this.render();

    this.#applyChildrenIds();
    this.#load();

    this.after();
  }
}
