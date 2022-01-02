const VALID_KEY = /^[a-z_$]+[a-z0-9$_]*$/i

export default function htmlLog(value: any): string {
  if (isArray(value)) return printArray(value)
  if (isObject(value)) return printObject(value)
  return printLine(printLeaf(value))
}

function printArray(array: any[], indent: number = 0, comma: boolean = false, key?: string): string {
  if (array.length === 0) {
    return printLine('[]', indent, comma)
  }
  const lines = [
    typeof key === 'string'
      ? printLine(`${printPropertyKey(key)}: [`, indent)
      : printLine('[', indent)
  ]
  for (let index = 0; index < array.length; index++) {
    let empty = 0
    while (!hasOwnProperty(array, index) && index < array.length) {
      empty++
      index++
    }
    if (empty > 0) {
      lines.push(printLine(
        `<span>empty &times; ${empty}</span>`,
        indent + 2,
        index < array.length - 1
      ))
    }
    if (index >= array.length) break
    if (!isArray(array[index]) && !isObject(array[index])) {
      lines.push(printLine(
        printLeaf(array[index]),
        indent + 2,
        index < array.length - 1
      ))
    }
  }
  lines.push(printLine(']', indent, comma))
  return lines.join('')
}

function printObject(object: {[key: string]: any }, indent: number = 0, comma: boolean = false, key?: string): string {
  const keys = Object.keys(object)
  if (keys.length === 0) {
    return printLine('{}', indent, comma)
  }
  const lines = [
    typeof key === 'string'
      ? printLine(`${printPropertyKey(key)}: {`, indent)
      : printLine('{', indent)
  ]
  for (let index = 0; index < keys.length; index++) {
    if (isObject(object[keys[index]])) {
      lines.push(printObject(
        object[keys[index]],
        indent + 2,
        index < keys.length - 1,
        keys[index]
      ))
    } else {
      lines.push(printLine(
        `${printPropertyKey(String(keys[index]))}: ${printLeaf(object[keys[index]])}`,
        indent + 2,
        index < keys.length - 1
      ))
    }
  }
  lines.push(printLine('}', indent, comma))
  return lines.join('')
}

function printPropertyKey(key: string): string {
  return VALID_KEY.test(key)
    ? key
    : `<span>&quot;${key}&quot;</span>`
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
  if (typeof value === 'bigint') {
    return `<span>${String(value)}n</span>`
  }
  return `<span>${String(value)}</span>`
}

function printLine(tokens: string, indent: number = 0, comma: boolean = false): string {
  return `<div>${' '.repeat(indent)}${tokens}${comma ? ',' : ''}</div>`
}

function isArray(value: any): value is any[] {
  return Array.isArray(value)
}

function isObject(value: any): value is { [key: string]: any } {
  return typeof value === 'object' && value !== null
}

function hasOwnProperty(obj: object, property: string | number): boolean {
  return Object.prototype.hasOwnProperty.call(obj, property)
}
