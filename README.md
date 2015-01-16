dom-serialize
=============
### Serializes any DOM node into a String

[![Sauce Test Status](https://saucelabs.com/browser-matrix/dom-serialize.svg)](https://saucelabs.com/u/dom-serialize)

[![Build Status](https://travis-ci.org/webmodules/dom-serialize.svg?branch=master)](https://travis-ci.org/webmodules/dom-serialize)

Works with Text nodes, DOM elements, etc.

Dispatches a custom "serialize" event on every `Node` which event listeners
can override the default behavior on by setting the `event.detail.serialize`
property to a String or other Node.


Installation
------------

``` bash
$ npm install dom-serialize
```


Example
-------

``` js
var serialize = require('dom-serialize');
var node;

// works with Text nodes
node= document.createTextNode('foo & <bar>');
console.log(serialize(node));

// works with DOM elements
node = document.createElement('body');
node.appendChild(document.createElement('strong'));
node.firstChild.appendChild(document.createTextNode('hello'));
console.log(serialize(node));

// custom "serialize" event
node.firstChild.addEventListener('serialize', function (event) {
  event.detail.serialize = 'pwn';
}, false);
console.log(serialize(node));
```

```
&#60;foo&#62; &#38; &#60;bar&#62;
<body><strong>hello</strong></body>
<body>pwn</body>
```
