Element.prototype.getTagOnly = function () {
  return this.outerHTML.replace(this.innerHTML, "");
};

/**
 * Seleciona e armazena todos os elementos de dados.
 *
 * @type { NodeListOf<Element> }
 */
let dataElements = document.querySelectorAll("[\\@data]");

const elementData = [];

const echos = [];

dataElements.forEach((dataElement, dataKey) => {
  /**
   * @type { string | null }
   */
  const elementDataAttribute = dataElement.getAttribute("@data");

  if (elementDataAttribute === null || elementDataAttribute.length === 0) {
    console.warn(
      "Todo elemento de dados deve ter seu atributo @data preenchido. \n @: " +
        dataElement.getTagOnly()
    );

    return;
  }

  try {
    elementData[dataKey] = JSON.parse(
      elementDataAttribute.replace(/(\w+):/g, '"$1":').replace(/'/g, '"')
    );
  } catch (ex) {
    console.error(
      "Dados do elemento inválidos. \n @: " +
        dataElement.getTagOnly() +
        " \n @: " +
        elementDataAttribute
    );

    return;
  }

  /**
   * @param { HTMLElement } element
   */
  function applyRules(element) {
    element.childNodes.forEach((elementChild) => {
      if (typeof elementChild.tagName === "undefined") {
        return;
      }

      switch (elementChild.tagName.toLowerCase()) {
        case "echo":
          const attributeName = elementChild.attributes[0].name.replace(
            "$",
            ""
          );

          const echoText = document.createTextNode(
            elementData[dataKey][attributeName]
          );

          echos.push({
            rv: attributeName,
            fn: (value) => (echoText.nodeValue = value),
          });

          elementChild.after(echoText);
          elementChild.remove();

          break;
      }

      if (elementChild.hasAttribute("@data")) {
        dataElements = [...dataElements, ...[elementChild]];
      }

      if (elementChild.hasAttribute("@click")) {
        elementChild.onclick = (event) => {
          eval(
            elementChild
              .getAttribute("@click")
              .replaceAll("$", "elementData[dataKey].rv")
          );
          console.log(elementData);
        };
      }

      if (elementChild.children.length >= 1) {
        applyRules(elementChild);
      }
    });
  }

  applyRules(dataElement);

  elementData.forEach((data) => {
    const elementDataIterable = new Map(Object.entries(data));

    elementDataIterable.forEach((item, key) => {
      elementData[dataKey][`rv${key}`] = item;

      Object.defineProperty(elementData[dataKey], `rv${key}`, {
        get: function () {
          return this[key];
        },

        set: function (value) {
          echos.forEach((echo) => {
            if (echo.rv === key) {
              echo.fn(value);
            }
          });

          this[key] = value;
        },
      });
    });
  });
});

// function recursiveDataElement(i, dataElements) {

//   const element = dataElements[index]

//   const echos = []

//   function recursiveElement(element, data) {
//     element.childNodes.forEach((child) => {
//       if (typeof child.tagName === 'undefined') {

//         return
//       }

//       if (child.hasAttribute('@data')) {

//         dataElements = [...dataElements, ...[child]]
//       }

//       if (child.hasAttribute('@click')) {

//         child.onclick = (event) => {
//           eval(child.getAttribute('@click').replaceAll('$', 'data.rv'))
//         }
//       }

//       if (child.tagName.toLowerCase() === 'echo') {

//         const attributeVar = child.attributes[0].name

//         const text = document.createTextNode(eval('data.' + attributeVar))

//         echos.push({ rv: attributeVar, fn: (value) => text.nodeValue = value })

//         child.after(text)

//         child.remove()
//       }

//       if (child.children.length >= 1) {

//         recursiveElement(child, data)
//       }
//     })
//   }

//   recursiveElement(element, data)

//   const dataMap = new Map(Object.entries(data))

//   dataMap.forEach((item, key) => {
//     data[`rv${key}`] = item

//     Object.defineProperty(
//       data,
//       `rv${key}`,
//       {
//         get: function () {
//           return this[key]
//         },

//         set: function (value) {
//           echos.forEach((echo) => {
//             echo.fn(value)
//           })

//           this[key] = value
//         }
//       }
//     )
//   })

//   cl(data)
//   cl(echos)
// }
//
