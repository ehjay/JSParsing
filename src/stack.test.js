var assert = require('chai').assert;
var stackFactory = require('./stack');

describe('stack', function() {
  describe('#Stack', function () {
    it('should make a stack', function () {
      var stack = stackFactory();
      assert.isNotNull(stack);
    });

    it('should push values', function () {
      var stack = stackFactory();
      stack.push(4);
      assert.equal(stack.size(), 1);
      stack.push(9);
      assert.equal(stack.size(), 2);
    });

    it('should know when it is used', function () {
      var stack = stackFactory();
      assert.isFalse(stack.isUsed());
      assert.isTrue(stack.isNotUsed());
      stack.push(4);
      assert.isTrue(stack.isUsed());
      assert.isFalse(stack.isNotUsed());
    });

    it('should pop values', function () {
      var stack = stackFactory();
      stack.push(4);
      assert.equal(stack.size(), 1);
      stack.push(9);
      assert.equal(stack.size(), 2);
      assert.equal(stack.pop(), 9);
      assert.equal(stack.pop(), 4);
      assert.equal(stack.size(), 0);
    });

    it('should know when it is empty', function () {
      var stack = stackFactory();
      assert.isTrue(stack.isEmpty());
      stack.push(1);
      assert.isFalse(stack.isEmpty());
    });

    it('should peek at values', function () {
      var stack = stackFactory();
      assert.equal(stack.peek(), undefined);
      stack.push(3);
      assert.equal(stack.size(), 1);
      assert.equal(stack.peek(), 3);
      assert.equal(stack.size(), 1);
    });
  });
});
