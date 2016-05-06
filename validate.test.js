var assert = require('chai').assert;
var validate = require('./validate');

describe('validate', function() {
  describe('#validate', function () {
    it('should return an object', function () {
      assert.isObject(validate.validate("source expression", [], []));
    });

    it('should expand function tokens', function () {
      assert.deepEqual(
        validate.expandTokens(
          [
            { type: "identifier", value: "MAX" }
          ],
          ["MAX"],
          [],
          []
        ),
        [
          { column: 1, type: "function", value: "MAX" }
        ]
      );
    });

    it('should expand variable tokens', function () {
      assert.deepEqual(
        validate.expandTokens(
          [
            { type: "identifier", value: "my_var" }
          ],
          [],
          ["my_var"],
          []
        ),
        [
          { column: 1, type: "variable", value: "my_var" }
        ]
      );
    });

    it('should count columns', function () {
      assert.deepEqual(
        validate.expandTokens(
          [
            { type: "identifier", value: "a" },
            { type: "whitespace", value: " " },
            { type: "identifier", value: "b" }
          ],
          [],
          ["a", "b"],
          []
        ),
        [
          { column: 1, type: "variable", value: "a" },
          { column: 2, type: "whitespace", value: " " },
          { column: 3, type: "variable", value: "b" }
        ]
      );
    });

    it('should warn about unknown identifiers', function () {
      var warnings = [];

      validate.expandTokens(
        [
          { type: "identifier", value: "c" },
        ],
        [],
        ["a", "b"],
        warnings
      );

      assert.isTrue(warnings.length > 0);
    });

  });
});
