
var assert = require('assert');
var serialize = require('../');

describe('node-serialize', function () {

  it('should serialize a SPAN element', function () {
    var node = document.createElement('span');
    assert.equal('<span></span>', serialize(node));
  });

  it('should serialize a BR element', function () {
    var node = document.createElement('br');
    assert.equal('<br>', serialize(node));
  });

  it('should serialize a text node', function () {
    var node = document.createTextNode('test');
    assert.equal('test', serialize(node));
  });

  it('should serialize a text node with special HTML characters', function () {
    var node = document.createTextNode('<>\'"&');
    assert.equal('&lt;&gt;\'"&amp;', serialize(node));
  });

  it('should serialize a DIV element with child nodes', function () {
    var node = document.createElement('div');
    node.appendChild(document.createTextNode('hello '));
    var b = document.createElement('b');
    b.appendChild(document.createTextNode('world'));
    node.appendChild(b);
    node.appendChild(document.createTextNode('!'));
    node.appendChild(document.createElement('br'));
    assert.equal('<div>hello <b>world</b>!<br></div>', serialize(node));
  });

  it('should serialize a DIV element with attributes', function () {
    var node = document.createElement('div');
    node.setAttribute('foo', 'bar');
    node.setAttribute('escape', '<>&"\'');
    assert.equal('<div foo="bar" escape="&lt;&gt;&amp;&quot;&apos;"></div>', serialize(node));
  });

  it('should serialize an Attribute node', function () {
    var div = document.createElement('div');
    div.setAttribute('foo', 'bar');
    var node = div.attributes[0];
    assert.equal('foo="bar"', serialize(node));
  });

  it('should serialize a Comment node', function () {
    var node = document.createComment('test');
    assert.equal('<!--test-->', serialize(node));
  });

  it('should serialize a Document node', function () {
    var node = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html');
    assert.equal('<html></html>', serialize(node));
  });

  it('should serialize a Doctype node', function () {
    var node = document.implementation.createDocumentType(
      'html',
      '-//W3C//DTD XHTML 1.0 Strict//EN',
      'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'
    );
    assert.equal('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">', serialize(node));
  });

  it('should serialize a DocumentFragment node', function () {
    var node = document.createDocumentFragment();
    node.appendChild(document.createElement('b'));
    node.appendChild(document.createElement('i'));
    node.lastChild.appendChild(document.createTextNode('foo'));
    assert.equal('<b></b><i>foo</i>', serialize(node));
  });

  it('should emit a "serialize" event on a DIV node', function () {
    var node = document.createElement('div');
    var count = 0;
    node.addEventListener('serialize', function (e) {
      count++;
      e.detail.serialize = 'MEOW';
    });
    assert.equal(0, count);
    assert.equal('MEOW', serialize(node));
    assert.equal(1, count);
  });

  it('should emit a "serialize" event on a Text node', function () {
    var node = document.createTextNode('whaaaaa!!!!!!');
    var count = 0;
    node.addEventListener('serialize', function (e) {
      count++;
      e.detail.serialize = 'MEOW';
    });
    assert.equal(0, count);
    assert.equal('MEOW', serialize(node));
    assert.equal(1, count);
  });

  it('should output an empty string when "serialize" event is cancelled', function () {
    var node = document.createElement('div');
    node.appendChild(document.createTextNode('!'));
    var count = 0;
    node.firstChild.addEventListener('serialize', function (e) {
      count++;
      e.preventDefault();
    });
    assert.equal(0, count);
    assert.equal('<div></div>', serialize(node));
    assert.equal(1, count);
  });

  it('should render a Number when set as `e.detail.serialize`', function () {
    var node = document.createTextNode('whaaaaa!!!!!!');
    var count = 0;
    node.addEventListener('serialize', function (e) {
      count++;
      e.detail.serialize = 123;
    });
    assert.equal(0, count);
    assert.equal('123', serialize(node));
    assert.equal(1, count);
  });

  it('should render a Node when set as `e.detail.serialize`', function () {
    var node = document.createTextNode('whaaaaa!!!!!!');
    var count = 0;
    node.addEventListener('serialize', function (e) {
      count++;
      e.detail.serialize = document.createTextNode('foo');
    });
    assert.equal(0, count);
    assert.equal('foo', serialize(node));
    assert.equal(1, count);
  });

});
