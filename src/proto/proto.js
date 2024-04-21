// @ts-check

import { generateId } from "./utils/generate-id.js";
import { html } from "./utils/html.js";

import { ProtoElement } from "./proto-element.js";
import { ProtoReactivity } from "./proto-reactivity.js";

/**
 * @class
 */
export class Proto {
  static html = html;

  /**
   * @method
   * @return {string}
   */
  static generateId = generateId;

  static Element = ProtoElement;
  static Reactivity = ProtoReactivity;
}
