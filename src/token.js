module.exports = (function() {

  function Token(type, value) {
    this.type = type;
    this.value = value;
    this.inParameterList = false;
  }

  Token.prototype.isPlusOrMinus = function isPlusOrMinus() {
    return this.type === 'plus_or_minus';
  };

  Token.prototype.isComma = function isComma() {
    return this.type === ',';
  };

  Token.prototype.isFunction = function isFunction() {
    return this.type === 'function';
  };

  Token.prototype.isLiteral = function isLiteral() {
    return this.type === 'literal';
  };

  Token.prototype.isOpener = function isOpener() {
    return this.isOpenBracket();
  };

  Token.prototype.isOpenBracket = function isOpenBracket() {
    return this.type === "(";
  };

  Token.prototype.isOperator = function isOperator() {
    return this.type === 'plus_or_minus' ||
      this.type === 'binary';
  };

  Token.prototype.isVariable = function isVariable() {
    return this.type === 'variable';
  };

  Token.prototype.isVariableOrLiteral = function isVariable() {
    return this.isVariable() || this.isLiteral();
  };

  return function createToken(type, value) {
    return new Token(type, value);
  };
})();
