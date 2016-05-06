var assert = require('chai').assert;
var tokenFactory = require('./token');

describe('token', function() {
  describe('#Token', function () {
    it('should return an object', function () {
      assert.isObject(tokenFactory());
    });

    it('should have a type', function () {
      assert.property(tokenFactory("a", "b"), "type");
    });

    it('should have a value', function () {
      assert.property(tokenFactory("a", "b"), "value");
    });

  });
});
