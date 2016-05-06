var _ = require('lodash');
var stackFactory = require('./stack');
var tokenize = require('./tokenize');

module.exports = (function() {
  var messageTemplates = {
    unknown_identifier: "unknown identifier {a} found at column {column}"
  };

  return {
    expandTokens: expandTokens,
    validate: validate
  };

  function supplant(str, obj) {
    var rx_supplant = /\{([^{}]*)\}/g;

    return str.replace(rx_supplant, function (match, inside) {
      var replacement = obj[inside];
      return (replacement !== undefined) ? replacement : match;
    });
  }

  function warn_at(column, warnings, template, a, b, c) {
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

    warnings.push(supplant(template, replacements));
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
        warn_at(token.column, warnings, messageTemplates.unknown_identifier, token.value);
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

