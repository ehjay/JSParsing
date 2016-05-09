module.exports = (function() {

  function Token(type, value) {
    this.type = type;
    this.value = value;
  }

  Token.prototype.isBinary = function isBinary() {
    return this.type === 'unary_or_binary' ||
      this.type === 'binary';
  };

  return function createToken(type, value) {
    return new Token(type, value);
  };
})();
