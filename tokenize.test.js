var assert = require('chai').assert;
var _ = require('lodash');

var tokenize = require('./tokenize');

describe('tokenize', function() {
  describe('#tokenize', function () {
    it('should return an array', function () {
      assert.isArray(tokenize(""));
    });

    it('should tokenize whitespace', function () {
      assert.deepEqual(
        tokenize("    ")[0],
        { type: "whitespace", value: "    " }
      );
    });

    it('should tokenize identifiers', function () {
      assert.deepEqual(
        tokenize("myName_01")[0],
        { type: "identifier", value: "myName_01" }
      );
    });

    it('should tokenize literals', function () {
      assert.deepEqual(
        tokenize("\"my string literal\"")[0],
        { type: "literal", value: "\"my string literal\"" }
      );

      assert.deepEqual(
        tokenize("0")[0], 
        { type: "literal", value : "0" }
      );

      assert.deepEqual(
        tokenize("2048")[0], 
        { type: "literal", value : "2048" }
      );

      assert.deepEqual(
        tokenize("0.001")[0], 
        { type: "literal", value : "0.001" }
      );

      assert.deepEqual(
        tokenize("1.0")[0], 
        { type: "literal", value : "1.0" }
      );
    });

    it('should tokenize brackets', function () {
      assert.deepEqual(
        tokenize("(")[0],
        { type: "(", value: "(" }
      );

      assert.deepEqual(
        tokenize(")")[0],
        { type: ")", value: ")" }
      );
    });

    it('should tokenize unary and binary operators', function () {
      assert.deepEqual(
        tokenize("+")[0],
        { type: "unary_or_binary", value: "+" }
      );

      assert.deepEqual(
        tokenize("-")[0],
        { type: "unary_or_binary", value: "-" }
      );

      assert.deepEqual(
        tokenize("!=")[0],
        { type: "binary", value: "!=" }
      );

      assert.deepEqual(
        tokenize("==")[0],
        { type: "binary", value: "==" }
      );

      assert.deepEqual(
        tokenize(">=")[0],
        { type: "binary", value: ">=" }
      );

      assert.deepEqual(
        tokenize(">")[0],
        { type: "binary", value: ">" }
      );

      assert.deepEqual(
        tokenize("*")[0],
        { type: "binary", value: "*" }
      );

      assert.deepEqual(
        tokenize("/")[0],
        { type: "binary", value: "/" }
      );

      assert.deepEqual(
        tokenize(",")[0],
        { type: ",", value: "," }
      );
    });

    it('should tokenize expressions', function () {
      assert.deepEqual(tokenValues("  MAX(a + b, c)"), ["  ","MAX","(","a"," ","+"," ","b",","," ","c",")"]);
    });

    function tokenValues(source) {
      return _.map(tokenize(source), 'value');
    }
  });
});
