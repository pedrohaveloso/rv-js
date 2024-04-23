// @ts-check
"use strict";

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
   * @template {keyof HTMLElementTagNameMap} T
   * @param {string} key
   * @param {?T} tag
   * @return {HTMLElementTagNameMap[T]}
   */
  select(key, tag = null) {
    /** @type {HTMLElementTagNameMap[T] | null | undefined} */
    let element = this.shadow?.querySelector(key);

    if (element === null || element === undefined) {
      console.error(`Element ${key} (parent ${this.id}) is null or undefined.`);
    }

    return (
      element ??
      /** @type {HTMLElementTagNameMap[T]} */
      (document.createElement(String(tag)))
    );
  }

  /** @abstract */
  render() {
    return "";
  }

  /** @abstract */
  after() {
    return;
  }

  reactiveData = {};

  /**
   * @template T
   * @param {T} value
   * @param {string} name
   */
  reactive(value, name) {
    this.reactiveData[name] = value;

    /** @param {T} newValue */
    const updateReactiveData = (newValue) => {
      value = newValue;

      if (this.shadow) {
        this.#reload(this.shadow, name, value);
      }
    };

    const getReactiveData = () => value;

    return {
      get value() {
        return getReactiveData();
      },

      set value(newValue) {
        updateReactiveData(newValue);
      },
    };
  }

  /**
   * @param {ShadowRoot} shadow
   */
  #load(shadow) {
    /** @param {Element} element */
    const elementMsg = (element) => `Element: ${element.outerHTML}`;

    shadow.querySelectorAll("[proto\\:text]").forEach((element) => {
      const protoText = element.getAttribute("proto:text");

      if (protoText === null || !(protoText in this.reactiveData)) {
        console.error(
          `No reactive data for "${protoText}". ${elementMsg(element)}`
        );

        return;
      }

      element.textContent = this.reactiveData[protoText];
    });

    shadow.querySelectorAll("[proto\\:onclick]").forEach((element) => {
      const protoOnClick = element.getAttribute("proto:onclick");

      if (protoOnClick === null || !(protoOnClick in this)) {
        console.error(
          `No onclick function for "${protoOnClick}". ${elementMsg(element)}`
        );

        return;
      }

      if ("onclick" in element) {
        element.onclick = () => {
          this[element.getAttribute("proto:onclick") ?? ""]();
        };
      }
    });
  }

  /**
   * @template T
   * @param {ShadowRoot} shadow
   * @param {string} name
   * @param {T} value
   */
  #reload(shadow, name, value) {
    shadow.querySelectorAll(`[proto\\:text="${name}"]`).forEach((element) => {
      element.textContent = String(value);
    });
  }

  connectedCallback() {
    this.id = this._opts.customId ?? generateId();

    this.shadow = this.attachShadow({ mode: "open" });

    this.shadow.innerHTML = this.render();

    this.#load(this.shadow);

    this.after();
  }
}
