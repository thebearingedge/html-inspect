const VALID_KEY = /^[a-z_$]+[a-z0-9$_]*$/i

export default function htmlLog(value: any): string {
  if (isArray(value)) return printArray(value)
  if (isObject(value)) return printObject(value)
  return printLine(printLeaf(value))
}

type Refs = Map<any, [number, number]>

function printArray(
  array: any[],
  refs: Refs = new Map(),
  indent: number = 0,
  comma: boolean = false,
  key?: string
): string {
  if (array.length === 0) {
    return printLine('[]', indent, comma)
  }
  refs.set(array, [
    refs.size + 1, // unique id for this array
    0 // number of additional references counted
  ])
  const lines = [
    '' // placeholder until we have a reference count
  ]
  for (let index = 0; index < array.length; index++) {
    let empty = 0
    while (!hasOwnProperty(array, index) && index < array.length) {
      empty++
      index++
    }
    if (empty > 0) {
      lines.push(printLine(
        `<span class="empty">empty &times; ${empty}</span>`,
        indent + 2,
        index < array.length - 1
      ))
    }
    if (index >= array.length) break
    const value = array[index]
    const ref = refs.get(value)
    if (typeof ref !== 'undefined') {
      ref[1]++
      lines.push(printLine(
        `<span class="reference">[Circular *${ref[0]}]</span>`,
        indent + 2,
        index < array.length - 1
      ))
    } else if (isArray(value)) {
      lines.push(printArray(
        value,
        refs,
        indent + 2,
        index < array.length - 1
      ))
    } else if (isObject(value)) {
      lines.push(printObject(
        value,
        refs,
        indent + 2,
        index < array.length - 1
      ))
    } else {
      lines.push(printLine(
        printLeaf(value),
        indent + 2,
        index < array.length - 1
      ))
    }
  }
  const propertyKey = typeof key === 'string'
    ? `${printPropertyKey(key)}: `
    : ''
  const [id, count] = refs.get(array)!
  const ref = count > 0
    ? `<span class="reference">&lt;ref *${id}&gt;</span> `
    : ''
  lines[0] = printLine(`${propertyKey}${ref}[`, indent)
  lines.push(printLine(']', indent, comma))
  return lines.join('')
}

function printObject(
  object: { [key: string]: any },
  refs: Refs = new Map(),
  indent: number = 0,
  comma: boolean = false,
  key?: string
): string {
  const keys = Object.keys(object)
  if (keys.length === 0) {
    return printLine('{}', indent, comma)
  }
  refs.set(object, [
    refs.size + 1, // unique id for this object
    0 // number of additional references counted
  ])
  const lines = [
    '' // placeholder until we have a reference count
  ]
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index]
    const value = object[key]
    const ref = refs.get(value)
    if (typeof ref !== 'undefined') {
      ref[1]++
      lines.push(printLine(
        `${printPropertyKey(key)}: <span class="reference">[Circular *${ref[0]}]</span>`,
        indent + 2,
        index < keys.length - 1
      ))
    } else if (isArray(value)) {
      lines.push(printArray(
        value,
        refs,
        indent + 2,
        index < keys.length - 1,
        key
      ))
    } else if (isObject(value)) {
      lines.push(printObject(
        value,
        refs,
        indent + 2,
        index < keys.length - 1,
        key
      ))
    } else {
      lines.push(printLine(
        `${printPropertyKey(key)}: ${printLeaf(object[key])}`,
        indent + 2,
        index < keys.length - 1
      ))
    }
  }
  const propertyKey = typeof key === 'string'
    ? `${printPropertyKey(key)}: `
    : ''
  const [id, count] = refs.get(object)!
  const ref = count > 0
    ? `<span class="reference">&lt;ref *${id}&gt;</span> `
    : ''
  lines[0] = printLine(`${propertyKey}${ref}{`, indent)
  lines.push(printLine('}', indent, comma))
  return lines.join('')
}

function printPropertyKey(key: string): string {
  return VALID_KEY.test(key)
    ? key
    : `<span class="string">&quot;${key}&quot;</span>`
}

function printLeaf(value: any): string {
  if (typeof value === 'function') {
    const name = typeof value.name === 'string' && value.name !== ''
      ? value.name
      : '(anonymous)'
    return `<span class="function">[Function ${name}]</span>`
  }
  switch (typeof value) {
    case 'string':
      return `<span class="string">&quot;${value}&quot;</span>`
    case 'number':
      return `<span class="number">${String(value)}</span>`
    case 'boolean':
      return `<span class="boolean">${String(value)}</span>`
    case 'object':
      return `<span class="null">${String(value)}</span>`
    case 'undefined':
      return `<span class="undefined">${String(value)}</span>`
    case 'bigint':
      return `<span class="number">${String(value)}n</span>`
    case 'symbol':
      return `<span class="symbol">${String(value)}</span>`
    /* c8 ignore next 2 */
    default:
      return `<span>${String(value)}</span>`
  }
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
