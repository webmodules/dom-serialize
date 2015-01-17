
1.1.0 / 2015-01-16
==================

  * add support for Comment, Document, Doctype, DocumentFragment and NodeList types to be serialized
  * add .travis.yml file
  * add Makefile for zuul tests
  * add README.md file
  * index: run `e.detail.serialize` through all the serialize() logic
  * index: use += operator for String concatentation (faster)
  * index: use `require('ent/encode')` syntax
  * package: update "ent" to v2.2.0
  * package: rename to "dom-serialize"
  * test: add Array serialize test

1.0.0 / 2015-01-15
==================

  * index: add support for Nodes to be set on `e.data.serialize`
  * index: remove redundant `break` statements
  * test: add `e.detail.serialize` Node and Number tests
  * test: add "serialize" event tests
  * test: add initial test cases
  * package: add "string" as a keyword
  * package: add "zuul" as a dev dependency
  * package: use ~ for dep versions
  * initial commit
