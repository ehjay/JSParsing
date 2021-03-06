var _ = require('lodash');

module.exports = (function() {
  function Stack() {
    var array = [];
    var used = false;

    this.isEmpty = function isEmpty() {
      return array.length === 0;
    };

    this.isUsed = function isUsed() {
      return used;
    };

    this.isNotUsed = function isUnused() {
      return !used;
    };

    this.push = function push(element) {
      array.push(element);
      used = true;
    };

    this.pop = function pop() {
      if (array.length === 0) {
        return undefined;
      }

      return array.pop();
    };

    this.peek = function peek() {
      if (array.length === 0) {
        return undefined;
      }

      return array[array.length - 1];
    };

    this.size = function size() {
      return array.length;
    };

    this.getValues = function getValues() {
      return _.cloneDeep(array);
    };
  }

  return function createStack() {
    return new Stack();
  };
})();
