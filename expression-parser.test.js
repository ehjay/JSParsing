var assert = require('chai').assert;
var parser = require('./expression-parser');

describe('expression-parser', function() {
  describe('#toTokenStream', function () {
    it('should return true', function () {
      assert.equal(parser.toTokenStream(), true);
    });
  });
});
