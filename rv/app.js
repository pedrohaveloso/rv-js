Element.prototype.getTagOnly = function () {
  return this.outerHTML.replace(this.innerHTML, "");
};

/**
 * Seleciona e armazena todos os elementos de dados.
 *
 * @type { NodeListOf<Element> }
 */
const dataElements = document.querySelectorAll("[\\@data]");

dataElements.forEach((dataElement) => {
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

  /**
   * @type { Map<string, any> | null }
   */
  let elementData = null;

  try {
    elementData = new Map(
      Object.entries(
        JSON.parse(
          elementDataAttribute
            .replace("$", "")
            .replace(/(\w+):/g, '"$1":')
            .replace(/'/g, '"')
        )
      )
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

  console.log(elementData);
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
