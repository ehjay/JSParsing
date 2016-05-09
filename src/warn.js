var _ = require('lodash');

module.exports = (function() {

  var messageTemplates = {
    did_not_resolve_to_variable: "the formula did not resolve to a variable",
    expected_a_after_b: "expected {a} after {b} at column {column}",
    expected_a_before_b: "expected {a} before {b} at column {column}",
    missing_a_for_b: "missing {a} for {b} at column {column}",
    unexpected_a_b: "unexpected {a} {b} found at column {column}",
    unknown_identifier_a: "unknown identifier {a} found at column {column}"
  };

  return warn_at;

  function Warning(column, key, message, a, b, c) {
    this.column = column;
    this.key = key;
    this.message = message;
    this.a = a;
    this.b = b;
    this.c = c;
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
    warning = new Warning (column, key, message, a, b, c);
    warnings.push(warning);
  }

})();
