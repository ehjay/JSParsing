var assert = require('chai').assert;
var tokenFactory = require('./token');

describe('token', function() {
  describe('#Token', function () {
    it('should return an object', function () {
      assert.isObject(tokenFactory());
    });

  });
});
