
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
    assert.equal('<div foo="bar" escape="&#60;&#62;&#38;&#34;&#39;"></div>', serialize(node));
  });

});
