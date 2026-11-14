# Tool specification: Regular expression checker

## Purpose

The student types a regular expression, tests whether a string matches it, and lists example strings that match and do not match. It helps them check their own regular expressions and see what an unfamiliar one describes.

- **Course:** COSC 440, Theory of Computation
- **Topic or unit:** Regular expressions
- **Used:** by students on their own, and in class

## Model

- **Symbols.** A symbol is one letter (a to z, A to Z) or one digit (0 to 9), except the lowercase letter `e`.
- **Empty string.** The letter `e` stands for the empty string. It is an operand like a symbol: `(0|e)1` matches `1` and `01`.
- **Operators.**
  - Concatenation is written by putting operands next to each other.
  - `|` is union.
  - `*` is repetition, zero or more times.
  - Parentheses group.
- **Precedence**, from tightest to loosest: `*`, then concatenation, then `|`. So `ab*` is a followed by any number of b, and `a|bc` is either a or bc.
- **Spaces** are ignored in the expression, the alphabet, and the test string.
- **Matching.** A string matches only if the whole string is in the language of the expression. It is never a search for a substring.
- **Not supported.** `+`, `?`, `.`, character classes, and anything else not listed above. The tool says so and, for `+` and `?`, shows the equivalent in the supported syntax.
- **Alphabet.** The symbols that appear in the expression, together with any the student adds in the alphabet field. It determines which strings are listed as not matching. A symbol that is not in the alphabet can still be typed in a test string, and the string does not match.
- **Listing order.** Shorter strings first. Among strings of equal length, alphabetical order by character code, so digits come before uppercase letters, which come before lowercase letters.
- **Implementation note.** The expression is converted to a nondeterministic finite automaton and run on sets of states. This is not shown to the student.

## Page sections

Above the numbered sections is a collapsible block, "How to use this tool", open by default. It names the two ways to start, loading an example or typing an expression, and points to the step for each.

1. **Regular expression.** The expression, the optional alphabet, a button to check validity, the example menu, and a readout of the alphabet used for listing.
2. **Test a string.** The string to test and the result.
3. **List example strings.** How many strings to list, the shortest length, and the two lists.

## Inputs

- **Regular expression.** Up to 200 characters. Rejected, with a message naming the character and its position: any character other than symbols, `e`, `|`, `(`, `)`, `*`, and spaces; an unmatched parenthesis; an empty alternative such as `a||b`, `(a|)`, or `()`; a `*` with nothing to repeat.
- **Alphabet (optional).** Symbols typed one after another. Duplicates are merged. Rejected: any character that is not a symbol, including `e`.
- **String to test.** Up to 1000 symbols. `e` alone means the empty string. Rejected: a blank field, `e` mixed with other symbols, and any character that is not a letter or digit.
- **Strings in each list.** A whole number from 1 to 50. Default 10.
- **Shortest length.** A whole number from 0 to 20. Default 0.
- **Changing the expression or the alphabet** clears the test result, the lists, and the readout, because they no longer describe the expression. Changing the test string, the number of strings, or the shortest length changes nothing else.

## Display

- **Alphabet readout.** A `.facts` item showing the alphabet used for listing, or "Not checked yet" until an action has read a valid expression.
- **Lists.** Two numbered lists, "Strings that match" and "Strings that do not match", in a monospaced font. The empty string appears as "e (the empty string)". An empty list is replaced by the sentence "None."
- There are no graphics.

## Actions

- **Check expression.** Reads the expression and alphabet and reports whether they are valid. Also runs when the student presses Enter in either field.
- **Load example.** Puts the chosen example's expression in the expression field and clears the alphabet field.
- **Test string.** Tests the string. Also runs on Enter in the string field.
- **List strings.** Lists strings. Also runs on Enter in either number field.
- Test string and List strings first read the expression and alphabet. If they are invalid, nothing is done, the problem is shown beside the field in step 1, and focus moves to that field.
- No button is ever disabled.

## Outcomes and messages

The one `.status` message is in step 2. Step 1 and step 3 each have a `.note`.

| Situation | Message |
|---|---|
| Nothing tested yet, or results cleared | "No string tested yet. Enter an expression in step 1, then test a string here." |
| Match | "The string 0101 matches the regular expression." (or "The empty string matches...") |
| No match, and no matching string starts with a prefix | "The string 0110 does not match. No string that matches starts with 011." The prefix ends at the symbol after which no match is possible. |
| No match, but the string is a beginning of a longer match | "The string 01 does not match. It is the beginning of a longer string that matches." |
| Expression or alphabet invalid when testing | "Nothing was tested because the expression or alphabet in step 1 has a problem." |
| String invalid | "Nothing was tested because the string has a problem." |
| Check expression succeeds | "The expression and the alphabet are valid." |
| Example loaded | "Loaded the example: NAME." |
| Listing succeeds | "Listed 10 matching and 10 non-matching strings, shortest first." |
| A list is shorter than asked for | Added to the listing message: "Only 2 strings of length 0 to 20 match.", or "No string of length 0 to 20 fails to match." |
| The alphabet is empty | Added to the listing message: "The expression has no symbols. Type an alphabet in step 1 to list strings that do not match." |
| Expression or alphabet invalid when listing | "Nothing was listed because the expression or alphabet in step 1 has a problem." |
| The search is too large | "Nothing was listed because the search became too large. Try a simpler expression or a smaller shortest length." |
| Number fields invalid | A message beside the fields, for example "The number of strings must be a whole number from 1 to 50." |

## Keyboard entry

None beyond Tab and Enter. Enter in any field of a form runs that form's action.

## Limits

- Expression: 200 characters. Test string: 1000 symbols.
- Lists: 50 strings each, strings up to 20 symbols long. If fewer strings exist within these bounds, fewer are listed and the note says so.
- The search for strings is capped. An expression whose search exceeds the cap shows the "too large" message. For example, `(0|1)*1(0|1)(0|1)...` with about twenty trailing `(0|1)` reaches it.

## Save and load

None.

## Examples

The menu offers four examples, each loaded with a blank alphabet:

| Name | Expression | Shows |
|---|---|---|
| Any number of a, then any number of b | `a*b*` | Concatenation of repetitions |
| The pair ab, repeated | `(ab)*` | Repeating a group, and the difference from `ab*` |
| Binary strings that contain 11 | `(0\|1)*11(0\|1)*` | Union inside a repetition |
| An optional 0, then 1 | `(0\|e)1` | How to write "optional" with `e` |

The examples avoid the expressions in the problem sets, so they do not give away an answer. This repository is public.

## Out of scope

- No explanation of how a match is found, and no state diagram or automaton. A later tool covers regular expression to NFA.
- No comparison of two expressions for equivalence.
- No `+`, `?`, character classes, anchors, or other conveniences from programming-language regular expressions.
- No saving or sharing of work.

## Decisions log

- **2026-11-14.** Syntax fixed by the instructor: symbols, `|`, `*`, parentheses, and `e`. The pset 1 solution to problem 1(b) uses `?`, which this tool does not accept. The tool shows `(x|e)` as the equivalent.
- **2026-11-14.** `e` cannot be a symbol, because it means the empty string. Problem sets that use `e` as a symbol need a different letter.
- **2026-11-14.** The alphabet field was added so that non-matching strings can be listed for an expression that does not use every symbol, such as `0*` over {0, 1}.
- **2026-11-14.** The "shortest length" field was added so that the lists can show longer strings and not only the shortest ones.
- **2026-11-14.** The tool reports where a match became impossible, because it points the student to the part of the string that is wrong without giving away the expression.
- **2026-11-14.** Results are cleared when the expression or alphabet changes, so a stale result never sits beside a changed expression.
- **2026-11-14.** The tool's only `.status` is in step 2, where the test result is the main message. Step 3 reports through a `.note`.
- **2026-11-14.** The narrow-window width limit for `.field` and `select` was approved and moved into the shared `base.css` (v3). This tool carries that copy.
