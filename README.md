# Intercept Form Submits

This module is mainly to intercept applicable form submits for a single-page app router.  The options are geared toward intercepting internal links that should change the page state in some way.

## Install

```
$ npm i intercept-form-submits
```

## Usage

```javascript
var interceptSubmits = require('intercept-form-submits');

interceptSubmits(function(e, el) {
	// Change the page state here
	// `e` is the event object
	// `el` is the submitted form, which might be different from `e.target`
});
```

A more advanced usage is to pass options and an optional element:

```javascript
interceptSubmits(document.querySelector('.my-el'), {
	//
	// Leave all these as defaults:
	//
	// dialog: true
	// get: true
	// post: true
	// mailTo: true
	// sameOrigin: true
	// target: true
	// Intercept all submits, even ones that are not same origin
	sameOrigin: false
}, function(e, el) {
	// Change the page state here
});
```

Thanks [Wes Todd](https://github.com/wesleytodd) for [Intercept Link Clicks](https://github.com/wesleytodd/intercept-link-clicks) on which this module is heavily based.
