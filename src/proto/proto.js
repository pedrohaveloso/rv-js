// @ts-check

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
    customElements.define(`p-${name}`, constructor, options);
  }

  static Element = ProtoElement;
  static Reactivity = ProtoReactivity;
}
