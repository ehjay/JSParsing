var assert = require('chai').assert;
var tokenizer = require('./tokenizer');

describe('tokenizer', function() {
  describe('#tokenizer', function () {
    it('should return an array', function () {
      assert.isArray(tokenizer(""));
    });

    it('should return a token stream', function () {
      assert.deepEqual(tokenizer("a"), ["a"]);
      assert.deepEqual(tokenizer("  MAX(a + b, c)"), ["  ","MAX","(","a"," ","+"," ","b",","," ","c",")"]);
    });
  });
});
