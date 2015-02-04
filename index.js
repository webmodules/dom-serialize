
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
 * @param {Node} node - DOM Node to serialize
 * @param {String} [context] - optional arbitrary "context" string to use (useful for event listeners)
 * @param {Function} [fn] - optional callback function to use in the "serialize" event for this call
 * return {String}
 * @public
 */

function serialize (node, context, fn) {
  if (!node) return '';
  if ('function' === typeof context) {
    fn = context;
    context = null;
  }
  if (!context) context = null;

  var rtn;
  var nodeType = node.nodeType;

  if (!nodeType && 'number' === typeof node.length) {
    // assume it's a NodeList or Array of Nodes
    rtn = exports.serializeNodeList(node, context, fn);
  } else {

    if ('function' === typeof fn) {
      // one-time "serialize" event listener
      node.addEventListener('serialize', fn, false);
    }

    // emit a custom "serialize" event on `node`, in case there
    // are event listeners for custom serialization of this node
    var e = new CustomEvent('serialize', {
      bubbles: true,
      cancelable: true,
      detail: {
        serialize: null,
        context: context
      }
    });

    if (node.dispatchEvent(e)) {

      // `e.detail.serialize` can be set to a:
      //   String - returned directly
      //   Node   - goes through serializer logic instead of `node`
      //   Anything else - get Stringified first, and then returned directly
      if (e.detail.serialize != null) {
        if ('string' === typeof e.detail.serialize) {
          rtn = e.detail.serialize;
        } else if ('number' === typeof e.detail.serialize.nodeType) {
          // make it go through the serialization logic
          rtn = serialize(e.detail.serialize, context);
        } else {
          rtn = String(e.detail.serialize);
        }
      } else {
        // default serialization logic
        switch (nodeType) {
          case 1 /* element */:
            rtn = exports.serializeElement(node, context);
            break;
          case 2 /* attribute */:
            rtn = exports.serializeAttribute(node);
            break;
          case 3 /* text */:
            rtn = exports.serializeText(node);
            break;
          case 8 /* comment */:
            rtn = exports.serializeComment(node);
            break;
          case 9 /* document */:
            rtn = exports.serializeDocument(node, context);
            break;
          case 10 /* doctype */:
            rtn = exports.serializeDoctype(node);
            break;
          case 11 /* document fragment */:
            rtn = exports.serializeDocumentFragment(node, context);
            break;
        }
      }
    }

    if ('function' === typeof fn) {
      node.removeEventListener('serialize', fn, false);
    }
  }

  return rtn || '';
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

function serializeElement (node, context) {
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
  r += exports.serializeNodeList(node.childNodes, context);

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

function serializeDocument (node, context) {
  return exports.serializeNodeList(node.childNodes, context);
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

function serializeDocumentFragment (node, context) {
  return exports.serializeNodeList(node.childNodes, context);
}

/**
 * Serialize a NodeList/Array of nodes.
 */

function serializeNodeList (list, context, fn) {
  var r = '';
  for (var i = 0, l = list.length; i < l; i++) {
    r += serialize(list[i], context, fn);
  }
  return r;
}
