var _ = require('lodash');
var expandTokens = require('./expand-tokens');
var stackFactory = require('./stack');
var tokenize = require('./tokenize');
var warn = require('./warn');

module.exports = (function() {

  return validate;

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
      warn(token.column, warnings, "expected_a_after_b", "(", stack.peek().value);
    }
  }

  function isBinary(token) {
    return token.type === 'unary_or_binary' ||
      token.type === 'binary';
  }

  function validateFunction(token, stack, warnings) {
    if (stack.isUsed() && ( stack.isEmpty() || !isBinary(stack.peek()) ) ) {
      warn(token.column, warnings, "expected_a_before_b",  "operator", token.value);
    }

    stack.push(token);
  }

  function validateVariable(token, stack, warnings) {
    if (stack.isUsed() && ( stack.isEmpty() || !isBinary(stack.peek()) ) ) {
      warn(token.column, warnings, "expected_a_before_b",  "operator", token.value);
    }

    stack.push(token);
  }
})();

