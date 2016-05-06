var assert = require('chai').assert;
var _ = require('lodash');

var tokenize = require('./tokenize');

describe('tokenize', function() {
  describe('#tokenize', function () {
    it('should return an array', function () {
      assert.isArray(tokenize(""));
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
      return _.map(tokenize(source), 'value');
    }
  });
});
