/**
 * Intercepts clicks on a given element
 *
 */
var Interceptor = module.exports = function interceptSubmits (el, opts, cb) {
  // Options and element are optional
  if (typeof el === 'function') {
    cb = el
    opts = {}
    el = window
  } else if (typeof opts === 'function') {
    cb = opts
    opts = {}
    // Duck-typing here because you can bind events to the window just fine
    // also, it might be good to bind to synthetic objects
    // to be able to mimic dom events
    if (typeof el.addEventListener !== 'function') {
      opts = el
      el = window
    }
  }

  // cb and el are required
  if (typeof cb !== 'function' || !el) {
    return
  }

  // Create submit callback
  var submitCb = Interceptor.onSubmit(opts, cb)

  // Bind the event
  el.addEventListener('submit', submitCb, false)

  // Returns the off function
  return function () {
    el.removeEventListener('submit', submitCb, false)
  }
}

/**
 * On click handler that intercepts clicks based on options
 *
 * @function onClick
 * @param {Event} e
 */
Interceptor.onSubmit = function (opts, cb) {
  // Options are optional
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }

  // cb is required and must be a function
  if (typeof cb !== 'function') {
    return
  }

  // Default options to true
  [
    'dialog',
    'get',
    'post',
    'mailTo',
    'sameOrigin',
    'target'
  ].forEach(function (key) {
    opts[key] = typeof opts[key] !== 'undefined' ? opts[key] : true
  })

  // Return the event handler
  return function (e) {
    // Cross browser event
    e = e || window.event

    // Find form up the dom tree
    var el = Interceptor.isForm(e.target)

    //
    // Ignore if tag has
    //

    // 1. Not a form
    if (!el) {
      return
    }

    // 2. rel="external" attribute
    if (opts.checkExternal && el.getAttribute('rel') === 'external') {
      return
    }

    // 3. target attribute
    if (opts.target && (el.target && el.target !== '_self')) {
      return
    }

    var method = el.getAttribute('method')

    if (!opts.post && method && method === 'post') {
      return
    }

    if (!opts.get && method && method === 'get') {
      return
    }

    if (!opts.get && method && method === 'dialog') {
      return
    }

    // Get the form action
    var action = el.getAttribute('action')

    // Check for mailto: in the action
    if (opts.mailTo && action && action.indexOf('mailto:') > -1) {
      return
    }

    // Only for same origin
    if (opts.sameOrigin && !Interceptor.sameOrigin(action)) {
      return
    }
    // All tests passed, intercept the submit
    cb(e, el)
  }
}

Interceptor.isForm = function (el) {
  while (el && el.nodeName !== 'FORM') {
    el = el.parentNode
  }
  if (!el || el.nodeName !== 'FORM') {
    return
  }
  return el
}

/**
 * Get the pressed button
 *
 */
Interceptor.which = function (e) {
  return e.which === null ? e.button : e.which
}

/**
 * Internal request
 *
 */
Interceptor.isInternal = new RegExp('^(?:(?:http[s]?://)?' + window.location.host.replace(/\./g, '\\.') + ')?/?[#?]?', 'i')
Interceptor.sameOrigin = function (url) {
  return !!Interceptor.isInternal.test(url)
}
