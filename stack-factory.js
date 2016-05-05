module.exports = (function() {
  function Stack() {
  }

  Stack.prototype = [];

  Stack.prototype.peek = function peek() {
    if (this.length === 0) {
      return undefined;
    }

    return this[this.length - 1];
  }

  return function validate() {
    return new Stack();
  }
})();
