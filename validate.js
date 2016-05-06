var _ = require('lodash');
var stackFactory = require('./stack');
var tokenize = require('./tokenize');

module.exports = (function() {
  var messageTemplates = {
    expected_a_after_b: "expected {a} after {b} at column {column}",
    expected_a_before_b: "expected {a} before {b} at column {column}",
    unknown_identifier_a: "unknown identifier {a} found at column {column}"
  };

  return {
    expandTokens: expandTokens,
    validate: validate
  };

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

  function validate(source, functionNames, variableNames) {
    var stack = stackFactory();
    var tokens = tokenize(source);
    var valid = true;
    var warnings = [];

    expandTokens(tokens, functionNames, variableNames, warnings);

    _.forEach(tokens, function(token) {
      validateToken(token, stack, warnings);

      if (warnings.length > 0) {
        valid = false;
        return false;
      }
    });

    return {
      valid: valid,
      warnings: warnings
    };
  }

  function expandTokens(tokens, functionNames, variableNames, warnings) {
    var column = 1;

    for (var i=0; i < tokens.length; i++) {
      var token = tokens[i];
      token.column = column;
      column += token.value.length;

      if (token.type !== "identifier") {
        continue;
      }

      if ( _.includes(functionNames, token.value) ) {
        token.type = "function";
      } else if ( _.includes(variableNames, token.value) ) {
        token.type = "variable";
      } else {
        warn_at(token.column, warnings, "unknown_identifier_a", token.value);
      }
    }

    return tokens;
  }

  function validateToken(token, stack, warnings) {
    switch(token.type) {
      case "whitespace":
        validateWhitespace(token, stack, warnings);
        break;
      case "function":
        validateFunction(token, stack, warnings);
        break;
      case "variable":
        validateVariable(token, stack, warnings);
        break;
      case "literal":
        validateLiteral(token, stack, warnings);
        break;
      case "(":
        validateOpenBracket(token, stack, warnings);
        break;
      case ")":
        validateCloseBracket(token, stack, warnings);
        break;
      case "unary_or_binary":
        validateUnaryOrBinary(token, stack, warnings);
        break;
      case "binary":
        validateBinary(token, stack, warnings);
        break;
    }
  }

  function validateWhitespace(token, stack, warnings) {
    if (stack.isEmpty()) {
      return;
    }

    if (stack.peek().type === "function") {
      warn_at(token.column, warnings, "expected_a_after_b", "(", stack.peek().value);
    }
  }

  function isBinary(token) {
    return token.type === 'unary_or_binary' ||
      token.type === 'binary';
  }

  function validateFunction(token, stack, warnings) {
    if (stack.isUsed() && ( stack.isEmpty() || !isBinary(stack.peek()) ) ) {
      warn_at(token.column, warnings, "expected_a_before_b",  "operator", token.value);
    }

    stack.push(token);
  }

  function validateVariable(token, stack, warnings) {
    if (stack.isUsed() && ( stack.isEmpty() || !isBinary(stack.peek()) ) ) {
      warn_at(token.column, warnings, "expected_a_before_b",  "operator", token.value);
    }

    stack.push(token);
  }
})();

