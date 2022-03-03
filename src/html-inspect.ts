export default function inspect(...values: any[]): string {
  const html = values.map(value => {
    if (typeof HTMLElement !== 'undefined' &&
      value instanceof HTMLElement) {
      return escape(value.outerHTML)
    }
    if (isArray(value)) return printArray(value)
    if (isObject(value)) return printObject(value)
    return printLeaf(value)
  }).join(' ')
  return `<div>${html}</div>`
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
    if (isArray(value) || isObject(value)) {
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
      } else {
        lines.push(printObject(
          value,
          refs,
          indent + 2,
          index < array.length - 1
        ))
      }
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
    if (isArray(value) || isObject(value)) {
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
      } else {
        lines.push(printObject(
          value,
          refs,
          indent + 2,
          index < keys.length - 1,
          key
        ))
      }
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

const VALID_PROPERTY_KEY = /^[a-z_$]+[a-z0-9$_]*$/i

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
  if (value instanceof Date) {
    return `<span class="date">${value}</span>`
  }
  if (value === null) {
    return `<span class="null">${value}</span>`
  }
  switch (typeof value) {
    case 'string':
      return `<span class="string">&quot;${escape(value)}&quot;</span>`
    case 'object':
      return `<span class="object">${escape(getConstructorName(value))} {}</span>`
    case 'bigint':
      return `<span class="number">${escape(value)}n</span>`
    default:
      return `<span class="${typeof value}">${escape(value)}</span>`
  }
}

function printLine(fragment: string, indent: number = 0, comma: boolean = false): string {
  return `<div>${' '.repeat(indent)}${fragment}${comma ? ',' : ''}</div>`
}

function isArray(value: any): value is any[] {
  return Array.isArray(value)
}

function isObject(value: any): value is { [key: string]: any } {
  return Object.prototype.toString.call(value) === '[object Object]'
}

function hasOwnProperty(object: object, property: string | number): boolean {
  return Object.prototype.hasOwnProperty.call(object, property)
}

function getConstructorName(object: object): string {
  return Object.prototype.toString.call(object).match(/\[object (.+)\]/)![1]
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
