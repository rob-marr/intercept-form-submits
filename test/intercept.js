/* global describe, it, beforeEach */
const interceptSubmits = require('../')

describe('interceptSubmits', () => {
  let event, onSubmit
  beforeEach(() => {
    event = {
      which: 1,
      preventDefault: () => {}
    }
  })

  it('should not intercept submits when not a form', () => {
    onSubmit = interceptSubmits(() => {
      throw new Error('Should not have been called!!')
    })

    event.target = document.getElementsByTagName('body')[0]

    onSubmit(event)
  })

  it('should not intercept submits when the element has rel', () => {
    onSubmit = interceptSubmits(() => {
      throw new Error('Should not have been called!!')
    })

    event.target = document.createElement('form')
    event.target.setAttribute('rel', 'nofollow')

    onSubmit(event)
  })

  it('should not intercept submits when the action is external', () => {
    onSubmit = interceptSubmits(() => {
      throw new Error('Should not have been called!!')
    })

    event.target = document.createElement('form')

    event.target.setAttribute('action', 'https://tester.com')
    onSubmit(event)

    event.target.setAttribute('action', 'http//tester.com')
    onSubmit(event)

    event.target.setAttribute('action', '//tester.com')
    onSubmit(event)
  })
})
