import { expect } from 'chai'
import htmlLog from '.'

describe('leaves', () => {

  it('prints strings', () => {
    expect(htmlLog('hello')).to.equal(oneLine(`
      <div><span class="string">&quot;hello&quot;</span></div>
    `))
  })

  it('prints bigints', () => {
    expect(htmlLog(0n)).to.equal(oneLine(`
      <div><span class="number">0n</span></div>
    `))
  })

  it('prints numbers', () => {
    expect(htmlLog(NaN)).to.equal(oneLine(`
      <div><span class="number">NaN</span></div>
    `))
  })

  it('prints booleans', () => {
    expect(htmlLog(true)).to.equal(oneLine(`
      <div><span class="boolean">true</span></div>
    `))
  })

  it('prints symbols', () => {
    expect(htmlLog(Symbol.iterator)).to.equal(oneLine(`
      <div><span class="symbol">Symbol(Symbol.iterator)</span></div>
    `))
  })

  it('prints null', () => {
    expect(htmlLog(null)).to.equal(oneLine(`
      <div><span class="null">null</span></div>
    `))
  })

  it('prints undefined', () => {
    expect(htmlLog(undefined)).to.equal(oneLine(`
      <div><span class="undefined">undefined</span></div>
    `))
  })

})

describe('functions', () => {

  it('prints anonymous functions', () => {
    expect(htmlLog(function () {})).to.equal(oneLine(`
      <div><span class="function">[Function (anonymous)]</span></div>
    `))
  })

  it('prints named functions', () => {
    expect(htmlLog(function foo() {})).to.equal(oneLine(`
      <div><span class="function">[Function foo]</span></div>
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
      <div>  <span class="string">&quot;foo&quot;</span></div>
      <div>]</div>
    `))
  })

  it('prints arrays of multiple leaf elements', () => {
    expect(htmlLog(['foo', null, true])).to.equal(oneLine(`
      <div>[</div>
      <div>  <span class="string">&quot;foo&quot;</span>,</div>
      <div>  <span class="null">null</span>,</div>
      <div>  <span class="boolean">true</span></div>
      <div>]</div>
    `))
  })

  it('prints nested objects', () => {
    const array = [
      {
        foo: 'bar'
      },
      {
        foo: 'bar'
      }
    ]
    expect(htmlLog(array)).to.equal(oneLine(`
      <div>[</div>
      <div>  {</div>
      <div>    foo: <span class="string">&quot;bar&quot;</span></div>
      <div>  },</div>
      <div>  {</div>
      <div>    foo: <span class="string">&quot;bar&quot;</span></div>
      <div>  }</div>
      <div>]</div>
    `))
  })

  it('prints nested arrays', () => {
    const array = [
      ['foo', null, true],
      ['foo', null, true]
    ]
    expect(htmlLog(array)).to.equal(oneLine(`
      <div>[</div>
      <div>  [</div>
      <div>    <span class="string">&quot;foo&quot;</span>,</div>
      <div>    <span class="null">null</span>,</div>
      <div>    <span class="boolean">true</span></div>
      <div>  ],</div>
      <div>  [</div>
      <div>    <span class="string">&quot;foo&quot;</span>,</div>
      <div>    <span class="null">null</span>,</div>
      <div>    <span class="boolean">true</span></div>
      <div>  ]</div>
      <div>]</div>
    `))
  })

  it('prints sparse arrays', () => {
    // eslint-disable-next-line no-sparse-arrays
    expect(htmlLog(['foo', , , 'bar', , , , 'baz', ,])).to.equal(oneLine(`
      <div>[</div>
      <div>  <span class="string">&quot;foo&quot;</span>,</div>
      <div>  <span class="empty">empty &times; 2</span>,</div>
      <div>  <span class="string">&quot;bar&quot;</span>,</div>
      <div>  <span class="empty">empty &times; 3</span>,</div>
      <div>  <span class="string">&quot;baz&quot;</span>,</div>
      <div>  <span class="empty">empty &times; 1</span></div>
      <div>]</div>
    `))
  })

  it('prints circular references', () => {
    const array: any[] = [
      ['foo', null, true]
    ]
    array[1] = array
    expect(htmlLog(array)).to.equal(oneLine(`
      <div><span class="reference">&lt;ref *1&gt;</span> [</div>
      <div>  [</div>
      <div>    <span class="string">&quot;foo&quot;</span>,</div>
      <div>    <span class="null">null</span>,</div>
      <div>    <span class="boolean">true</span></div>
      <div>  ],</div>
      <div>  <span class="reference">[Circular *1]</span></div>
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
      <div>  foo: <span class="string">&quot;bar&quot;</span>,</div>
      <div>  baz: <span class="boolean">true</span>,</div>
      <div>  qux: <span class="number">10</span></div>
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
      <div>  foo: <span class="string">&quot;bar&quot;</span>,</div>
      <div>  <span class="string">&quot;needs-quotes&quot;</span>: <span class="boolean">true</span></div>
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
      <div>  foo: <span class="string">&quot;bar&quot;</span>,</div>
      <div>  <span class="string">&quot;needs-quotes&quot;</span>: <span class="boolean">true</span>,</div>
      <div>  baz: {</div>
      <div>    foo: <span class="string">&quot;bar&quot;</span>,</div>
      <div>    <span class="string">&quot;needs-quotes&quot;</span>: <span class="boolean">true</span></div>
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
      <div>    <span class="number">42</span>,</div>
      <div>    <span class="null">null</span>,</div>
      <div>    <span class="boolean">false</span></div>
      <div>  ],</div>
      <div>  foo: <span class="string">&quot;bar&quot;</span>,</div>
      <div>  <span class="string">&quot;needs-quotes&quot;</span>: <span class="boolean">true</span></div>
      <div>}</div>
    `))
  })

  it('prints circular references', () => {
    const object = {
      foo: 1,
      bar: {}
    }
    object.bar = object
    expect(htmlLog(object)).to.equal(oneLine(`
      <div><span class="reference">&lt;ref *1&gt;</span> {</div>
      <div>  foo: <span class="number">1</span>,</div>
      <div>  bar: <span class="reference">[Circular *1]</span></div>
      <div>}</div>
    `))
  })

})

function oneLine(string: string): string {
  return string.split('\n').map(s => s.trim()).join('')
}
