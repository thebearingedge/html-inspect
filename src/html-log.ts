const VALID_PROPERTY_KEY = /^[a-z_$]+[a-z0-9$_]*$/i

export default function htmlLog(value: any): string {
  if (isArray(value)) return printArray(value)
  if (isObject(value)) return printObject(value)
  return printLine(printLeaf(value))
}

type Refs = Map<any, [number, boolean]>

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
    false // whether or not a circular reference was encountered
  ])
  const lines = [
    '' // placeholder until we know of any circular references
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
    if (index === array.length) break
    const value = array[index]
    const ref = refs.get(value)
    if (typeof ref !== 'undefined') {
      ref[1] = true
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
  const [id, isCircular] = refs.get(array)!
  const ref = isCircular
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
    false // whether or not a circular reference was encountered
  ])
  const lines = [
    '' // placeholder until we know of any circular references
  ]
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index]
    const value = object[key]
    const ref = refs.get(value)
    if (typeof ref !== 'undefined') {
      ref[1] = true
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
        `${printPropertyKey(key)}: ${printLeaf(value)}`,
        indent + 2,
        index < keys.length - 1
      ))
    }
  }
  const propertyKey = typeof key === 'string'
    ? `${printPropertyKey(key)}: `
    : ''
  const [id, isCircular] = refs.get(object)!
  const ref = isCircular
    ? `<span class="reference">&lt;ref *${id}&gt;</span> `
    : ''
  lines[0] = printLine(`${propertyKey}${ref}{`, indent)
  lines.push(printLine('}', indent, comma))
  return lines.join('')
}

function printPropertyKey(key: string): string {
  return VALID_PROPERTY_KEY.test(key)
    ? escape(key)
    : `<span class="string">&quot;${escape(key)}&quot;</span>`
}

function printLeaf(value: any): string {
  if (typeof value === 'function') {
    const name = typeof value.name === 'string' && value.name !== ''
      ? value.name
      : '(anonymous)'
    return `<span class="function">[Function ${escape(name)}]</span>`
  }
  switch (typeof value) {
    case 'string':
      return `<span class="string">&quot;${escape(value)}&quot;</span>`
    case 'number':
      return `<span class="number">${escape(value)}</span>`
    case 'boolean':
      return `<span class="boolean">${escape(value)}</span>`
    case 'object':
      return `<span class="null">${escape(value)}</span>`
    case 'undefined':
      return `<span class="undefined">${escape(value)}</span>`
    case 'bigint':
      return `<span class="number">${escape(value)}n</span>`
    case 'symbol':
      return `<span class="symbol">${escape(value)}</span>`
    /* c8 ignore next 2 */
    default:
      throw new Error('unhandled type')
  }
}

function printLine(fragment: string, indent: number = 0, comma: boolean = false): string {
  return `<div>${' '.repeat(indent)}${fragment}${comma ? ',' : ''}</div>`
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

const AMPERSANDS = /&/g
const LESS_THANS = /</g
const GREATER_THANS = />/g
const DOUBLE_QUOTES = /"/g
const SINGLE_QUOTES = /'/g

function escape(value: any): string {
  return String(value)
    .replace(AMPERSANDS, '&amp;')
    .replace(LESS_THANS, '&lt;')
    .replace(GREATER_THANS, '&gt;')
    .replace(DOUBLE_QUOTES, '&quot;')
    .replace(SINGLE_QUOTES, '&apos;')
}