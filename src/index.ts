export default function htmlLog(value: any): string {
  if (typeof value === 'string') {
    return `<span>&quot;${value}&quot;</span>`
  }
  if (typeof value === 'bigint') {
    return `<span>${String(value)}n</span>`
  }
  if (typeof value === 'function') {
    const name = typeof value.name === 'string' && value.name !== ''
      ? value.name
      : '(anonymous)'
    return `<span>[Function: ${name}]</span>`
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '<span>[]</span>'
    }
    const output = ['<div><span>[</span></div>']
    for (let i = 0; i < value.length - 1; i++) {
      if (!hasOwnProperty(value, i)) {
        let e = 0
        for (; i < value.length && !hasOwnProperty(value, i); e++, i++);
        if (i < value.length) {
          output.push(`<div>&nbsp;&nbsp;<span>empty &times; ${e}</span><span>,</span></div>`)
        } else {
          output.push(`<div>&nbsp;&nbsp;<span>empty &times; ${e}</span></div>`)
        }
      } else {
        output.push(`<div>&nbsp;&nbsp;${htmlLog(value[i])}<span>,</span></div>`)
      }
    }
    if (hasOwnProperty(value, value.length - 1)) {
      output.push(`<div>&nbsp;&nbsp;${htmlLog(value[value.length - 1])}</div>`)
    }
    output.push('<div><span>]</span></div>')
    return output.join('')
  }
  if (typeof value === 'object' && value != null) {
    return '<span>{}</span>'
  }
  return `<span>${String(value)}</span>`
}

function hasOwnProperty(target: object, property: string | number): boolean {
  return Object.prototype.hasOwnProperty.call(target, property)
}
