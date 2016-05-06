module.exports = (function() {
  function Stack() {
    this.array = [];
    this.length = 0;
  }

  Stack.prototype.push = function push(element) {
    this.array.push(element);
    this.length++;
  };

  Stack.prototype.pop = function pop() {
    if (this.length === 0) {
      return undefined;
    }

    this.length--;
    return this.array.pop();
  };

  Stack.prototype.peek = function peek() {
    if (this.length === 0) {
      return undefined;
    }

    return this.array[this.length - 1];
  };

  return function validate() {
    return new Stack();
  };
})();
