var assert = require('chai').assert;
var tokenizer = require('./tokenizer');

describe('tokenizer', function() {
  describe('#tokenizer', function () {
    it('should return an array', function () {
      assert.isArray(tokenizer(""));
    });

    it('should tokenize identifiers', function () {
      assert.deepEqual(tokenizer("myName_01"), ["myName_01"]);
    });

    it('should tokenize literals', function () {
      assert.deepEqual(tokenizer("\"my string literal\""), ["\"my string literal\""]);
      assert.deepEqual(tokenizer("0"), ["0"]);
      assert.deepEqual(tokenizer("2048"), ["2048"]);
      assert.deepEqual(tokenizer("0.001"), ["0.001"]);
      assert.deepEqual(tokenizer("1.0"), ["1.0"]);
    });

    it('should tokenize expressions', function () {
      assert.deepEqual(tokenizer("  MAX(a + b, c)"), ["  ","MAX","(","a"," ","+"," ","b",","," ","c",")"]);
    });
  });
});
