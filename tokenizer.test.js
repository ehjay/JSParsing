const assert = require('chai').assert;
const _ = require('lodash');

const tokenizer = require('./tokenizer');

describe('tokenizer', function() {
  describe('#tokenizer', function () {
    it('should return an array', function () {
      assert.isArray(tokenizer(""));
    });

    it('should tokenize identifiers', function () {
      assert.deepEqual(tokenValues("myName_01"), ["myName_01"]);
    });

    it('should tokenize literals', function () {
      assert.deepEqual(tokenValues("\"my string literal\""), ["\"my string literal\""]);
      assert.deepEqual(tokenValues("0"), ["0"]);
      assert.deepEqual(tokenValues("2048"), ["2048"]);
      assert.deepEqual(tokenValues("0.001"), ["0.001"]);
      assert.deepEqual(tokenValues("1.0"), ["1.0"]);
    });

    it('should tokenize expressions', function () {
      assert.deepEqual(tokenValues("  MAX(a + b, c)"), ["  ","MAX","(","a"," ","+"," ","b",","," ","c",")"]);
    });

    function tokenValues(source) {
      return _.map(tokenizer(source), 'value');
    }
  });
});
