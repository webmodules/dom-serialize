
/**
 * Module dependencies.
 */

var encode = require('ent/encode');
var CustomEvent = require('custom-event');
var voidElements = require('void-elements').reduce(function (obj, name) {
  obj[name] = true;
  return obj;
}, {});

/**
 * Module exports.
 */

exports = module.exports = serialize;
exports.escapeHTML = encode;
exports.serializeElement = serializeElement;
exports.serializeText = serializeText;

/**
 * Serializes any DOM node. Returns a string.
 *
 * @param {Node} node
 * return {String}
 * @public
 */

function serialize (node) {
  // first emit a custom "serialize" event on `node`, in case
  // there are event listeners for custom serialization of this node
  var e = new CustomEvent('serialize', {
    bubbles: true,
    cancelable: true,
    detail: { serialize: null }
  });

  var cancelled = !node.dispatchEvent(e);
  if (cancelled) return '';

  // `e.detail.serialize` can be set to a:
  //   String - returned directly
  //   Node   - goes through serializer logic instead of `node`
  //   Anything else - get Stringified first, and then returned directly
  if (e.detail.serialize != null) {
    if ('string' === typeof e.detail.serialize.nodeType) {
      return e.detail.serialize;
    } else if ('number' === typeof e.detail.serialize.nodeType) {
      // make it go through the serialization logic below
      node = e.detail.serialize;
    } else {
      return String(e.detail.serialize);
    }
  }

  // default serialization logic
  switch (node.nodeType) {
    case 1 /* element */:
      return exports.serializeElement(node);
    case 3 /* text */:
      return exports.serializeText(node);
  }
  return '';
}

/**
 * Serialize a DOM element.
 */

function serializeElement (node) {
  var c, i, l;
  var name = node.nodeName.toLowerCase();

  // opening tag
  var r = [ '<' + name ];

  // attributes
  for (i = 0, c = node.attributes, l = c.length; i < l; i++) {
    r.push(' ' + c[i].name + '="' + exports.escapeHTML(c[i].value) + '"');
  }

  r.push('>');

  // child nodes
  for (i = 0, c = node.childNodes, l = c.length; i < l; i++) {
    r.push(serialize(c[i]));
  }

  // closing tag, only for non-void elements
  if (!voidElements[name]) {
    r.push('</' + name + '>');
  }

  return r.join('');
}

/**
 * Serialize a text node.
 */

function serializeText (node) {
  return node.nodeValue;
}
