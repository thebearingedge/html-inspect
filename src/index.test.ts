import { expect } from 'chai'
import htmlLog from '.'

describe('leaves', () => {

  it('prints strings', () => {
    expect(htmlLog('hello')).to.equal(oneLine(`
      <div><span>&quot;hello&quot;</span></div>
    `))
  })

  it('prints bigints', () => {
    expect(htmlLog(0n)).to.equal(oneLine(`
      <div><span>0n</span></div>
    `))
  })

  it('prints numbers', () => {
    expect(htmlLog(NaN)).to.equal(oneLine(`
      <div><span>NaN</span></div>
    `))
  })

  it('prints booleans', () => {
    expect(htmlLog(true)).to.equal(oneLine(`
      <div><span>true</span></div>
    `))
  })

  it('prints symbols', () => {
    expect(htmlLog(Symbol.iterator)).to.equal(oneLine(`
      <div><span>Symbol(Symbol.iterator)</span></div>
    `))
  })

  it('prints null', () => {
    expect(htmlLog(null)).to.equal(oneLine(`
      <div><span>null</span></div>
    `))
  })

  it('prints undefined', () => {
    expect(htmlLog(undefined)).to.equal(oneLine(`
      <div><span>undefined</span></div>
    `))
  })

})

describe('functions', () => {

  it('prints anonymous functions', () => {
    expect(htmlLog(function () {})).to.equal(oneLine(`
      <div><span>[Function (anonymous)]</span></div>
    `))
  })

  it('prints named functions', () => {
    expect(htmlLog(function foo() {})).to.equal(oneLine(`
      <div><span>[Function foo]</span></div>
    `))
  })

})

describe('arrays', () => {

  it('prints empty arrays', () => {
    expect(htmlLog([])).to.equal(oneLine(`
      <div><span>[]</span></div>
    `))
  })

  it('prints arrays containing one leaf element', () => {
    expect(htmlLog(['foo'])).to.equal(oneLine(`
      <div><span>[</span></div>
      <div>&nbsp;&nbsp;<span>&quot;foo&quot;</span></div>
      <div><span>]</span></div>
    `))
  })

  it('prints arrays of multiple leaf elements', () => {
    expect(htmlLog(['foo', null, true])).to.equal(oneLine(`
      <div><span>[</span></div>
      <div>&nbsp;&nbsp;<span>&quot;foo&quot;</span><span>,</span></div>
      <div>&nbsp;&nbsp;<span>null</span><span>,</span></div>
      <div>&nbsp;&nbsp;<span>true</span></div>
      <div><span>]</span></div>
    `))
  })

  it('prints sparse arrays', () => {
    // eslint-disable-next-line no-sparse-arrays
    expect(htmlLog(['foo', , , 'bar', , , , 'baz', ,])).to.equal(oneLine(`
      <div><span>[</span></div>
      <div>&nbsp;&nbsp;<span>&quot;foo&quot;</span><span>,</span></div>
      <div>&nbsp;&nbsp;<span>empty &times; 2</span><span>,</span></div>
      <div>&nbsp;&nbsp;<span>&quot;bar&quot;</span><span>,</span></div>
      <div>&nbsp;&nbsp;<span>empty &times; 3</span><span>,</span></div>
      <div>&nbsp;&nbsp;<span>&quot;baz&quot;</span><span>,</span></div>
      <div>&nbsp;&nbsp;<span>empty &times; 1</span></div>
      <div><span>]</span></div>
    `))
  })

})

describe('objects', () => {

  it('prints empty objects', () => {
    expect(htmlLog({})).to.equal(oneLine(`
      <div><span>{}</span></div>
    `))
  })

  it('prints leaf element properties')

  it('quotes property keys where necessary')

  it('prints empty instances of classes')

  it('prints leaf element class index properties')

})

function oneLine(string: string): string {
  return string.split('\n').map(s => s.trim()).filter(Boolean).join('')
}
