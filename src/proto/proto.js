// @ts-check

const root = document.querySelector("html");

const dataElements = root?.querySelectorAll("[\\$data]");

dataElements?.forEach((dataElement) => {
  const data = new Function(
    `return { ${dataElement.getAttribute("$data") ?? ""} }`
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

  dataElement.querySelectorAll("[\\$text]").forEach((textElement) => {
    const name = textElement.getAttribute("$text") ?? "";

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

  dataElement.querySelectorAll("[\\$onclick]").forEach((clickElement) => {
    const func = clickElement.getAttribute("$onclick") ?? "";

    clickElement.addEventListener("click", () => {
      new Function("$", `${func}`)(reactiveData);
    });
  });

  dataElement.querySelectorAll("input[\\$bind]").forEach((inputElement) => {
    const names = inputElement.getAttribute("$bind")?.split(", ");

    inputElement.addEventListener("input", () => {
      // @ts-ignore
      names.forEach((name) => {
        reactiveData[name] = inputElement.value;
      });
    });
  });
});
