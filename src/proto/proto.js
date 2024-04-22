// @ts-check
"use strict";

import { generateId } from "./utils/generate-id.js";
import { html } from "./utils/html.js";

import { ProtoElement } from "./proto-element.js";
import { ProtoReactivity } from "./proto-reactivity.js";

/**
 * @class
 */
export class Proto {
  /**
   * @method
   * @param {string} template
   * @return {string}
   */
  static html = html;

  /**
   * @method
   * @return {string}
   */
  static generateId = generateId;

  /**
   * @param {string} name
   * @param {CustomElementConstructor} constructor
   * @param {ElementDefinitionOptions} options
   */
  static define(name, constructor, options = {}) {
    customElements.define(name, constructor, options);
  }

  static Element = ProtoElement;
  static Reactivity = ProtoReactivity;

  /**
   * @template T
   * @param {T[]} array
   * @param {(value: T, index: number, array: T[]) => T} fn
   * @returns
   */
  static map(array, fn) {
    return array.map(fn).join("");
  }
}

// TODO:
/**
 * @method
 * @template {keyof HTMLElementTagNameMap} T
 * @param {T} tag
 * @return {HTMLElementTagNameMap[T]}
 */
// static create(tag, { params = {}, children = [] }) {
//   const element = document.createElement(tag);

//   for (let key in params) {
//     if (key === "style") {
//       Object.assign(element.style, params[key]);
//     } else {
//       element[key] = params[key];
//     }
//   }

//   children.forEach((child) => {
//     element.append(child);
//   });

//   return element;
// }
