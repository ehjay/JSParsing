var assert = require('chai').assert;
var validate = require('./validate-expression');

describe('validate-expression', function() {
  describe('#validate', function () {
    it('should return true', function () {
      assert.equal(validate(), true);
    });
  });
});
