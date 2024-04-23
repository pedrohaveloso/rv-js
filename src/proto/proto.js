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
};
