/* global describe, it, beforeEach */
var interceptSubmits = require('../')

describe('interceptSubmits', function () {
  var event, onSubmit
  beforeEach(function () {
    event = {
      which: 1,
      preventDefault: function () {}
    }
  })

  it('should not intercept submits when not a form', function () {
    onSubmit = interceptSubmits(function () {
      throw new Error('Should not have been called!!')
    })

    event.target = document.getElementsByTagName('body')[0]

    onSubmit(event)
  })

  it('should not intercept submits when the element has rel', function () {
    onSubmit = interceptSubmits(function () {
      throw new Error('Should not have been called!!')
    })

    event.target = document.createElement('form')
    event.target.setAttribute('rel', 'nofollow')

    onSubmit(event)
  })

  it('should not intercept submits when the action is external', function () {
    onSubmit = interceptSubmits(function () {
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
