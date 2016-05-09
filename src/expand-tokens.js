var _ = require('lodash');
var warn = require('./warn');

module.exports = (function() {

  return expandTokens;

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
        warn(token.column, warnings, "unknown_identifier_a", token.value);
      }
    }

    return tokens;
  }

})();
