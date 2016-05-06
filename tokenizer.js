module.exports = (function() {
  return toTokenStream;

  function getToken(stream, source) {
    var rx_token = /^((\s+)|([a-zA-Z][a-zA-Z0-9_]*)|("[^"]*"|[0-9]+(?:\.[0-9]*)?)|(\()|(\))|(-|\+)|(!=|==|<=|>=|<|>|\*|\/|,))(.*)$/;
    var results;
    var value;
    var rest;

    // 0 source
    // 1 match
    // 2 whitespace
    // 3 identifier
    // 4 string or number literal
    // 5 open bracket
    // 6 close bracket
    // 7 unary or binary operators (+ or -)
    // 8 binary operators
    // 9 the rest

    results = source.match(rx_token);
    value = results[1];
    rest = results[9];

    stream.push(value);

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
