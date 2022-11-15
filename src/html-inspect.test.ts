import { expect } from 'chai'
import { JSDOM } from 'jsdom'
import { outdent } from 'outdent'
import inspect from './html-inspect'

describe('leaves', () => {

  it('prints strings', () => {
    expect(inspect('hello')).to.equal(oneLine(`
      <div><span class="string">&apos;hello&apos;</span></div>
    `))
  })

  it('prints bigints', () => {
    expect(inspect(0n)).to.equal(oneLine(`
      <div><span class="number">0n</span></div>
    `))
  })

  it('prints numbers', () => {
    expect(inspect(NaN)).to.equal(oneLine(`
      <div><span class="number">NaN</span></div>
    `))
  })

  it('prints booleans', () => {
    expect(inspect(true)).to.equal(oneLine(`
      <div><span class="boolean">true</span></div>
    `))
  })

  it('prints symbols', () => {
    expect(inspect(Symbol.iterator)).to.equal(oneLine(`
      <div><span class="symbol">Symbol(Symbol.iterator)</span></div>
    `))
  })

  it('prints null', () => {
    expect(inspect(null)).to.equal(oneLine(`
      <div><span class="null">null</span></div>
    `))
  })

  it('prints undefined', () => {
    expect(inspect(undefined)).to.equal(oneLine(`
      <div><span class="undefined">undefined</span></div>
    `))
  })

  it('prints multiple leaves on one line', () => {
    expect(inspect('hello', NaN, true, Symbol.iterator, null, undefined)).to.equal(oneLine(`
      <div>
        <span class="string">&apos;hello&apos;</span> <span class="number">NaN</span> <span class="boolean">true</span> <span class="symbol">Symbol(Symbol.iterator)</span> <span class="null">null</span> <span class="undefined">undefined</span>
      </div>
    `))
  })

})

describe('functions', () => {

  it('prints anonymous functions', () => {
    expect(inspect(function () {})).to.equal(oneLine(`
      <div><span class="function">&#402; ()</span></div>
    `))
  })

  it('prints named functions', () => {
    expect(inspect(function foo() {})).to.equal(oneLine(`
      <div><span class="function">&#402; foo()</span></div>
    `))
  })

})

describe('arrays', () => {

  it('prints empty arrays', () => {
    expect(inspect([])).to.equal(oneLine(`
      <div>
        <div>[]</div>
      </div>
    `))
  })

  it('prints arrays containing one leaf element', () => {
    expect(inspect(['foo'])).to.equal(oneLine(`
      <div>
        <div>[</div>
        <div>  <span class="string">&apos;foo&apos;</span></div>
        <div>]</div>
      </div>
    `))
  })

  it('prints arrays of multiple leaf elements', () => {
    expect(inspect(['foo', null, true])).to.equal(oneLine(`
      <div>
        <div>[</div>
        <div>  <span class="string">&apos;foo&apos;</span>,</div>
        <div>  <span class="null">null</span>,</div>
        <div>  <span class="boolean">true</span></div>
        <div>]</div>
      </div>
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
    expect(inspect(array)).to.equal(oneLine(`
      <div>
        <div>[</div>
        <div>  {</div>
        <div>    foo: <span class="string">&apos;bar&apos;</span></div>
        <div>  },</div>
        <div>  {</div>
        <div>    foo: <span class="string">&apos;bar&apos;</span></div>
        <div>  }</div>
        <div>]</div>
      </div>
    `))
  })

  it('prints nested arrays', () => {
    const array = [
      ['foo', null, true],
      ['foo', null, true]
    ]
    expect(inspect(array)).to.equal(oneLine(`
      <div>
        <div>[</div>
        <div>  [</div>
        <div>    <span class="string">&apos;foo&apos;</span>,</div>
        <div>    <span class="null">null</span>,</div>
        <div>    <span class="boolean">true</span></div>
        <div>  ],</div>
        <div>  [</div>
        <div>    <span class="string">&apos;foo&apos;</span>,</div>
        <div>    <span class="null">null</span>,</div>
        <div>    <span class="boolean">true</span></div>
        <div>  ]</div>
        <div>]</div>
      </div>
    `))
  })

  it('prints sparse arrays', () => {
    // eslint-disable-next-line no-sparse-arrays
    expect(inspect(['foo', , , 'bar', , , , 'baz'])).to.equal(oneLine(`
      <div>
        <div>[</div>
        <div>  <span class="string">&apos;foo&apos;</span>,</div>
        <div>  <span class="empty">empty &times; 2</span>,</div>
        <div>  <span class="string">&apos;bar&apos;</span>,</div>
        <div>  <span class="empty">empty &times; 3</span>,</div>
        <div>  <span class="string">&apos;baz&apos;</span></div>
        <div>]</div>
      </div>
    `))

    // eslint-disable-next-line no-sparse-arrays
    expect(inspect(['foo', , , 'bar', , , , 'baz', ,])).to.equal(oneLine(`
      <div>
        <div>[</div>
        <div>  <span class="string">&apos;foo&apos;</span>,</div>
        <div>  <span class="empty">empty &times; 2</span>,</div>
        <div>  <span class="string">&apos;bar&apos;</span>,</div>
        <div>  <span class="empty">empty &times; 3</span>,</div>
        <div>  <span class="string">&apos;baz&apos;</span>,</div>
        <div>  <span class="empty">empty &times; 1</span></div>
        <div>]</div>
      </div>
    `))
  })

  it('prints circular references', () => {
    const array: any[] = [
      ['foo', null, true]
    ]
    array[1] = array
    expect(inspect(array)).to.equal(oneLine(`
      <div>
        <div><span class="reference">&lt;ref *1&gt;</span> [</div>
        <div>  [</div>
        <div>    <span class="string">&apos;foo&apos;</span>,</div>
        <div>    <span class="null">null</span>,</div>
        <div>    <span class="boolean">true</span></div>
        <div>  ],</div>
        <div>  <span class="reference">[Circular *1]</span></div>
        <div>]</div>
      </div>
    `))
  })

})

describe('objects', () => {

  it('prints empty objects', () => {
    expect(inspect({})).to.equal(oneLine(`
      <div>
        <div>{}</div>
      </div>
    `))
  })

  it('prints leaf element properties', () => {
    const object = {
      foo: 'bar',
      baz: true,
      qux: 10
    }
    expect(inspect(object)).to.equal(oneLine(`
      <div>
        <div>{</div>
        <div>  foo: <span class="string">&apos;bar&apos;</span>,</div>
        <div>  baz: <span class="boolean">true</span>,</div>
        <div>  qux: <span class="number">10</span></div>
        <div>}</div>
      </div>
    `))
  })

  it('quotes property keys where necessary', () => {
    const object = {
      foo: 'bar',
      'needs-quotes': true
    }
    expect(inspect(object)).to.equal(oneLine(`
      <div>
        <div>{</div>
        <div>  foo: <span class="string">&apos;bar&apos;</span>,</div>
        <div>  <span class="string">&apos;needs-quotes&apos;</span>: <span class="boolean">true</span></div>
        <div>}</div>
      </div>
    `))
  })

  it('prints nested objects', () => {
    const object = {
      foo: {
        foo: 'bar',
        'needs-quotes': true
      },
      bar: 'bar',
      'needs-quotes': true
    }
    expect(inspect(object)).to.equal(oneLine(`
      <div>
        <div>{</div>
        <div>  foo: {</div>
        <div>    foo: <span class="string">&apos;bar&apos;</span>,</div>
        <div>    <span class="string">&apos;needs-quotes&apos;</span>: <span class="boolean">true</span></div>
        <div>  },</div>
        <div>  bar: <span class="string">&apos;bar&apos;</span>,</div>
        <div>  <span class="string">&apos;needs-quotes&apos;</span>: <span class="boolean">true</span></div>
        <div>}</div>
      </div>
    `))
  })

  it('prints empty nested objects', () => {
    const object = {
      foo: 'bar',
      'needs-quotes': true,
      baz: {}
    }
    expect(inspect(object)).to.equal(oneLine(`
      <div>
        <div>{</div>
        <div>  foo: <span class="string">&apos;bar&apos;</span>,</div>
        <div>  <span class="string">&apos;needs-quotes&apos;</span>: <span class="boolean">true</span>,</div>
        <div>  baz: {}</div>
        <div>}</div>
      </div>
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
    expect(inspect(object)).to.equal(oneLine(`
      <div>
        <div>{</div>
        <div>  baz: [</div>
        <div>    <span class="number">42</span>,</div>
        <div>    <span class="null">null</span>,</div>
        <div>    <span class="boolean">false</span></div>
        <div>  ],</div>
        <div>  foo: <span class="string">&apos;bar&apos;</span>,</div>
        <div>  <span class="string">&apos;needs-quotes&apos;</span>: <span class="boolean">true</span></div>
        <div>}</div>
      </div>
    `))
  })

  it('prints empty nested arrays', () => {
    const object = {
      baz: [],
      foo: 'bar',
      'needs-quotes': true
    }
    expect(inspect(object)).to.equal(oneLine(`
      <div>
        <div>{</div>
        <div>  baz: [],</div>
        <div>  foo: <span class="string">&apos;bar&apos;</span>,</div>
        <div>  <span class="string">&apos;needs-quotes&apos;</span>: <span class="boolean">true</span></div>
        <div>}</div>
      </div>
    `))
  })

  it('prints circular references', () => {
    const object = {
      foo: 1,
      bar: {}
    }
    object.bar = object
    expect(inspect(object)).to.equal(oneLine(`
      <div>
        <div><span class="reference">&lt;ref *1&gt;</span> {</div>
        <div>  foo: <span class="number">1</span>,</div>
        <div>  bar: <span class="reference">[Circular *1]</span></div>
        <div>}</div>
      </div>
    `))
  })

})

describe('html', () => {

  beforeEach(() => {
    const { window: { document, HTMLElement } } = new JSDOM('', {
      url: 'http://localhost'
    })
    Object.assign(global, { document, HTMLElement })
  })

  it('prints HTML elements', () => {

    document.body.innerHTML = outdent`
      <div>
        <h1 class="hi">Hello, World!</h1>
      </div>
    `
    const $div = document.querySelector('div')
    expect(inspect($div)).to.equal(outdent`
      <div>&lt;div&gt;
        &lt;h1 class=&apos;hi&apos;&gt;Hello, World!&lt;/h1&gt;
      &lt;/div&gt;</div>
    `)
  })

})

describe('dates', () => {

  it('prints date objects', () => {
    const date = new Date()
    expect(inspect(date)).to.equal(oneLine(`
      <div>
        <span class="date">${date}</span>
      </div>
    `))
  })

})

describe('other objects', () => {

  it("prints the object's name", () => {
    const set = new Set()
    expect(inspect(set)).to.equal(oneLine(`
      <div>
        <span class="object">Set {}</span>
      </div>
    `))
  })

})

function oneLine(string: string): string {
  return string.split('\n').map(s => s.trim()).join('')
}
