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
      <div>[]</div>
    `))
  })

  it('prints arrays containing one leaf element', () => {
    expect(htmlLog(['foo'])).to.equal(oneLine(`
      <div>[</div>
      <div>  <span>&quot;foo&quot;</span></div>
      <div>]</div>
    `))
  })

  it('prints arrays of multiple leaf elements', () => {
    expect(htmlLog(['foo', null, true])).to.equal(oneLine(`
      <div>[</div>
      <div>  <span>&quot;foo&quot;</span>,</div>
      <div>  <span>null</span>,</div>
      <div>  <span>true</span></div>
      <div>]</div>
    `))
  })

  it('prints sparse arrays', () => {
    // eslint-disable-next-line no-sparse-arrays
    expect(htmlLog(['foo', , , 'bar', , , , 'baz', ,])).to.equal(oneLine(`
      <div>[</div>
      <div>  <span>&quot;foo&quot;</span>,</div>
      <div>  <span>empty &times; 2</span>,</div>
      <div>  <span>&quot;bar&quot;</span>,</div>
      <div>  <span>empty &times; 3</span>,</div>
      <div>  <span>&quot;baz&quot;</span>,</div>
      <div>  <span>empty &times; 1</span></div>
      <div>]</div>
    `))
  })

})

describe('objects', () => {

  it('prints empty objects', () => {
    expect(htmlLog({})).to.equal(oneLine(`
      <div>{}</div>
    `))
  })

  it('prints leaf element properties', () => {
    const object = {
      foo: 'bar',
      baz: true,
      qux: 10
    }
    expect(htmlLog(object)).to.equal(oneLine(`
      <div>{</div>
      <div>  foo: <span>&quot;bar&quot;</span>,</div>
      <div>  baz: <span>true</span>,</div>
      <div>  qux: <span>10</span></div>
      <div>}</div>
    `))
  })

  it('quotes property keys where necessary', () => {
    const object = {
      foo: 'bar',
      'needs-quotes': true
    }
    expect(htmlLog(object)).to.equal(oneLine(`
      <div>{</div>
      <div>  foo: <span>&quot;bar&quot;</span>,</div>
      <div>  <span>&quot;needs-quotes&quot;</span>: <span>true</span></div>
      <div>}</div>
    `))
  })

  it('prints nested objects', () => {
    const object = {
      foo: 'bar',
      'needs-quotes': true,
      baz: {
        foo: 'bar',
        'needs-quotes': true
      }
    }
    expect(htmlLog(object)).to.equal(oneLine(`
      <div>{</div>
      <div>  foo: <span>&quot;bar&quot;</span>,</div>
      <div>  <span>&quot;needs-quotes&quot;</span>: <span>true</span>,</div>
      <div>  baz: {</div>
      <div>    foo: <span>&quot;bar&quot;</span>,</div>
      <div>    <span>&quot;needs-quotes&quot;</span>: <span>true</span></div>
      <div>  }</div>
      <div>}</div>
    `))
  })

  it('prints nested arrays', () => {
    const object = {
      baz: [
        42,
        null,
        false
      ],
      foo: 'bar',
      'needs-quotes': true
    }
    expect(htmlLog(object)).to.equal(oneLine(`
      <div>{</div>
      <div>  baz: [</div>
      <div>    <span>42</span>,</div>
      <div>    <span>null</span>,</div>
      <div>    <span>false</span></div>
      <div>  ],</div>
      <div>  foo: <span>&quot;bar&quot;</span>,</div>
      <div>  <span>&quot;needs-quotes&quot;</span>: <span>true</span></div>
      <div>}</div>
    `))
  })

  it('prints instances of classes')

  it('prints leaf element class index properties')

})

function oneLine(string: string): string {
  return string.split('\n').map(s => s.trim()).filter(Boolean).join('')
}
