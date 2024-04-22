// @ts-check
"use strict";

import { Proto } from "./proto/proto.js";

class HomePage extends Proto.Element {
  constructor() {
    super();
  }

  cards = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  ];

  render() {
    return Proto.html`
      <header>
        <h1>Home Page</h1>
      </header>
      
      <main>
        ${Proto.map(this.cards, (card) => {
          return Proto.html`<card-element text="${card}"></card-element>`;
        })}
      </main>

      <footer></footer>
    `;
  }

  styles() {
    return Proto.html`
      <style>
        main {
          display: flex;
          justify-content: justify-between;
        }
      </style>
    `;
  }
}

class CardElement extends Proto.Element {
  constructor() {
    super();
  }

  text = this.getAttribute("text") ?? "";
  likedText = new Proto.Reactivity("No", { autoReload: [this, "likedText"] });

  render() {
    return Proto.html`
      <article>
        <p>${this.text}</p>
        <button id="like" p-data="likedText"></button>
      </article>
    `;
  }

  after() {
    const likeButton = this.sel("#like");

    likeButton.onclick = () => {
      this.likedText.value = this.likedText.value == "Yes" ? "No" : "Yes";
    };
  }
}

Proto.define("card-element", CardElement);
Proto.define("home-page", HomePage);
