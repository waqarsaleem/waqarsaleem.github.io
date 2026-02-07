# Parse Tree Visualizer

This is a small, browser-based tool for visualizing parse trees written in parenthesized (bracket) notation. It is intended for instructional use in courses on programming languages, parsing, and formal grammars.

The tool runs entirely client-side and requires no installation.

---

## Functionality

- Accepts parse trees written in parenthesized bracket notation  
  (e.g. `(S (NP (Det the) (N dog)) (VP (V chased) (NP (Det the) (N cat))))`)
- Renders the tree as a labeled graphical structure
- Distinguishes terminals and non-terminals visually
- Provides a text-based outline of the tree as an alternative to the graphic
- Allows export of the rendered tree as SVG or PNG

---

## Accessibility

The tool is designed with accessibility in mind:

- Fully keyboard-operable
- Uses labeled controls and live status messages
- Provides a text-based representation of the tree structure
- Offers optional visual themes for reading comfort

No data is sent to a server; all rendering happens in the browser.

---

## Source and License

This tool is a modified and accessibility-enhanced derivative of [jsSyntaxTree](https://github.com/int2str/jssyntaxtree) by André Eisenbach and contributors.

The original project is licensed under the **GNU General Public License v2 (GPL-2.0)**. This version is distributed under the same license.

See the repository root `LICENSE` file for the full license text.
