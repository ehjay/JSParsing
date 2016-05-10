var _ = require('lodash');
var expandTokens = require('./expand-tokens');
var stackFactory = require('./stack');
var createToken = require('./token');
var tokenize = require('./tokenize');
var warn = require('./warn');

module.exports = (function() {

  return validate;

  function Result(warnings) {
    this.isValid = ( warnings.length > 0 ) ? false : true;
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
      // dump(stack);
      validateToken(token, stack, warnings);

      if (warnings.length > 0) {
        return new Result(warnings);
      }
    });

    if ( stack.size() !== 1 || !stack.peek().isVariableOrLiteral() ) {
      warn(-1, warnings, "bad_resolve");
    }

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
      case "plus_or_minus":
        validatePlusOrMinus(token, stack, warnings);
        break;
      case "operator":
        validateOperator(token, stack, warnings);
        break;
      case ",":
        validateComma(token, stack, warnings);
        break;
      default:
        throw "tried to validate unknown token type";
    }
  }

  function validateWhitespace(token, stack, warnings) {
    var top = stack.peek();

    if ( !top ) {
      return;
    }

    if ( top && top.isFunction() ) {
      warn(token.column, warnings, "expected_a_after_b", "(", top.value);
      return;
    }
  }

  function validateFunction(token, stack, warnings) {
    var top = stack.peek();

    if ( !top ) {
      stack.push(token);
      return;
    }

    if ( top.isOperator() || top.isPlusOrMinus() || top.isComma() ) {
      stack.pop();
    } else if ( top.isOpenBracket() ) {
      // do nothing
    } else {
      warn(token.column, warnings, "unexpected_a_b", "function", token.value);
      return;
    }

    stack.push(token);
  }

  function validateVariable(token, stack, warnings) {
    var top = stack.peek();

    if ( !top ) {
      stack.push(token);
      return;
    }

    if ( top.isOperator() || top.isPlusOrMinus() || top.isComma() ) {
      stack.pop();
    } else if ( top.isOpenBracket() ) {
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
    var top = stack.peek();

    if ( !top ) {
      stack.push(token);
      return;
    }

    if ( top.isOperator() || top.isPlusOrMinus() || top.isComma() ) {
      stack.pop();
    } else if ( top.isOpenBracket() ) {
      // do nothing
    } else {
      warn(token.column, warnings, "unexpected_a_b", "literal", token.value);
      return;
    }

    if ( top.inParameterList ) {
      token.inParameterList = true;
    }

    stack.push(token);
  }

  function validateOpenBracket(token, stack, warnings) {
    var top = stack.peek();

    if ( !top ) {
      stack.push(token);
      return;
    }

    if ( top.isOpenBracket() || top.isOperator() || top.isPlusOrMinus() ){
      // okay
    } else if ( top.isFunction() ){
      token.inParameterList = true;
    } else {
      warn(token.column, warnings, "unexpected_a_b", "(", token.value);
      return;
    }

    stack.push(token);
  }

  function validateCloseBracket(token, stack, warnings) {
    var top = stack.peek();

    if ( top.isVariable() || top.isLiteral() ) {
      stack.pop();
      top = stack.peek();
    }

    if ( !top || !top.isOpenBracket() ) {
      warn(token.column, warnings, "missing_a_for_b", "(", ")");
      return;
    }

    stack.pop();
    top = stack.peek();

    if ( top &&  top.isFunction() ) {
      stack.pop();
      top = stack.peek();
    }

    if (top && top.inParameterList ) {
      token.inParameterList = true;
    }

    token.type = "variable";
    token.value = "(evaluated expression)";

    validateVariable(token, stack, warnings);
  }

  function validatePlusOrMinus(token, stack, warnings) {
    var top = stack.peek();

    if ( !top ) {
      stack.push(token);
      return;
    }

    if (top.inParameterList) {
      token.inParameterList = true;
    }

    if ( top.isComma() || top.isOperator() || top.isVariable() || top.isLiteral() ) {
      stack.pop();
      stack.push(token);
      return;
    } else if ( top.isOpenBracket() ) {
      stack.push(token);
      return;
    } else {
      warn(token.column, warnings, "unexpected_a_b", "operator", token.value);
      return;
    }
  }

  function validateOperator(token, stack, warnings) {
    var top = stack.peek();

    if (top.inParameterList) {
      token.inParameterList = true;
    }

    if ( top.isVariable() || top.isLiteral() ) {
      stack.pop();
      stack.push(token);
      return;
    } else {
      warn(token.column, warnings, "unexpected_a_b", "operator", token.value);
      return;
    }
  }

  function validateComma(token, stack, warnings) {
    var top;

    if ( stack.isNotUsed() || stack.isEmpty() ) {
      warn(token.column, warnings, "unexpected_a", ",");
      return;
    }

    top = stack.peek();

    if ( !top.inParameterList || !top.isVariable() ) {
      warn(token.column, warnings, "unexpected_a", ",");
      return;
    }

    stack.pop();
    token.inParameterList = true;
    stack.push(token);
  }

  function dump(stack) {
    var values = _.map(stack.getValues(), function(val) { return val.value; });
    var str = "stack dump: [\"" + values.join("\",\"") + "\"]";
    console.log(str);
  }

})();

