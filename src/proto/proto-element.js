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
    /** @type {HTMLElementTagNameMap[T] | null | undefined} */
    let element = null;

    switch (key[0]) {
      case "#" || ".":
        element = this.shadow?.querySelector(
          `${key[0]}${this.id}-${key.substring(1)}`
        );

        break;

      default:
        element = this.shadow?.querySelector(key);
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
  render() {
    return "";
  }

  /** @abstract */
  after() {
    return;
  }

  /** @abstract */
  styles() {
    return "";
  }

  /**
   * @method
   * @param {HTMLCollection | undefined} children
   */
  #applyChildrenIds(children = this.shadow?.children) {
    if (!children) {
      return;
    }

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
    const elements = this.shadow?.querySelectorAll("[p-data]");

    elements?.forEach((element) => {
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
    const elements = this.shadow?.querySelectorAll(`[p-data="${name}"]`);

    elements?.forEach((element) => {
      element.innerHTML = value;
    });
  }

  connectedCallback() {
    this.id = this._opts.customId ?? generateId();

    this.shadow = this.attachShadow({ mode: "open" });

    this.shadow.innerHTML = this.render();
    this.shadow.innerHTML += this.styles();

    this.#applyChildrenIds();
    this.#load();

    this.after();
  }
}
