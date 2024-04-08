import { cl } from "./utils/cl.js"

const dataElements = document.querySelectorAll('[\\@data]')

function recursiveDataElement(i, dataElements) {

  const element = dataElements[index]

  const data = JSON.parse(
    element.getAttribute('@data')
      .replace('$', '')
      .replace(/(\w+):/g, '"$1":')
      .replace(/'/g, '"')
  )

  const echos = []

  function recursiveElement(element, data) {
    element.childNodes.forEach((child) => {
      if (typeof child.tagName === 'undefined') {

        return
      }

      if (child.hasAttribute('@data')) {

        dataElements = [...dataElements, ...[child]]
      }

      if (child.hasAttribute('@click')) {

        child.onclick = (event) => {
          eval(child.getAttribute('@click').replaceAll('$', 'data.rv'))
        }
      }

      if (child.tagName.toLowerCase() === 'echo') {

        const attributeVar = child.attributes[0].name

        const text = document.createTextNode(eval('data.' + attributeVar))

        echos.push({ rv: attributeVar, fn: (value) => text.nodeValue = value })

        child.after(text)

        child.remove()
      }


      if (child.children.length >= 1) {

        recursiveElement(child, data)
      }
    })
  }

  recursiveElement(element, data)

  const dataMap = new Map(Object.entries(data))

  dataMap.forEach((item, key) => {
    data[`rv${key}`] = item

    Object.defineProperty(
      data,
      `rv${key}`,
      {
        get: function () {
          return this[key]
        },

        set: function (value) {
          echos.forEach((echo) => {
            echo.fn(value)
          })

          this[key] = value
        }
      }
    )
  })

  cl(data)
  cl(echos)
}

recursiveDataElement(0, dataElements)

cl(dataElements)