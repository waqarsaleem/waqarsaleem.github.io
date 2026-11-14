// Regular Expression Checker
//
// Classic script (not an ES module) so that it loads when index.html is
// opened directly from disk, without a web server.
//
// Part 1 (RE) is the model: reading a regular expression, matching strings,
// and listing example strings. It does not touch the page.
// Part 2 is the user interface.

"use strict";

/* ====================================================================== */
/* Part 1: regular expression model                                        */
/* ====================================================================== */

var RE = (function () {
  var EMPTY_STRING_SYMBOL = "e"; // typed to mean the empty string
  var MAX_EXPRESSION_LENGTH = 200;
  var MAX_TEST_STRING_LENGTH = 1000;
  var MIN_LIST_COUNT = 1;
  var MAX_LIST_COUNT = 50;
  var MAX_LIST_LENGTH = 20; // longest string the lister will look at
  var MAX_SEARCH_STEPS = 200000; // cap on the lister's work

  // A symbol is one letter or digit. The letter e is not a symbol, because
  // it stands for the empty string.
  var SYMBOL_PATTERN = /^[0-9A-Za-df-z]$/;

  function isSymbol(ch) {
    return SYMBOL_PATTERN.test(ch);
  }

  function isWhitespace(ch) {
    return /\s/.test(ch);
  }

  /* ---- Reading the expression ---- */

  // Splits the text into characters, dropping spaces. Each token remembers
  // its 1-based position in the text as typed, for error messages.
  function tokenize(text) {
    var tokens = [];
    var chars = Array.from(text);
    for (var i = 0; i < chars.length; i++) {
      if (!isWhitespace(chars[i])) {
        tokens.push({ ch: chars[i], position: i + 1 });
      }
    }
    return tokens;
  }

  // Parse problems are thrown as { parseError: "message" } and caught in parse.
  function fail(message) {
    throw { parseError: message };
  }

  function peek(state) {
    return state.tokens[state.index];
  }

  // True when the token can begin a symbol, e, or a parenthesized group.
  // A character that is not allowed counts too, so that parseAtom reports it.
  function startsAtom(token) {
    return token !== undefined && "|)*".indexOf(token.ch) === -1;
  }

  function disallowedCharacterMessage(token) {
    var where = "Position " + token.position + ": ";
    if (token.ch === "+") {
      return where + "+ is not supported. Write xx* for one or more x.";
    }
    if (token.ch === "?") {
      return where + "? is not supported. Write (x|e) for an optional x.";
    }
    if (token.ch === "ε") {
      return where + "ε is not allowed. Type e for the empty string.";
    }
    return where + "the character " + token.ch + " is not allowed. Symbols are letters and digits. The operators are | ( ) * and e.";
  }

  // Message for a spot where a symbol, e, or ( was needed and not found.
  function expectedAtomMessage(token) {
    if (token === undefined) {
      return "The expression ends too soon. A symbol, e, or ( is needed at the end. Write e if you mean the empty string.";
    }
    if (token.ch === "*") {
      return "Position " + token.position + ": * has nothing to repeat. Put a symbol, e, or a parenthesized expression before it.";
    }
    return "Position " + token.position + ": expected a symbol, e, or ( before this " + token.ch + ". Write e if you mean the empty string.";
  }

  // union := term ( "|" term )*
  function parseUnion(state) {
    var options = [parseTerm(state)];
    while (peek(state) !== undefined && peek(state).ch === "|") {
      state.index++;
      options.push(parseTerm(state));
    }
    return options.length === 1 ? options[0] : { type: "union", options: options };
  }

  // term := factor+   (concatenation)
  function parseTerm(state) {
    var parts = [];
    while (startsAtom(peek(state))) {
      parts.push(parseFactor(state));
    }
    if (parts.length === 0) {
      fail(expectedAtomMessage(peek(state)));
    }
    return parts.length === 1 ? parts[0] : { type: "concat", parts: parts };
  }

  // factor := atom "*"*
  function parseFactor(state) {
    var node = parseAtom(state);
    while (peek(state) !== undefined && peek(state).ch === "*") {
      state.index++;
      // Repeating a repetition changes nothing, so keep a single star.
      if (node.type !== "star") {
        node = { type: "star", body: node };
      }
    }
    return node;
  }

  // atom := symbol | "e" | "(" union ")"
  function parseAtom(state) {
    var token = peek(state);
    state.index++;
    if (token.ch === EMPTY_STRING_SYMBOL) {
      return { type: "empty" };
    }
    if (isSymbol(token.ch)) {
      return { type: "symbol", symbol: token.ch };
    }
    if (token.ch === "(") {
      var inner = parseUnion(state);
      if (peek(state) === undefined) {
        fail("Position " + token.position + ": this ( is never closed. Add a ) after the expression inside it.");
      }
      state.index++; // the closing parenthesis
      return inner;
    }
    fail(disallowedCharacterMessage(token));
  }

  function collectSymbols(node, found) {
    if (node.type === "symbol") {
      found[node.symbol] = true;
    } else if (node.type === "concat") {
      node.parts.forEach(function (part) { collectSymbols(part, found); });
    } else if (node.type === "union") {
      node.options.forEach(function (option) { collectSymbols(option, found); });
    } else if (node.type === "star") {
      collectSymbols(node.body, found);
    }
  }

  function sortedKeys(object) {
    return Object.keys(object).sort();
  }

  // Reads the expression text. Returns { tree, symbols } or { error }.
  // symbols is the sorted list of symbols that appear in the expression.
  function parse(text) {
    if (Array.from(text).length > MAX_EXPRESSION_LENGTH) {
      return { error: "The expression has more than " + MAX_EXPRESSION_LENGTH + " characters. Use a shorter expression." };
    }
    var state = { tokens: tokenize(text), index: 0 };
    if (state.tokens.length === 0) {
      return { error: "Type a regular expression. Type e for the empty string." };
    }
    try {
      var tree = parseUnion(state);
      var extra = peek(state);
      if (extra !== undefined) {
        fail("Position " + extra.position + ": this ) has no matching (. Remove it or add a ( before it.");
      }
      var found = {};
      collectSymbols(tree, found);
      return { tree: tree, symbols: sortedKeys(found) };
    } catch (problem) {
      if (problem && problem.parseError) {
        return { error: problem.parseError };
      }
      throw problem;
    }
  }

  /* ---- The alphabet and the test string ---- */

  // Reads the optional alphabet text. Returns { symbols } or { error }.
  function parseAlphabet(text) {
    var found = {};
    var chars = Array.from(text);
    for (var i = 0; i < chars.length; i++) {
      var ch = chars[i];
      if (isWhitespace(ch)) {
        continue;
      }
      if (ch === EMPTY_STRING_SYMBOL) {
        return { error: "The alphabet cannot contain e, which stands for the empty string." };
      }
      if (!isSymbol(ch)) {
        return { error: "The character " + ch + " is not allowed in the alphabet. Use letters and digits other than e." };
      }
      found[ch] = true;
    }
    return { symbols: sortedKeys(found) };
  }

  // The alphabet used for listing: the symbols in the expression together
  // with any the student added. Both lists are sorted already.
  function combineAlphabets(expressionSymbols, extraSymbols) {
    var found = {};
    expressionSymbols.concat(extraSymbols).forEach(function (symbol) {
      found[symbol] = true;
    });
    return sortedKeys(found);
  }

  // Reads the string to test. "e" alone means the empty string.
  // Returns { string } or { error }.
  function parseTestString(text) {
    var chars = Array.from(text).filter(function (ch) { return !isWhitespace(ch); });
    if (chars.length === 0) {
      return { error: "Type the string to test. Type e for the empty string." };
    }
    if (chars.length > MAX_TEST_STRING_LENGTH) {
      return { error: "The string has more than " + MAX_TEST_STRING_LENGTH + " symbols. Use a shorter string." };
    }
    if (chars.length === 1 && chars[0] === EMPTY_STRING_SYMBOL) {
      return { string: "" };
    }
    for (var i = 0; i < chars.length; i++) {
      if (chars[i] === EMPTY_STRING_SYMBOL) {
        return { error: "The string contains e at symbol " + (i + 1) + ". The letter e stands for the empty string, so it can only be typed alone." };
      }
      if (!isSymbol(chars[i])) {
        return { error: "The string contains " + chars[i] + " at symbol " + (i + 1) + ", which is not allowed. Strings use letters and digits." };
      }
    }
    return { string: chars.join("") };
  }

  // How a string is shown in lists: the empty string is written e.
  function displayString(text) {
    return text === "" ? EMPTY_STRING_SYMBOL : text;
  }

  /* ---- Building a machine from the expression ---- */

  // Compiles the tree to an NFA with empty (epsilon) transitions, using the
  // standard construction. Each piece has one start and one accepting state.
  // Returns { states, start, accept }; states[i] is { empty: [...], on: {symbol: [...]} }.
  function compile(tree) {
    var states = [];

    function newState() {
      states.push({ empty: [], on: Object.create(null) });
      return states.length - 1;
    }

    function addEmptyMove(from, to) {
      states[from].empty.push(to);
    }

    function addMove(from, symbol, to) {
      if (states[from].on[symbol] === undefined) {
        states[from].on[symbol] = [];
      }
      states[from].on[symbol].push(to);
    }

    function build(node) {
      var start = newState();
      var accept;
      var piece;
      if (node.type === "empty") {
        accept = newState();
        addEmptyMove(start, accept);
      } else if (node.type === "symbol") {
        accept = newState();
        addMove(start, node.symbol, accept);
      } else if (node.type === "concat") {
        // Chain the pieces: the end of each leads to the start of the next.
        var previous = null;
        node.parts.forEach(function (part, index) {
          piece = build(part);
          if (index === 0) {
            addEmptyMove(start, piece.start);
          } else {
            addEmptyMove(previous.accept, piece.start);
          }
          previous = piece;
        });
        accept = newState();
        addEmptyMove(previous.accept, accept);
      } else if (node.type === "union") {
        accept = newState();
        node.options.forEach(function (option) {
          piece = build(option);
          addEmptyMove(start, piece.start);
          addEmptyMove(piece.accept, accept);
        });
      } else {
        // star: skip the body, or go around it any number of times.
        piece = build(node.body);
        accept = newState();
        addEmptyMove(start, piece.start);
        addEmptyMove(start, accept);
        addEmptyMove(piece.accept, piece.start);
        addEmptyMove(piece.accept, accept);
      }
      return { start: start, accept: accept };
    }

    var whole = build(tree);
    return { states: states, start: whole.start, accept: whole.accept };
  }

  /* ---- Running the machine on sets of states ---- */

  // All states reachable from the given states by empty moves, as a sorted list.
  function closure(nfa, startStates) {
    var seen = new Uint8Array(nfa.states.length);
    var stack = [];
    startStates.forEach(function (state) {
      if (!seen[state]) {
        seen[state] = 1;
        stack.push(state);
      }
    });
    while (stack.length > 0) {
      var current = stack.pop();
      nfa.states[current].empty.forEach(function (next) {
        if (!seen[next]) {
          seen[next] = 1;
          stack.push(next);
        }
      });
    }
    var result = [];
    for (var i = 0; i < seen.length; i++) {
      if (seen[i]) {
        result.push(i);
      }
    }
    return result;
  }

  function startSet(nfa) {
    return closure(nfa, [nfa.start]);
  }

  // The set of states reached from a set by reading one symbol.
  function step(nfa, set, symbol) {
    var targets = [];
    set.forEach(function (state) {
      var moves = nfa.states[state].on[symbol];
      if (moves !== undefined) {
        targets = targets.concat(moves);
      }
    });
    return closure(nfa, targets);
  }

  function isAccepting(nfa, set) {
    return set.indexOf(nfa.accept) !== -1;
  }

  // Tests a whole string. Returns { matches: true }, or { matches: false }
  // with deadAfter set to the number of symbols after which no matching
  // string can start with these symbols (null if that never happens).
  function matchString(nfa, text) {
    var symbols = Array.from(text);
    var set = startSet(nfa);
    for (var i = 0; i < symbols.length; i++) {
      set = step(nfa, set, symbols[i]);
      if (set.length === 0) {
        return { matches: false, deadAfter: i + 1 };
      }
    }
    return { matches: isAccepting(nfa, set), deadAfter: null };
  }

  /* ---- Listing example strings ---- */

  // Lists up to `count` strings over `alphabet` that match (wantMatch true)
  // or do not match (wantMatch false), shortest first, and in alphabetical
  // order among strings of the same length. Only lengths from minLength to
  // maxLength are considered. Returns { strings } or { tooComplex: true }.
  //
  // For each set of machine states and each number of symbols still to read,
  // it first works out whether the string can be finished correctly. The
  // search then follows only choices that can be finished, so it does not
  // wander through strings that lead nowhere.
  function listStrings(nfa, alphabet, wantMatch, count, minLength, maxLength) {
    var steps = 0;
    var finishable = new Map();
    var moves = new Map();

    function moveFrom(set, symbol) {
      var key = set.join(",") + "|" + symbol;
      if (!moves.has(key)) {
        moves.set(key, step(nfa, set, symbol));
      }
      return moves.get(key);
    }

    function canFinish(set, remaining) {
      var key = set.join(",") + "|" + remaining;
      if (finishable.has(key)) {
        return finishable.get(key);
      }
      steps++;
      if (steps > MAX_SEARCH_STEPS) {
        throw { tooComplex: true };
      }
      var result = false;
      if (remaining === 0) {
        result = isAccepting(nfa, set) === wantMatch;
      } else {
        for (var i = 0; i < alphabet.length && !result; i++) {
          result = canFinish(moveFrom(set, alphabet[i]), remaining - 1);
        }
      }
      finishable.set(key, result);
      return result;
    }

    var strings = [];

    function extend(prefix, set, remaining) {
      if (remaining === 0) {
        strings.push(prefix);
        return;
      }
      for (var i = 0; i < alphabet.length && strings.length < count; i++) {
        var next = moveFrom(set, alphabet[i]);
        if (canFinish(next, remaining - 1)) {
          extend(prefix + alphabet[i], next, remaining - 1);
        }
      }
    }

    try {
      var initial = startSet(nfa);
      for (var length = minLength; length <= maxLength && strings.length < count; length++) {
        if (canFinish(initial, length)) {
          extend("", initial, length);
        }
      }
    } catch (problem) {
      if (problem && problem.tooComplex) {
        return { tooComplex: true };
      }
      throw problem;
    }
    return { strings: strings };
  }

  return {
    EMPTY_STRING_SYMBOL: EMPTY_STRING_SYMBOL,
    MAX_EXPRESSION_LENGTH: MAX_EXPRESSION_LENGTH,
    MAX_TEST_STRING_LENGTH: MAX_TEST_STRING_LENGTH,
    MIN_LIST_COUNT: MIN_LIST_COUNT,
    MAX_LIST_COUNT: MAX_LIST_COUNT,
    MAX_LIST_LENGTH: MAX_LIST_LENGTH,
    parse: parse,
    parseAlphabet: parseAlphabet,
    parseTestString: parseTestString,
    combineAlphabets: combineAlphabets,
    displayString: displayString,
    compile: compile,
    startSet: startSet,
    step: step,
    matchString: matchString,
    listStrings: listStrings
  };
})();

if (typeof module !== "undefined") {
  module.exports = RE;
}

/* ====================================================================== */
/* Part 2: user interface                                                  */
/* ====================================================================== */

if (typeof document !== "undefined") {
  (function () {
    var INITIAL_STATUS = "No string tested yet. Enter an expression in step 1, then test a string here.";
    var DEFAULT_LIST_COUNT = 10;
    var DEFAULT_MIN_LENGTH = 0;

    // Each example sets the expression and leaves the alphabet blank, so the
    // alphabet is the symbols in the expression.
    var EXAMPLES = [
      { label: "Any number of a, then any number of b", expression: "a*b*" },
      { label: "The pair ab, repeated", expression: "(ab)*" },
      { label: "Binary strings that contain 11", expression: "(0|1)*11(0|1)*" },
      { label: "An optional 0, then 1", expression: "(0|e)1" }
    ];

    function byId(id) {
      return document.getElementById(id);
    }

    // Changes an element's text only if it differs. Rewriting identical text
    // in a live region can make a screen reader announce it again.
    function setText(id, text) {
      var element = byId(id);
      if (element.textContent !== text) {
        element.textContent = text;
      }
    }

    /* ---- Field errors ---- */

    function showFieldError(inputId, errorId, message) {
      setText(errorId, message);
      byId(inputId).setAttribute("aria-invalid", "true");
    }

    function clearFieldError(inputId, errorId) {
      setText(errorId, "");
      byId(inputId).removeAttribute("aria-invalid");
    }

    /* ---- Results that depend on the expression ---- */

    function clearResults() {
      setText("status", INITIAL_STATUS);
      setText("list-note", "");
      byId("list-results").hidden = true;
      setText("expression-note", "");
      setText("fact-alphabet", "Not checked yet");
    }

    // Reads and checks the expression and alphabet from step 1. Returns
    // { nfa, alphabet } if both are valid, or null after showing the
    // problems beside the fields. With moveFocus, focus goes to the first
    // field with a problem.
    function readExpression(moveFocus) {
      var expression = RE.parse(byId("expression-input").value);
      var alphabetText = RE.parseAlphabet(byId("alphabet-input").value);
      var problemFieldId = null;

      clearFieldError("expression-input", "expression-error");
      clearFieldError("alphabet-input", "alphabet-error");
      if (expression.error) {
        showFieldError("expression-input", "expression-error", expression.error);
        problemFieldId = "expression-input";
      }
      if (alphabetText.error) {
        showFieldError("alphabet-input", "alphabet-error", alphabetText.error);
        problemFieldId = problemFieldId || "alphabet-input";
      }
      if (problemFieldId !== null) {
        setText("expression-note", "");
        setText("fact-alphabet", "Not checked yet");
        if (moveFocus) {
          byId(problemFieldId).focus();
        }
        return null;
      }

      var alphabet = RE.combineAlphabets(expression.symbols, alphabetText.symbols);
      setText("fact-alphabet", alphabet.length === 0 ? "No symbols" : alphabet.join(" "));
      return { nfa: RE.compile(expression.tree), alphabet: alphabet };
    }

    /* ---- Step 1: expression and alphabet ---- */

    function onCheckExpression(event) {
      event.preventDefault();
      var info = readExpression(true);
      if (info === null) {
        return;
      }
      setText("expression-note", "The expression and the alphabet are valid.");
    }

    function onExpressionEdited() {
      clearFieldError("expression-input", "expression-error");
      clearFieldError("alphabet-input", "alphabet-error");
      clearResults();
    }

    function onLoadExample() {
      var example = EXAMPLES[Number(byId("example-select").value)];
      byId("expression-input").value = example.expression;
      byId("alphabet-input").value = "";
      onExpressionEdited();
      byId("expression-note").textContent = "Loaded the example: " + example.label + ".";
      readExpression(false);
    }

    /* ---- Step 2: test a string ---- */

    function describeMatch(text, result) {
      var label = text === "" ? "The empty string" : "The string " + text;
      if (result.matches) {
        return label + " matches the regular expression.";
      }
      if (result.deadAfter !== null) {
        var prefix = Array.from(text).slice(0, result.deadAfter).join("");
        return label + " does not match. No string that matches starts with " + prefix + ".";
      }
      return label + " does not match. It is the beginning of a longer string that matches.";
    }

    function onTestString(event) {
      event.preventDefault();
      var status = byId("status");
      clearFieldError("test-input", "test-error");

      var info = readExpression(true);
      if (info === null) {
        status.textContent = "Nothing was tested because the expression or alphabet in step 1 has a problem.";
        return;
      }
      var parsed = RE.parseTestString(byId("test-input").value);
      if (parsed.error) {
        showFieldError("test-input", "test-error", parsed.error);
        status.textContent = "Nothing was tested because the string has a problem.";
        byId("test-input").focus();
        return;
      }
      status.textContent = describeMatch(parsed.string, RE.matchString(info.nfa, parsed.string));
    }

    /* ---- Step 3: list example strings ---- */

    function readWholeNumber(inputId, low, high) {
      var text = byId(inputId).value.trim();
      if (!/^[0-9]+$/.test(text)) {
        return null;
      }
      var value = Number(text);
      return value >= low && value <= high ? value : null;
    }

    // Fills one results list. An empty result shows a short sentence instead.
    function showList(listId, noneId, strings) {
      var list = byId(listId);
      list.textContent = "";
      strings.forEach(function (text) {
        var item = document.createElement("li");
        item.textContent = text === "" ? "e (the empty string)" : text;
        list.appendChild(item);
      });
      list.hidden = strings.length === 0;
      byId(noneId).hidden = strings.length !== 0;
    }

    // Says why a list is shorter than asked for, or returns an empty string.
    function shortListSentence(found, wanted, minLength, matchWords) {
      if (found >= wanted) {
        return "";
      }
      var lengths = "of length " + minLength + " to " + RE.MAX_LIST_LENGTH;
      if (found === 0) {
        return " No string " + lengths + " " + matchWords.none + ".";
      }
      var noun = found === 1 ? "string" : "strings";
      return " Only " + found + " " + noun + " " + lengths + " " + (found === 1 ? matchWords.one : matchWords.many) + ".";
    }

    function onListStrings(event) {
      event.preventDefault();
      var note = byId("list-note");
      clearFieldError("count-input", "list-error");
      clearFieldError("min-length-input", "list-error");
      byId("list-results").hidden = true;
      note.textContent = "";

      var count = readWholeNumber("count-input", RE.MIN_LIST_COUNT, RE.MAX_LIST_COUNT);
      var minLength = readWholeNumber("min-length-input", 0, RE.MAX_LIST_LENGTH);
      if (count === null) {
        showFieldError("count-input", "list-error", "The number of strings must be a whole number from " + RE.MIN_LIST_COUNT + " to " + RE.MAX_LIST_COUNT + ".");
        byId("count-input").focus();
        return;
      }
      if (minLength === null) {
        showFieldError("min-length-input", "list-error", "The shortest length must be a whole number from 0 to " + RE.MAX_LIST_LENGTH + ".");
        byId("min-length-input").focus();
        return;
      }
      var info = readExpression(true);
      if (info === null) {
        note.textContent = "Nothing was listed because the expression or alphabet in step 1 has a problem.";
        return;
      }

      var matching = RE.listStrings(info.nfa, info.alphabet, true, count, minLength, RE.MAX_LIST_LENGTH);
      var notMatching = RE.listStrings(info.nfa, info.alphabet, false, count, minLength, RE.MAX_LIST_LENGTH);
      if (matching.tooComplex || notMatching.tooComplex) {
        note.textContent = "Nothing was listed because the search became too large. Try a simpler expression or a smaller shortest length.";
        return;
      }

      showList("match-list", "match-none", matching.strings);
      showList("nonmatch-list", "nonmatch-none", notMatching.strings);
      byId("list-results").hidden = false;

      var message = "Listed " + matching.strings.length + " matching and " + notMatching.strings.length +
        " non-matching strings, shortest first.";
      message += shortListSentence(matching.strings.length, count, minLength, { none: "matches", one: "matches", many: "match" });
      message += shortListSentence(notMatching.strings.length, count, minLength, { none: "fails to match", one: "does not match", many: "do not match" });
      if (info.alphabet.length === 0) {
        message += " The expression has no symbols. Type an alphabet in step 1 to list strings that do not match.";
      }
      note.textContent = message;
    }

    /* ---- Start-up ---- */

    function start() {
      var select = byId("example-select");
      EXAMPLES.forEach(function (example, index) {
        var option = document.createElement("option");
        option.value = String(index);
        option.textContent = example.label + " (" + example.expression + ")";
        select.appendChild(option);
      });

      byId("count-input").value = String(DEFAULT_LIST_COUNT);
      byId("min-length-input").value = String(DEFAULT_MIN_LENGTH);
      clearResults();

      byId("expression-form").addEventListener("submit", onCheckExpression);
      byId("expression-input").addEventListener("input", onExpressionEdited);
      byId("alphabet-input").addEventListener("input", onExpressionEdited);
      byId("example-button").addEventListener("click", onLoadExample);
      byId("test-form").addEventListener("submit", onTestString);
      byId("test-input").addEventListener("input", function () {
        clearFieldError("test-input", "test-error");
      });
      byId("list-form").addEventListener("submit", onListStrings);

      // Last step: hide the warning that shows if this script fails to load.
      byId("script-warning").hidden = true;
    }

    start();
  })();
}
