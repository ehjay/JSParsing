var assert = require('chai').assert;
var _ = require('lodash');

var tokenize = require('./tokenize');

describe('tokenize', function() {
  describe('#tokenize', function () {
    it('should return an array', function () {
      assert.isArray(tokenize(""));
    });

    it('should tokenize whitespace', function () {
      var raw = "    ";
      var token = tokenize(raw)[0];

      assert.equal(token.type, "whitespace");
      assert.equal(token.value, "    ");
    });

    it('should tokenize identifiers', function () {
      var raw = "myName_01";
      var token = tokenize(raw)[0];

      assert.equal(token.type, "identifier");
      assert.equal(token.value, "myName_01");
    });

    it('should tokenize literals', function () {
      var raw;
      var token;

      raw = "\"my string literal\"";
      token = tokenize(raw)[0];
      assert.equal(token.type, "literal");
      assert.equal(token.value, "\"my string literal\"");

      raw = "0";
      token = tokenize(raw)[0];
      assert.equal(token.type, "literal");
      assert.equal(token.value, "0");

      raw = "2048";
      token = tokenize(raw)[0];
      assert.equal(token.type, "literal");
      assert.equal(token.value, "2048");

      raw = "0.001";
      token = tokenize(raw)[0];
      assert.equal(token.type, "literal");
      assert.equal(token.value, "0.001");

      raw = "1.0";
      token = tokenize(raw)[0];
      assert.equal(token.type, "literal");
      assert.equal(token.value, "1.0");
    });

    it('should tokenize brackets', function () {
      var raw;
      var token;

      raw = "(";
      token = tokenize(raw)[0];
      assert.equal(token.type, "(");
      assert.equal(token.value, "(");

      raw = ")";
      token = tokenize(raw)[0];
      assert.equal(token.type, ")");
      assert.equal(token.value, ")");
    });

    it('should tokenize operators', function () {
      var raw;
      var token;

      raw = "+";
      token = tokenize(raw)[0];
      assert.equal(token.type, "plus_or_minus");
      assert.equal(token.value, "+");

      raw = "-";
      token = tokenize(raw)[0];
      assert.equal(token.type, "plus_or_minus");
      assert.equal(token.value, "-");

      raw = "!=";
      token = tokenize(raw)[0];
      assert.equal(token.type, "operator");
      assert.equal(token.value, "!=");

      raw = "==";
      token = tokenize(raw)[0];
      assert.equal(token.type, "operator");
      assert.equal(token.value, "==");

      raw = ">=";
      token = tokenize(raw)[0];
      assert.equal(token.type, "operator");
      assert.equal(token.value, ">=");

      raw = ">";
      token = tokenize(raw)[0];
      assert.equal(token.type, "operator");
      assert.equal(token.value, ">");

      raw = "*";
      token = tokenize(raw)[0];
      assert.equal(token.type, "operator");
      assert.equal(token.value, "*");

      raw = "/";
      token = tokenize(raw)[0];
      assert.equal(token.type, "operator");
      assert.equal(token.value, "/");
    });

    it('should tokenize commas', function () {
      var raw = ",";
      var token = tokenize(raw)[0];

      assert.equal(token.type, ",");
      assert.equal(token.value, ",");
    });

    it('should tokenize expressions', function () {
      assert.deepEqual(tokenValues("  MAX(a + b, c)"), ["  ","MAX","(","a"," ","+"," ","b",","," ","c",")"]);
    });

    function tokenValues(source) {
      return _.map(tokenize(source), 'value');
    }
  });
});
