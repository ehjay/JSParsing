var assert = require('chai').assert;
var validate = require('./validate');

describe('validate', function() {
  describe('#validate', function () {
    it('should return an object', function () {
      assert.isObject(validate("source expression", [], []));
    });

    it('should warn about whitespace after a function', function () {
      var result = validate(
        "MAX   ",
        ["MAX"],
        []
      );

      assert.equal(result.warnings[0].key, "expected_a_after_b");
    });

    it('should warn about functions after variables', function () {
      var result = validate(
        "a MAX",
        ["MAX"],
        ["a"]
      );

      assert.equal(result.warnings[0].key, "expected_a_before_b");
    });

  });
});
