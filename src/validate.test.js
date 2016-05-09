var assert = require('chai').assert;
var validate = require('./validate');

describe('validate', function() {
  describe('#validate', function () {
    it('should return an object', function () {
      assert.isObject(validate("dumbledore", [], []));
    });

    it('should warn about whitespace after a function', function () {
      var result;
      var warning;

      result = validate("MAX   ", ["MAX"], []);
      warning = result.warnings[0];

      assert.equal(warning.column, 4);
      assert.equal(warning.key, "expected_a_after_b");
      assert.equal(warning.a, "(");
      assert.equal(warning.b, "MAX");
    });

    it('should warn about functions after variables', function () {
      var result;
      var warning;

      result = validate("a MAX", ["MAX"], ["a"]);
      warning = result.warnings[0];

      assert.equal(warning.column, 3);
      assert.equal(warning.key, "unexpected_a_b");
      assert.equal(warning.a, "function");
      assert.equal(warning.b, "MAX");
    });

  });
});
