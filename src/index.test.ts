import { expect } from 'chai'
import theThing from '.'

describe('the thing', () => {

  it('maybe', () => {
    expect(theThing).to.be.a('string')
  })

})
