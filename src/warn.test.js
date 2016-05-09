var assert = require('chai').assert;
var warn = require('./warn');

describe('warn', function() {
  describe('#warn', function () {

    it('should add warnings', function () {
      var warnings = [];

      warn(1, warnings, "unknown_identifier_a", "dumbledore");

      assert.isTrue(warnings.length > 0);
    });

    it('should create warnings with columns, keys and messages', function () {
      var warnings = [];

      warn(1, warnings, "unknown_identifier_a", "harry");

      assert.property(warnings[0], "column");
      assert.property(warnings[0], "key");
      assert.property(warnings[0], "message");

      assert.equal(warnings[0].column, 1);
      assert.equal(warnings[0].key, "unknown_identifier_a");
    });

  });
});
