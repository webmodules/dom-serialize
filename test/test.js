
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

});
