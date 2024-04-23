// @ts-check
"use strict";

import { generateId } from "./utils/generate-id.js";
import { html } from "./utils/html.js";

import { ProtoElement } from "./proto-element.js";

export const Proto = {
  /**
   * @param {string} template
   * @return {string}
   */
  html: html,

  /**
   * @return {string}
   */
  generateId: generateId,

  Element: ProtoElement,

  /**
   * @template T
   * @param {T[]} array
   * @param {(value: T, index: number, array: T[]) => T} fn
   * @returns
   */
  map(array, fn) {
    return array.map(fn).join("");
  },

  /**
   * @param {string} name
   * @param {CustomElementConstructor} constructor
   * @param {ElementDefinitionOptions} options
   */
  define(name, constructor, options = {}) {
    customElements.define(name, constructor, options);
  },

  /**
   * @param {[
   *   string,
   *   CustomElementConstructor,
   *   ElementDefinitionOptions?
   * ][]} elements
   */
  defineAll(...elements) {
    elements.forEach((element) => {
      this.define(element[0], element[1], element[2] ?? {});
    });
  },
};
