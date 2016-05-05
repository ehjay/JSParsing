var assert = require('chai').assert;
var parser = require('./expression-parser');

describe('expression-parser', function() {
  describe('#toTokenStream', function () {
    it('should return an array', function () {
      assert.isArray(parser.toTokenStream(""));
    });

    it('should return a token stream', function () {
      assert.deepEqual(parser.toTokenStream("a"), ["a"]);
      assert.deepEqual(parser.toTokenStream("  MAX(a + b, c)"), ["  ","MAX","(","a"," ","+"," ","b",","," ","c",")"]);
    });
  });
});
