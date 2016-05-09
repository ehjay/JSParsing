module.exports = (function() {

  function Token(type, value) {
    this.type = type;
    this.value = value;
  }

  Token.prototype.canBeUnary = function canBeUnary() {
    return this.type === 'unary_or_binary';
  };

  Token.prototype.isFunction = function isFunction() {
    return this.type === 'function';
  };

  Token.prototype.isOpener = function isOpener() {
    return this.type === "(";
  };

  Token.prototype.isOperator = function isOperator() {
    return this.type === 'unary_or_binary' ||
      this.type === 'binary';
  };

  return function createToken(type, value) {
    return new Token(type, value);
  };
})();
