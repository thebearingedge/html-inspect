import { expect } from 'chai'
import htmlLog from '.'

describe('primitives', () => {

  it('prints strings', () => {
    const output = htmlLog('this is a string')
    expect(output).to.equal('<span>&quot;this is a string&quot;</span>')
  })

  it('prints bigints', () => {
    const output = htmlLog(0n)
    expect(output).to.equal('<span>0n</span>')
  })

  it('prints numbers', () => {
    const output = htmlLog(42)
    expect(output).to.equal('<span>42</span>')
  })

  it('prints booleans', () => {
    const output = htmlLog(true)
    expect(output).to.equal('<span>true</span>')
  })

  it('prints symbols', () => {
    const output = htmlLog(Symbol('yo'))
    expect(output).to.equal('<span>Symbol(yo)</span>')
  })

  it('prints null', () => {
    const output = htmlLog(null)
    expect(output).to.equal('<span>null</span>')
  })

  it('prints undefined', () => {
    const output = htmlLog(undefined)
    expect(output).to.equal('<span>undefined</span>')
  })

})

describe('functions', () => {

  it('prints anonymous functions', () => {
    const output = htmlLog(function () {})
    expect(output).to.equal('<span>[Function: (anonymous)]</span>')
  })

  it('prints named functions', () => {
    const output = htmlLog(function foo() {})
    expect(output).to.equal('<span>[Function: foo]</span>')
  })

})

describe('arrays', () => {

  it('prints empty arrays', () => {
    const output = htmlLog([])
    expect(output).to.equal('<span>[]</span>')
  })

  it('prints sparse arrays', () => {
    // eslint-disable-next-line no-sparse-arrays
    expect(htmlLog(['yes', , , , , , 'yes'])).to.equal(oneLine(`
    <div><span>[</span></div>
      <div>&nbsp;&nbsp;<span>&quot;yes&quot;</span><span>,</span></div>
      <div>&nbsp;&nbsp;<span>empty &times; 5</span><span>,</span></div>
      <div>&nbsp;&nbsp;<span>&quot;yes&quot;</span></div>
      <div><span>]</span></div>
      `))
    // eslint-disable-next-line no-sparse-arrays
    expect(htmlLog([, , 'yes', 'yes', ,])).to.equal(oneLine(`
      <div><span>[</span></div>
        <div>&nbsp;&nbsp;<span>empty &times; 2</span><span>,</span></div>
        <div>&nbsp;&nbsp;<span>&quot;yes&quot;</span><span>,</span></div>
        <div>&nbsp;&nbsp;<span>&quot;yes&quot;</span><span>,</span></div>
        <div>&nbsp;&nbsp;<span>empty &times; 2</span><span></span></div>
      <div><span>]</span></div>
    `))
  })

  it('prints arrays containing one primitive', () => {
    const output = htmlLog(['yes'])
    expect(output).to.equal(oneLine(`
      <div><span>[</span></div>
      <div>&nbsp;&nbsp;<span>&quot;yes&quot;</span></div>
      <div><span>]</span></div>
    `))
  })

  it('prints arrays of multiple primitives', () => {
    const input = [false, null, undefined, 0, 0n, '', Symbol('')]
    const output = htmlLog(input)
    expect(output).to.equal(oneLine(`
      <div><span>[</span></div>
      <div>&nbsp;&nbsp;<span>false</span><span>,</span></div>
      <div>&nbsp;&nbsp;<span>null</span><span>,</span></div>
      <div>&nbsp;&nbsp;<span>undefined</span><span>,</span></div>
      <div>&nbsp;&nbsp;<span>0</span><span>,</span></div>
      <div>&nbsp;&nbsp;<span>0n</span><span>,</span></div>
      <div>&nbsp;&nbsp;<span>&quot;&quot;</span><span>,</span></div>
      <div>&nbsp;&nbsp;<span>Symbol()</span></div>
      <div><span>]</span></div>
    `))
  })

})

describe('objects', () => {

  it('prints empty objects', () => {
    const output = htmlLog({})
    expect(output).to.equal('<span>{}</span>')
  })

  it('prints primitive properties')

  it('quotes property keys where necessary')

  it('prints empty instances of classes')

  it('prints primitive class index properties')

})

function oneLine(string: string): string {
  return string.split('\n').map(s => s.trim()).filter(Boolean).join('')
}
