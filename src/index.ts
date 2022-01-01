const NBSP = '&nbsp;'

function printLine(tokens: string, indent: number = 0, comma: boolean = false): string {
  return `<div>${NBSP.repeat(indent)}${tokens}${comma ? '<span>,</span>' : ''}</div>`
}

function printLeaf(value: any): string {
  if (typeof value === 'function') {
    const name = typeof value.name === 'string' && value.name !== ''
      ? value.name
      : '(anonymous)'
    return `<span>[Function ${name}]</span>`
  }
  if (typeof value === 'string') {
    return `<span>&quot;${value}&quot;</span>`
  }
  if (Array.isArray(value)) {
    return '<span>[]</span>'
  }
  if (typeof value === 'object' && value != null) {
    return '<span>{}</span>'
  }
  if (typeof value === 'bigint') {
    return `<span>${String(value)}n</span>`
  }
  return `<span>${String(value)}</span>`
}

export default function htmlLog(value: any): string {
  if (isLeaf(value)) {
    return printLine(printLeaf(value))
  }
  if (Array.isArray(value)) {
    return [
      printLine('<span>[</span>'),
      printArrayElements(value, 2),
      printLine('<span>]</span>')
    ].join('')
  }
  return ''
}

const objectHasOwn = Object.prototype.hasOwnProperty

function hasOwnProperty(target: object, property: string | number): boolean {
  return objectHasOwn.call(target, property)
}

function isLeaf(value: any): boolean {
  return typeof value === 'string' ||
         typeof value === 'number' ||
         typeof value === 'boolean' ||
         value == null ||
         (Array.isArray(value) && value.length === 0) ||
         (typeof value === 'object' && Object.keys(value).length === 0) ||
         typeof value === 'function' ||
         typeof value === 'symbol' ||
         typeof value === 'bigint'
}

function printArrayElements(array: any[], indent: number): string {
  const elements = []
  for (let index = 0; index < array.length; index++) {
    let empty = 0
    while (!hasOwnProperty(array, index) && index < array.length) {
      empty++
      index++
    }
    if (empty > 0) {
      elements.push(printLine(
        `<span>empty &times; ${empty}</span>`,
        indent,
        index < array.length - 1
      ))
    }
    if (index >= array.length) break
    if (isLeaf(array[index])) {
      elements.push(printLine(
        printLeaf(array[index]),
        indent,
        index < array.length - 1
      ))
    }
  }
  return elements.join('')
}

function printPropertyKey(key: string, indent: number = 2): string {

  return ''
}

function printProperty(key: string, value: any, comma: boolean): string {

  return ''
}

function printObject(obj: object, keys: string[], indent: number = 0): string {
  // empty object
  // non-empty object
  // object as property value (indented)
  // object as array element (indented from start)
  /**
   * {}
   *
   * {
   *   foo: "bar",
   *   "needs-quotes": true
   * }
   *
   * {
   *   foo: "bar",
   *   "needs-quotes": true,
   *   nested: {
   *     foo: "bar",
   *     "needs-quotes": true
   *   }
   * }
   *
   * [
   *   {
   *     foo: "bar",
   *     "needs-quotes": true
   *   },
   *   {
   *     foo: "bar",
   *     "needs-quotes": true
   *   }
   * ]
   */
  return ''
}
