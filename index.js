/**
 * Intercepts clicks on a given element
 *
 */
const Interceptor = module.exports = function interceptSubmits (el, opts, cb) {
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
  const submitCb = Interceptor.onSubmit(opts, cb)

  // Bind the event
  el.addEventListener('submit', submitCb, false)

  // Returns the off function
  return () => {
    el.removeEventListener('submit', submitCb, false)
  }
}

/**
 * On click handler that intercepts clicks based on options
 *
 * @function onClick
 * @param {opts} opts
 */
Interceptor.onSubmit = (opts, cb) => {
  // Options are optional
  if (typeof opts === 'function') {
    cb = opts
  }

  // cb is required and must be a function
  if (typeof cb !== 'function') {
    return
  }

  // Default options to true
  const options = {
    dialog: true,
    get: true,
    post: true,
    mailTo: true,
    sameOrigin: true,
    target: true,
    ...(opts && opts.constructor === Object ? opts : {})
  }

  // Return the event handler
  return (e) => {
    // Cross browser event
    e = e || window.event

    // Find form up the dom tree
    const el = Interceptor.findForm(e.target)

    //
    // Ignore if tag has
    //

    // 1. Not a form
    if (!el) {
      return
    }

    // 2. rel="external" attribute
    if (options.checkExternal && el.getAttribute('rel') === 'external') {
      return
    }

    // 3. target attribute
    if (options.target && (el.target && el.target !== '_self')) {
      return
    }

    const method = el.getAttribute('method')

    // 4. the method is post and the post option is false
    if (!options.post && method && method === 'post') {
      return
    }

    // 4. the method is get or dialog and the respective option is false
    if (!options.get && method && ['get', 'dialog'].includes(method)) {
      return
    }

    // Get the form action
    const action = el.getAttribute('action')

    // Check for mailto: in the action
    if (options.mailTo && action && action.indexOf('mailto:') > -1) {
      return
    }

    // Only for same origin
    if (options.sameOrigin && !Interceptor.sameOrigin(action)) {
      return
    }
    // All tests passed, intercept the submit
    cb(e, el)
  }
}

Interceptor.findForm = (el) => {
  while (el && el.nodeName !== 'FORM') {
    el = el.parentNode
  }
  if (!el || el.nodeName !== 'FORM') {
    return false
  }
  return el
}

/**
 * Get the pressed button
 *
 */
Interceptor.which = (e) => {
  return e.which === null ? e.button : e.which
}

/**
 * Internal request
 *
 */
Interceptor.isInternal = new RegExp('^(?:(?:http[s]?://)?' + window.location.host.replace(/\./g, '\\.') + ')?/?[#?]?', 'i')
Interceptor.sameOrigin = (url) => {
  return Interceptor.isInternal.test(url)
}
