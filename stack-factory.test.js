var assert = require('chai').assert;
var stackFactory = require('./stack-factory');

describe('stack', function() {
  describe('#Stack', function () {
    it('should make a stack', function () {
      var stack = stackFactory();
      assert.isNotNull(stack);
    });

    it('should push values', function () {
      var stack = stackFactory();
      stack.push(4);
      assert.equal(stack.length, 1);
      stack.push(9);
      assert.equal(stack.length, 2);
    });

    it('should pop values', function () {
      var stack = stackFactory();
      stack.push(4);
      assert.equal(stack.length, 1);
      stack.push(9);
      assert.equal(stack.length, 2);
      assert.equal(stack.pop(), 9);
      assert.equal(stack.pop(), 4);
      assert.equal(stack.length, 0);
    });

    it('should peek at values', function () {
      var stack = stackFactory();
      assert.equal(stack.peek(), undefined);
      stack.push(3);
      assert.equal(stack.length, 1);
      assert.equal(stack.peek(), 3);
      assert.equal(stack.length, 1);
    });
  });
});
