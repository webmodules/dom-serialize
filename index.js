
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
exports.serializeElement = serializeElement;
exports.serializeAttribute = serializeAttribute;
exports.serializeText = serializeText;
exports.serializeComment = serializeComment;
exports.serializeDocument = serializeDocument;
exports.serializeDoctype = serializeDoctype;
exports.serializeDocumentFragment = serializeDocumentFragment;
exports.serializeNodeList = serializeNodeList;

/**
 * Serializes any DOM node. Returns a string.
 *
 * @param {Node} node
 * return {String}
 * @public
 */

function serialize (node) {
  if (!node) return '';
  var nodeType = node.nodeType;

  if (!nodeType && 'number' === typeof node.length) {
    // assume it's a NodeList or Array of Nodes
    return exports.serializeNodeList(node);
  }

  // emit a custom "serialize" event on `node`, in case there
  // are event listeners for custom serialization of this node
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
    if ('string' === typeof e.detail.serialize) {
      return e.detail.serialize;
    } else if ('number' === typeof e.detail.serialize.nodeType) {
      // make it go through the serialization logic
      return serialize(e.detail.serialize);
    } else {
      return String(e.detail.serialize);
    }
  }

  // default serialization logic
  switch (nodeType) {
    case 1 /* element */:
      return exports.serializeElement(node);
    case 2 /* attribute */:
      return exports.serializeAttribute(node);
    case 3 /* text */:
      return exports.serializeText(node);
    case 8 /* comment */:
      return exports.serializeComment(node);
    case 9 /* document */:
      return exports.serializeDocument(node);
    case 10 /* doctype */:
      return exports.serializeDoctype(node);
    case 11 /* document fragment */:
      return exports.serializeDocumentFragment(node);
  }

  return '';
}

/**
 * Serialize an Attribute node.
 */

function serializeAttribute (node) {
  return node.name + '="' + encode(node.value, {
    named: true
  }) + '"';
}

/**
 * Serialize a DOM element.
 */

function serializeElement (node) {
  var c, i, l;
  var name = node.nodeName.toLowerCase();

  // opening tag
  var r = '<' + name;

  // attributes
  for (i = 0, c = node.attributes, l = c.length; i < l; i++) {
    r += ' ' + exports.serializeAttribute(c[i]);
  }

  r += '>';

  // child nodes
  r += exports.serializeNodeList(node.childNodes);

  // closing tag, only for non-void elements
  if (!voidElements[name]) {
    r += '</' + name + '>';
  }

  return r;
}

/**
 * Serialize a text node.
 */

function serializeText (node) {
  return encode(node.nodeValue, {
    named: true,
    special: { '<': true, '>': true, '&': true }
  });
}

/**
 * Serialize a comment node.
 */

function serializeComment (node) {
  return '<!--' + node.nodeValue + '-->';
}

/**
 * Serialize a Document node.
 */

function serializeDocument (node) {
  return exports.serializeNodeList(node.childNodes);
}

/**
 * Serialize a DOCTYPE node.
 * See: http://stackoverflow.com/a/10162353
 */

function serializeDoctype (node) {
  var r = '<!DOCTYPE ' + node.name;
  if (node.publicId) {
    r += ' PUBLIC "' + node.publicId + '"';
  }
  if (!node.publicId && node.systemId) {
    r += ' SYSTEM';
  }
  if (node.systemId) {
    r += ' "' + node.systemId + '"';
  }
  r += '>';
  return r;
}

/**
 * Serialize a DocumentFragment instance.
 */

function serializeDocumentFragment (node) {
  return exports.serializeNodeList(node.childNodes);
}

/**
 * Serialize a NodeList/Array of nodes.
 */

function serializeNodeList (list) {
  var r = '';
  for (var i = 0, l = list.length; i < l; i++) {
    r += serialize(list[i]);
  }
  return r;
}
