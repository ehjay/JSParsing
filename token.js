module.exports = (function() {

  function Token(type, value) {
    this.type = type;
    this.value = value;
  }

  return function createToken(type, value) {
    return new Token(type, value);
  };
})();
