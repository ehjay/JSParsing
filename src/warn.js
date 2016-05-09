var _ = require('lodash');

module.exports = (function() {

  var messageTemplates = {
    expected_a_after_b: "expected {a} after {b} at column {column}",
    expected_a_before_b: "expected {a} before {b} at column {column}",
    unknown_identifier_a: "unknown identifier {a} found at column {column}"
  };

  return warn_at;

  function Warning(key, message) {
    this.key = key;
    this.message = message;
  }

  function supplant(str, obj) {
    var rx_supplant = /\{([^{}]*)\}/g;

    return str.replace(rx_supplant, function (match, inside) {
      var replacement = obj[inside];
      return (replacement !== undefined) ? replacement : match;
    });
  }

  function warn_at(column, warnings, key, a, b, c) {
    var message;
    var replacements = { column: column };

    if (a) {
      replacements.a = a;
    }

    if (b) {
      replacements.b = b;
    }

    if (c) {
      replacements.c = c;
    }

    message = supplant(messageTemplates[key], replacements);
    console.log(message);
    warning = new Warning (key, message);
    warnings.push(warning);
  }

})();
