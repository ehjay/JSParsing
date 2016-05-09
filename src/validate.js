var _ = require('lodash');
var expandTokens = require('./expand-tokens');
var stackFactory = require('./stack');
var tokenize = require('./tokenize');
var warn = require('./warn');

module.exports = (function() {

  return validate;

  function Result(warnings) {
    this.valid = ( warnings.length > 0 ) ? false : true;
    this.warnings = warnings;
  }

  function validate(source, functionNames, variableNames) {
    var stack = stackFactory();
    var tokens = tokenize(source);
    var valid = true;
    var warnings = [];

    expandTokens(tokens, functionNames, variableNames, warnings);

    if (warnings.length > 0) {
      return new Result(warnings);
    }

    _.forEach(tokens, function(token) {
      validateToken(token, stack, warnings);

      if (warnings.length > 0) {
        return new Result(warnings);
      }
    });

    return new Result(warnings);
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
        validateOperator(token, stack, warnings);
        break;
      case "binary":
        validateOperator(token, stack, warnings);
        break;
    }
  }

  function validateWhitespace(token, stack, warnings) {
    var last;

    if (stack.isEmpty()) {
      // whitespace should not be pushed onto the stack
      return;
    }

    last = stack.peek();

    if ( last && last.isFunction() ) {
      warn(token.column, warnings, "expected_a_after_b", "(", last.value);
      return;
    }

    // whitespace should not be pushed onto the stack
  }

  function validateFunction(token, stack, warnings) {
    var top;

    if ( !stack.isUsed() ) {
      stack.push(token);
      return;
    }

    if ( stack.isUsed() && stack.isEmpty() ) {
      warn(token.column, warnings, "unexpected_a_b", "function", token.value);
      return;
    }

    top = stack.peek();

    if ( top.isOperator() || top.isComma() ) {
      stack.pop();
    } else if ( top.isOpener() ) {
      // do nothing
    } else {
      warn(token.column, warnings, "unexpected_a_b", "function", token.value);
      return;
    }

    stack.push(token);
  }

  function validateVariable(token, stack, warnings) {
    var top;

    if ( !stack.isUsed() ) {
      stack.push(token);
      return;
    }

    if ( stack.isUsed() && stack.isEmpty() ) {
      warn(token.column, warnings, "unexpected_a_b", "variable", token.value);
      return;
    }

    top = stack.peek();

    if ( top.isOperator() || top.isComma() ) {
      stack.pop();
    } else if ( top.isOpener() ) {
      // do nothing
    } else {
      warn(token.column, warnings, "unexpected_a_b", "variable", token.value);
      return;
    }

    if ( top.inParameterList ) {
      token.inParameterList = true;
    }

    stack.push(token);
  }

  function validateLiteral(token, stack, warnings) {
  }

})();

