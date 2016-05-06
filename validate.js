var _ = require('lodash');
var stackFactory = require('./stack');
var tokenize = require('./tokenize');

module.exports = (function() {
  return {
    expandTokens: expandTokens,
    validate: validate
  };

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

      if (_.includes(functionNames, token.value)) {
        token.type = "function";
      } else if (_.includes(variableNames), token.value) {
        token.type = "variable";
      } else {
        warnings.push("unknown identifier " + token.value + " found at column " + column);
      }
    }

    return tokens;
  }

  function validateToken(token, stack, warnings) {
    switch(token.type) {
      case "whitespace":
        break;
      case "function":
        break;
      case "variable":
        break;
      case "literal":
        break;
      case "(":
        break;
      case ")":
        break;
      case "unary_or_binary":
        break;
      case "binary":
        break;
    }
  }
})();

