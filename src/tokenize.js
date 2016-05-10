var token = require('./token');
var _ = require('lodash');

module.exports = (function() {
  return toTokenStream;

  function getToken(stream, source) {
    var rx_token = /^((\s+)|([a-zA-Z][a-zA-Z0-9_]*)|("[^"]*"|[0-9]+(?:\.[0-9]*)?)|(\()|(\))|(-|\+)|(!=|==|<=|>=|<|>|\*|\/)|(,))(.*)$/;
    var results;
    var value;
    var rest;
    var matchIndex;
    var type;

    // 0 source
    // 1 match
    // 2 whitespace
    // 3 identifier
    // 4 string or number literal
    // 5 open bracket
    // 6 close bracket
    // 7 unary or binary operators (+ or -)
    // 8 binary operators
    // 9 comma
    // 10 the rest

    results = source.match(rx_token);
    value = results[1];
    rest = results[10];

    matchIndex = _.findIndex(results, function(value, key) { return key > 1 && key < 10 && value; });

    switch(matchIndex) {
      case 2:
        type = 'whitespace';
        break;
      case 3:
        type = 'identifier';
        break;
      case 4:
        type = 'literal';
        break;
      case 5:
        type = '(';
        break;
      case 6:
        type = ')';
        break;
      case 7:
        type = 'plus_or_minus';
        break;
      case 8:
        type = 'binary';
        break;
      case 9:
        type = ',';
        break;
      default:
        throw "unknown token type matched";
    }

    stream.push(token(type, value));

    return rest;
  }

  function toTokenStream(source) {
    var stream = [];
    var safety = 0;
    var len = source.length;

    while (source.length > 0 && safety < len) {
      source = getToken(stream, source);
      safety++;
    }

    return stream;
  }
})();
