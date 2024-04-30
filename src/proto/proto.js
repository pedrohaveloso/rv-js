// @ts-check

const root = document.querySelector("html");

const dataElements = root?.querySelectorAll("[p\\:data]");

dataElements?.forEach((dataElement) => {
  const data = new Function(
    `return ${dataElement.getAttribute("p:data") ?? "{"}`
  )();

  const reactiveData = {};

  Object.entries(data).forEach(([name, value]) => {
    Object.defineProperty(reactiveData, name, {
      get() {
        return this[`_${name}`];
      },
      set(newValue) {
        this[`_${name}`] = newValue;

        if (this[`_r_${name}`]) {
          this[`_r_${name}`].forEach((observer) => {
            observer();
          });
        }
      },
    });

    reactiveData[name] = value;
  });

  dataElement.querySelectorAll("[p\\:text]").forEach((textElement) => {
    const name = textElement.getAttribute("p:text") ?? "";

    if (data[name] != null) {
      textElement.textContent = data[name];

      if (typeof reactiveData[`_r_${name}`] === "undefined") {
        reactiveData[`_r_${name}`] = [];
      }

      reactiveData[`_r_${name}`].push(() => {
        textElement.textContent = reactiveData[name];
      });
    }
  });

  dataElement.querySelectorAll("[p\\:on\\:click]").forEach((clickElement) => {
    const func = clickElement.getAttribute("p:on:click") ?? "";

    clickElement.addEventListener("click", () => {
      new Function("$", `${func}`)(reactiveData);
    });
  });
});
