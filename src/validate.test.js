var assert = require('chai').assert;
var validate = require('./validate');

describe('validate', function() {
  describe('#validate', function () {
    it('should return an object', function () {
      assert.isObject(validate("dumbledore", [], []));
    });

    it('should accept variables as formulas', function () {
      var result = validate("myvariable", [], ["myvariable"]);
      assert.isTrue(result.isValid);

      result = validate("myCamelCaseVar", [], ["myCamelCaseVar"]);
      assert.isTrue(result.isValid);

      result = validate("my_numbered_var_001", [], ["my_numbered_var_001"]);
      assert.isTrue(result.isValid);
    });

    it('should accept literals as formulas', function () {
      var result = validate("\"my string literal\"", [], []);
      assert.isTrue(result.isValid);

      result = validate("1", [], []);
      assert.isTrue(result.isValid);

      result = validate("47839", [], []);
      assert.isTrue(result.isValid);

      result = validate("0.001", [], []);
      assert.isTrue(result.isValid);
    });

    it('should warn about whitespace after a function', function () {
      var result;
      var warning;

      result = validate("MAX   ", ["MAX"], []);
      warning = result.warnings[0];

      assert.equal(warning.column, 4);
      assert.equal(warning.key, "expected_a_after_b");
      assert.equal(warning.a, "(");
      assert.equal(warning.b, "MAX");
    });

    it('should warn about functions after variables', function () {
      var result;
      var warning;

      result = validate("a MAX", ["MAX"], ["a"]);
      warning = result.warnings[0];

      assert.equal(warning.column, 3);
      assert.equal(warning.key, "unexpected_a_b");
      assert.equal(warning.a, "function");
      assert.equal(warning.b, "MAX");
    });

    it('should accept variables as function arguments', function () {
      var result = validate("MAX(a)", ["MAX"], ["a"]);
      assert.isTrue(result.isValid);
    });

    it('should accept bracketed expressions that are not functions', function () {
      var result = validate("(a)", [], ["a"]);
      assert.isTrue(result.isValid);
    });

    it('should accept nested bracketed expressions', function () {
      var result = validate("((a))", [], ["a"]);
      assert.isTrue(result.isValid);

      result = validate("(((a + b)))", [], ["a", "b"]);
      assert.isTrue(result.isValid);

      result = validate("((a) + (-b / c))", [], ["a", "b", "c"]);
      assert.isTrue(result.isValid);
    });

    it('should accept relational operators', function () {
      var result = validate("AND(a > b, c <= d)", ["AND"], ["a", "b", "c", "d"]);
      assert.isTrue(result.isValid);
    });

    it('should accept commas after valid nested functions', function () {
      var result = validate("OR(AND(a), b)", ["AND", "OR"], ["a", "b"]);
      assert.isTrue(result.isValid);
    });

    it('should warn about commas outside of parameter lists', function () {
      var result;
      var warning;

      result = validate(",", [], []);
      warning = result.warnings[0];

      assert.equal(warning.column, 1);
      assert.equal(warning.key, "unexpected_a");
      assert.equal(warning.a, ",");

      result = validate("(a,b)", [], ["a","b"]);
      warning = result.warnings[0];

      assert.equal(warning.column, 3);
      assert.equal(warning.key, "unexpected_a");
      assert.equal(warning.a, ",");
    });

    it('should accept literals as function arguments', function () {
      var result = validate("MAX(2)", ["MAX"], []);
      assert.isTrue(result.isValid);

      result = validate("MAX(0.001)", ["MAX"], []);
      assert.isTrue(result.isValid);

      result = validate("LEN(\"hello\")", ["LEN"], []);
      assert.isTrue(result.isValid);
    });

    it('should warn about missing open brackets', function () {
      var result;
      var warning;

      result = validate("c )", [], ["c"]);
      warning = result.warnings[0];

      assert.equal(warning.column, 3);
      assert.equal(warning.key, "missing_a_for_b");
      assert.equal(warning.a, "(");
      assert.equal(warning.b, ")");
    });

    it('should allow nested functions', function () {
      var result = validate("NOT(NOT(NOT(cool)))", ["NOT"], ["cool"]);
      assert.isTrue(result.isValid);
    });

    it('should warn if formula does not resolve to a variable or literal', function () {
      var result;
      var warning;

      result = validate("-", [], []);
      warning = result.warnings[0];

      assert.equal(warning.key, "bad_resolve");
    });

    it('should allow unary operators', function () {
      var result;

      result = validate("-wizard_score", [], ["wizard_score"]);
      assert.isTrue(result.isValid);
    });

    it('should allow unary operators after binary operators', function () {
      var result;

      result = validate("a == -b", [], ["a", "b"]);
      assert.isTrue(result.isValid);
    });

    it('should allow unary operators in function parameters', function () {
      var result;

      result = validate("MAX(+wizard_points)", ["MAX"], ["wizard_points"]);
      assert.isTrue(result.isValid);
    });

    it('should allow unary operators in multiple function parameters', function () {
      var result;

      result = validate("AVG(abc, -wizard_points)", ["AVG"], ["abc", "wizard_points"]);
      assert.isTrue(result.isValid);
    });

    it('should accept valid compound formulas', function () {
      var result = validate("NOT(OR(AND(a >= b, c == -d), d >= -a))", ["AND","OR","NOT"], ["a", "b", "c", "d"]);
      assert.isTrue(result.isValid);
    });

  });
});
