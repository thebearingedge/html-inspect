const VALID_KEY = /^[a-z_$]+[a-z0-9$_]*$/i

function printLine(tokens: string, indent: number = 0, comma: boolean = false): string {
  return `<div>${' '.repeat(indent)}${tokens}${comma ? ',' : ''}</div>`
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
    return '[]'
  }
  if (typeof value === 'object' && value != null) {
    return '{}'
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
      printLine('['),
      printArrayElements(value, 2),
      printLine(']')
    ].join('')
  }
  const keys = Object.keys(value)
  return [
    printLine('{'),
    printObjectProperties(keys, value, 2),
    printLine('}')
  ].join('')
}

const objectHasOwn = Object.prototype.hasOwnProperty

function hasOwnProperty(obj: object, property: string | number): boolean {
  return objectHasOwn.call(obj, property)
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
  const lines = []
  for (let index = 0; index < array.length; index++) {
    let empty = 0
    while (!hasOwnProperty(array, index) && index < array.length) {
      empty++
      index++
    }
    if (empty > 0) {
      lines.push(printLine(
        `<span>empty &times; ${empty}</span>`,
        indent,
        index < array.length - 1
      ))
    }
    if (index >= array.length) break
    if (isLeaf(array[index])) {
      lines.push(printLine(
        printLeaf(array[index]),
        indent,
        index < array.length - 1
      ))
    }
  }
  return lines.join('')
}

function printObjectProperties<T>(keys: Array<keyof T>, obj: T, indent: number): string {
  const lines = []
  for (let index = 0; index < keys.length; index++) {
    lines.push(printLine(
      printProperty(keys[index], obj),
      indent,
      index < keys.length - 1
    ))
  }
  return lines.join('')
}

function printPropertyKey(key: string): string {
  return VALID_KEY.test(key)
    ? key
    : `<span>&quot;${key}&quot;</span>`
}

function printProperty<T>(key: keyof T, object: T): string {
  if (isLeaf(object[key])) {
    return `${printPropertyKey(String(key))}:&nbsp;${printLeaf(object[key])}`
  }
  return ''
}
