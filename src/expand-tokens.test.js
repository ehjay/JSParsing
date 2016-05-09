var assert = require('chai').assert;
var expandTokens = require('./expand-tokens');

describe('expand-tokens', function() {
  describe('#expand-tokens', function () {

    it('should expand function tokens', function () {
      assert.deepEqual(
        expandTokens(
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
        expandTokens(
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
        expandTokens(
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

      expandTokens(
        [
          { type: "identifier", value: "c" }
        ],
        [],
        ["a", "b"],
        warnings
      );

      assert.equal(warnings[0].key, "unknown_identifier_a");
    });
  });
});
