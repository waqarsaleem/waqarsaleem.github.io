// Turing Machine Simulator
//
// Classic script (not an ES module) so that it loads when index.html is
// opened directly from disk, without a web server.
//
// Part 1 (TM) is the machine model and simulation. It does not touch the page.
// Part 2 is the user interface.

"use strict";

/* ====================================================================== */
/* Part 1: machine model and simulation                                    */
/* ====================================================================== */

var TM = (function () {
  var START = "▷"; // ▷ start-of-input marker
  var BLANK = "ϕ"; // ϕ null symbol
  var ACTIONS = ["L", "R", "S", "H"];
  var MAX_STATES = 20;
  var MAX_EXTRA_SYMBOLS = 12;
  var HALT = "*"; // "next state" of a halting transition

  // Checks the "extra symbols" text. Each character is one symbol.
  // Returns { symbols: [...] } or { error: "..." }.
  function parseExtraSymbols(text) {
    var symbols = [];
    var chars = Array.from(text);
    for (var i = 0; i < chars.length; i++) {
      var ch = chars[i];
      if (/\s/.test(ch)) {
        return { error: "Extra symbols cannot include spaces. Type the symbols one after another, for example: ab#" };
      }
      if (ch === "0" || ch === "1" || ch === START || ch === BLANK) {
        return { error: "The symbol " + ch + " is already in the alphabet." };
      }
      if (ch === ">" || ch === "_") {
        return { error: "The characters > and _ are reserved as keyboard shortcuts for " + START + " and " + BLANK + "." };
      }
      if (symbols.indexOf(ch) !== -1) {
        return { error: "The symbol " + ch + " is listed more than once." };
      }
      symbols.push(ch);
    }
    if (symbols.length > MAX_EXTRA_SYMBOLS) {
      return { error: "At most " + MAX_EXTRA_SYMBOLS + " extra symbols are allowed." };
    }
    return { symbols: symbols };
  }

  // A machine is { k, extras, symbols, table }.
  // table[state][symbol] is one of:
  //   null                          empty cell
  //   { cannot: true }              "cannot occur"
  //   { next, write, action }       a transition; any field may still be null
  // In a halting transition, next is "*" and action is "H".
  function createMachine(k, extras) {
    var symbols = ["0", "1"].concat(extras, [START, BLANK]);
    var table = [];
    for (var s = 0; s < k; s++) {
      var row = {};
      for (var j = 0; j < symbols.length; j++) {
        row[symbols[j]] = null;
      }
      table.push(row);
    }
    return { k: k, extras: extras.slice(), symbols: symbols, table: table };
  }

  function cellKind(cell) {
    if (!cell) {
      return "empty";
    }
    if (cell.cannot) {
      return "cannot";
    }
    if (cell.next !== null && cell.write !== null && cell.action !== null) {
      return "complete";
    }
    if (cell.next === null && cell.write === null && cell.action === null) {
      return "empty";
    }
    return "partial";
  }

  // Builds a machine with a new size and alphabet, keeping every entry of the
  // old machine that is still valid.
  function resizeMachine(old, k, extras) {
    var machine = createMachine(k, extras);
    for (var s = 0; s < Math.min(k, old.k); s++) {
      machine.symbols.forEach(function (sym) {
        var cell = old.table[s][sym];
        if (!cell) {
          return;
        }
        if (cell.cannot) {
          machine.table[s][sym] = { cannot: true };
          return;
        }
        var copy = { next: cell.next, write: cell.write, action: cell.action };
        if (typeof copy.next === "number" && copy.next >= k) {
          copy.next = null;
        }
        if (copy.write !== null && machine.symbols.indexOf(copy.write) === -1) {
          copy.write = null;
        }
        if (cellKind(copy) !== "empty") {
          machine.table[s][sym] = copy;
        }
      });
    }
    return machine;
  }

  // Returns an error message, or null if the input is acceptable.
  function validateInput(machine, input) {
    var chars = Array.from(input);
    for (var i = 0; i < chars.length; i++) {
      var ch = chars[i];
      if (ch === START || ch === BLANK) {
        return "The input cannot contain " + START + " or " + BLANK + ".";
      }
      if (machine.symbols.indexOf(ch) === -1) {
        var label = /\s/.test(ch) ? "a space" : ch;
        return "The input contains " + label + ", which is not in the alphabet.";
      }
    }
    return null;
  }

  // A run is the machine's configuration plus the history needed to step back.
  // The tape is two-way infinite. Position 0 holds the first input symbol and
  // position -1 holds the start marker. Cells never written hold the blank.
  function createRun(input) {
    var tape = {};
    tape[-1] = START;
    var chars = Array.from(input);
    for (var i = 0; i < chars.length; i++) {
      tape[i] = chars[i];
    }
    return {
      tape: tape,
      head: 0,
      state: 0,
      steps: 0,
      halted: false,
      last: null, // the transition taken by the most recent step
      lo: -1, // leftmost and rightmost positions used so far
      hi: Math.max(chars.length - 1, 0),
      history: []
    };
  }

  function readTape(run, position) {
    return Object.prototype.hasOwnProperty.call(run.tape, position) ? run.tape[position] : BLANK;
  }

  // Performs one step. Returns { result, state, symbol } where result is
  // "moved", "halted", "undefined" (empty or incomplete cell), "cannot"
  // (cell marked cannot occur), or "already-halted".
  function step(machine, run) {
    if (run.halted) {
      return { result: "already-halted" };
    }
    var state = run.state;
    var symbol = readTape(run, run.head);
    var cell = machine.table[state][symbol];
    var kind = cellKind(cell);
    if (kind === "cannot") {
      return { result: "cannot", state: state, symbol: symbol };
    }
    if (kind !== "complete") {
      return { result: "undefined", state: state, symbol: symbol };
    }

    run.history.push({
      head: run.head,
      state: state,
      symbol: symbol,
      last: run.last,
      lo: run.lo,
      hi: run.hi
    });

    run.tape[run.head] = cell.write;
    run.last = { from: state, symbol: symbol, write: cell.write, action: cell.action, to: cell.next };
    run.steps += 1;

    if (cell.action === "H") {
      run.halted = true;
      return { result: "halted", state: state, symbol: symbol };
    }

    run.state = cell.next;
    if (cell.action === "L") {
      run.head -= 1;
    } else if (cell.action === "R") {
      run.head += 1;
    }
    run.lo = Math.min(run.lo, run.head);
    run.hi = Math.max(run.hi, run.head);
    return { result: "moved", state: state, symbol: symbol };
  }

  // Undoes the most recent step. Returns false if there is nothing to undo.
  function stepBack(run) {
    if (run.history.length === 0) {
      return false;
    }
    var h = run.history.pop();
    run.tape[h.head] = h.symbol;
    run.head = h.head;
    run.state = h.state;
    run.last = h.last;
    run.lo = h.lo;
    run.hi = h.hi;
    run.steps -= 1;
    run.halted = false;
    return true;
  }

  // The used part of the tape as text, with the head cell in brackets.
  function tapeString(run) {
    var a = Math.min(run.lo, run.head);
    var b = Math.max(run.hi, run.head);
    while (a < run.head && readTape(run, a) === BLANK) {
      a += 1;
    }
    while (b > run.head && readTape(run, b) === BLANK) {
      b -= 1;
    }
    var parts = [];
    for (var p = a; p <= b; p++) {
      var sym = readTape(run, p);
      parts.push(p === run.head ? "[" + sym + "]" : sym);
    }
    return parts.join(" ");
  }

  // Edge label used in the diagram: "a / b, A".
  function transitionLabel(read, cell) {
    return read + " / " + cell.write + ", " + cell.action;
  }

  /* ---- Saving and loading ---- */

  function serialize(machine) {
    var transitions = [];
    for (var s = 0; s < machine.k; s++) {
      machine.symbols.forEach(function (sym) {
        var cell = machine.table[s][sym];
        var kind = cellKind(cell);
        if (kind === "cannot") {
          transitions.push({ state: s, read: sym, cannotOccur: true });
        } else if (kind !== "empty") {
          transitions.push({ state: s, read: sym, next: cell.next, write: cell.write, action: cell.action });
        }
      });
    }
    var data = {
      format: "tm-simulator",
      version: 1,
      states: machine.k,
      extraSymbols: machine.extras,
      transitions: transitions
    };
    return JSON.stringify(data, null, 2);
  }

  // Builds a machine from saved text. Throws an Error with a readable
  // message if the text is not a valid saved machine.
  function parse(text) {
    var data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error("The file is not valid JSON.");
    }
    if (!data || typeof data !== "object" || data.format !== "tm-simulator") {
      throw new Error("The file is not a saved Turing machine.");
    }
    if (!Number.isInteger(data.states) || data.states < 1 || data.states > MAX_STATES) {
      throw new Error("The number of states must be a whole number from 1 to " + MAX_STATES + ".");
    }
    if (!Array.isArray(data.extraSymbols) || !data.extraSymbols.every(function (x) { return typeof x === "string" && Array.from(x).length === 1; })) {
      throw new Error("The list of extra symbols is not valid.");
    }
    var extras = parseExtraSymbols(data.extraSymbols.join(""));
    if (extras.error) {
      throw new Error(extras.error);
    }
    if (!Array.isArray(data.transitions)) {
      throw new Error("The list of transitions is missing.");
    }

    var machine = createMachine(data.states, extras.symbols);
    data.transitions.forEach(function (t, index) {
      var where = "Transition " + (index + 1) + ": ";
      if (!t || typeof t !== "object") {
        throw new Error(where + "not a valid entry.");
      }
      if (!Number.isInteger(t.state) || t.state < 0 || t.state >= machine.k) {
        throw new Error(where + "state " + t.state + " does not exist.");
      }
      if (machine.symbols.indexOf(t.read) === -1) {
        throw new Error(where + "symbol " + t.read + " is not in the alphabet.");
      }
      if (t.cannotOccur === true) {
        machine.table[t.state][t.read] = { cannot: true };
        return;
      }
      var next = t.next === undefined ? null : t.next;
      var write = t.write === undefined ? null : t.write;
      var action = t.action === undefined ? null : t.action;
      if (next !== null && next !== HALT && !(Number.isInteger(next) && next >= 0 && next < machine.k)) {
        throw new Error(where + "next state " + next + " does not exist.");
      }
      if (write !== null && machine.symbols.indexOf(write) === -1) {
        throw new Error(where + "written symbol " + write + " is not in the alphabet.");
      }
      if (action !== null && ACTIONS.indexOf(action) === -1) {
        throw new Error(where + "action " + action + " is not one of L, R, S, H.");
      }
      if ((action === "H") !== (next === HALT) && action !== null && next !== null) {
        throw new Error(where + "action H must be paired with next state " + HALT + ".");
      }
      var cell = { next: next, write: write, action: action };
      if (cellKind(cell) !== "empty") {
        machine.table[t.state][t.read] = cell;
      }
    });
    return machine;
  }

  /* ---- Preloaded examples ---- */

  // Each row maps a read symbol to "next,write,action" or "x" (cannot occur).
  var EXAMPLES = [
    {
      name: "Flip every bit",
      input: "10110",
      extras: [],
      rows: [
        { "0": "0,1,R", "1": "0,0,R", "▷": "x", "ϕ": "*,ϕ,H" }
      ]
    },
    {
      name: "Binary increment",
      input: "1011",
      extras: [],
      rows: [
        // State 0: move right to the end of the input.
        { "0": "0,0,R", "1": "0,1,R", "▷": "x", "ϕ": "1,ϕ,L" },
        // State 1: add one, carrying leftward.
        { "0": "*,1,H", "1": "1,0,L", "▷": "2,1,L", "ϕ": "x" },
        // State 2: the carry replaced the start marker, so write a new one.
        { "0": "x", "1": "x", "▷": "x", "ϕ": "*,▷,H" }
      ]
    },
    {
      name: "Parity of the number of 1s",
      input: "1101",
      extras: [],
      rows: [
        // State 0: an even number of 1s so far. Appends 0 at the end.
        { "0": "0,0,R", "1": "1,1,R", "▷": "x", "ϕ": "*,0,H" },
        // State 1: an odd number of 1s so far. Appends 1 at the end.
        { "0": "1,0,R", "1": "0,1,R", "▷": "x", "ϕ": "*,1,H" }
      ]
    }
  ];

  function buildExample(index) {
    var example = EXAMPLES[index];
    var machine = createMachine(example.rows.length, example.extras);
    example.rows.forEach(function (row, s) {
      Object.keys(row).forEach(function (sym) {
        var spec = row[sym];
        if (spec === "x") {
          machine.table[s][sym] = { cannot: true };
          return;
        }
        var parts = spec.split(",");
        machine.table[s][sym] = {
          next: parts[0] === HALT ? HALT : Number(parts[0]),
          write: parts[1],
          action: parts[2]
        };
      });
    });
    return machine;
  }

  return {
    START: START,
    BLANK: BLANK,
    HALT: HALT,
    ACTIONS: ACTIONS,
    MAX_STATES: MAX_STATES,
    EXAMPLES: EXAMPLES,
    parseExtraSymbols: parseExtraSymbols,
    createMachine: createMachine,
    resizeMachine: resizeMachine,
    cellKind: cellKind,
    validateInput: validateInput,
    createRun: createRun,
    readTape: readTape,
    step: step,
    stepBack: stepBack,
    tapeString: tapeString,
    transitionLabel: transitionLabel,
    serialize: serialize,
    parse: parse,
    buildExample: buildExample
  };
})();

// Lets the simulation be tested outside a browser.
if (typeof module !== "undefined") {
  module.exports = TM;
}

/* ====================================================================== */
/* Part 2: user interface                                                  */
/* ====================================================================== */

if (typeof document !== "undefined") {
  (function () {
    var SAVE_FILE_NAME = "turing-machine.json";
    var STEP_CAP = 10000; // steps per press of Run before pausing
    var SVG_NS = "http://www.w3.org/2000/svg";

    // Diagram geometry, in SVG user units.
    var VIEW_W = 800;
    var VIEW_H = 500;
    var NODE_R = 22;
    var LABEL_CHAR_W = 7.6;
    var LABEL_LINE_H = 17;

    var machine = TM.createMachine(2, []);
    var currentInput = "";
    var run = TM.createRun(currentInput);
    var positions = []; // diagram position of each state
    var cellMap = []; // cellMap[state][symbol] is the table cell element
    var timer = null;
    var runBudget = 0;
    var dragging = null;
    var typeBuffer = { select: null, text: "", time: 0 };

    function byId(id) {
      return document.getElementById(id);
    }

    function setStatus(message) {
      byId("status").textContent = message;
    }

    /* ---- Setup ---- */

    function syncSetupFields() {
      byId("num-states").value = machine.k;
      byId("extra-symbols").value = machine.extras.join("");
      byId("setup-error").textContent = "";
    }

    function applySetup(event) {
      event.preventDefault();
      var errorBox = byId("setup-error");
      var k = Number(byId("num-states").value);
      if (!Number.isInteger(k) || k < 1 || k > TM.MAX_STATES) {
        errorBox.textContent = "The number of states must be a whole number from 1 to " + TM.MAX_STATES + ".";
        return;
      }
      var extras = TM.parseExtraSymbols(byId("extra-symbols").value);
      if (extras.error) {
        errorBox.textContent = extras.error;
        return;
      }
      errorBox.textContent = "";
      var stateCountChanged = k !== machine.k;
      machine = TM.resizeMachine(machine, k, extras.symbols);
      if (stateCountChanged) {
        layoutNodes();
      }
      buildTable();
      checkInputAndReset();
      byId("setup-status").textContent = "Table updated: " + k + (k === 1 ? " state, " : " states, ") + machine.symbols.length + " symbols.";
    }

    function installMachine(newMachine, input, message) {
      stopTimer();
      machine = newMachine;
      syncSetupFields();
      layoutNodes();
      buildTable();
      if (input !== null) {
        byId("tape-input").value = input;
      }
      checkInputAndReset();
      byId("setup-status").textContent = message;
    }

    function loadExample() {
      var index = Number(byId("example-select").value);
      var example = TM.EXAMPLES[index];
      installMachine(TM.buildExample(index), example.input, "Loaded example: " + example.name + ".");
    }

    function saveMachine() {
      var blob = new Blob([TM.serialize(machine)], { type: "application/json;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = SAVE_FILE_NAME;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      byId("setup-status").textContent = "Saved the machine to " + SAVE_FILE_NAME + ". Check your downloads folder.";
    }

    function loadMachine(event) {
      var file = event.target.files[0];
      if (!file) {
        return;
      }
      var reader = new FileReader();
      reader.onload = function () {
        try {
          installMachine(TM.parse(reader.result), null, "Loaded the machine from " + file.name + ".");
        } catch (e) {
          byId("setup-status").textContent = "Could not load " + file.name + ". " + e.message;
        }
      };
      reader.onerror = function () {
        byId("setup-status").textContent = "Could not read " + file.name + ".";
      };
      reader.readAsText(file);
      event.target.value = ""; // so the same file can be chosen again
    }

    /* ---- Transition table ---- */

    function addOption(select, value, text) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = text;
      select.appendChild(option);
    }

    function makeSelect(field, state, symbol) {
      var select = document.createElement("select");
      select.dataset.field = field;
      var names = { next: "next state", write: "symbol to write", action: "action" };
      select.setAttribute("aria-label", "State " + state + ", reading " + symbol + ": " + names[field]);
      addOption(select, "", "–");
      if (field === "next") {
        for (var s = 0; s < machine.k; s++) {
          addOption(select, String(s), String(s));
        }
        addOption(select, TM.HALT, "* halt");
        addOption(select, "x", "x cannot occur");
      } else if (field === "write") {
        machine.symbols.forEach(function (sym) {
          addOption(select, sym, sym);
        });
      } else {
        TM.ACTIONS.forEach(function (a) {
          addOption(select, a, a);
        });
      }
      select.addEventListener("change", onCellChange);
      select.addEventListener("keydown", onCellKeydown);
      return select;
    }

    function buildTable() {
      var table = document.createElement("table");
      table.id = "transition-table";
      var caption = document.createElement("caption");
      caption.className = "visually-hidden";
      caption.textContent = "Transition table. Rows are states, columns are the symbol read. Each cell holds the next state, the symbol to write, and the action.";
      table.appendChild(caption);

      var head = document.createElement("thead");
      var headRow = document.createElement("tr");
      var corner = document.createElement("th");
      corner.scope = "col";
      corner.textContent = "State";
      headRow.appendChild(corner);
      machine.symbols.forEach(function (sym) {
        var th = document.createElement("th");
        th.scope = "col";
        th.textContent = sym;
        headRow.appendChild(th);
      });
      head.appendChild(headRow);
      table.appendChild(head);

      var body = document.createElement("tbody");
      cellMap = [];
      for (var s = 0; s < machine.k; s++) {
        var row = document.createElement("tr");
        var rowHead = document.createElement("th");
        rowHead.scope = "row";
        rowHead.textContent = String(s);
        row.appendChild(rowHead);
        cellMap.push({});
        for (var j = 0; j < machine.symbols.length; j++) {
          var sym = machine.symbols[j];
          var td = document.createElement("td");
          td.dataset.state = String(s);
          td.dataset.symbol = sym;
          var box = document.createElement("div");
          box.className = "cell";
          box.appendChild(makeSelect("next", s, sym));
          box.appendChild(makeSelect("write", s, sym));
          box.appendChild(makeSelect("action", s, sym));
          td.appendChild(box);
          row.appendChild(td);
          cellMap[s][sym] = td;
          refreshCell(td);
        }
        body.appendChild(row);
      }
      table.appendChild(body);

      var container = byId("table-container");
      container.textContent = "";
      container.appendChild(table);
    }

    // Makes a table cell's three dropdowns show the machine's entry.
    function refreshCell(td) {
      var cell = machine.table[Number(td.dataset.state)][td.dataset.symbol];
      var kind = TM.cellKind(cell);
      var selects = td.querySelectorAll("select");
      var next = selects[0];
      var write = selects[1];
      var action = selects[2];
      var cannot = kind === "cannot";

      next.value = cannot ? "x" : (cell && cell.next !== null ? String(cell.next) : "");
      write.value = !cannot && cell && cell.write !== null ? cell.write : "";
      action.value = !cannot && cell && cell.action !== null ? cell.action : "";

      // A "cannot occur" cell shows only the first dropdown, so Tab moves
      // straight on to the next cell.
      write.hidden = cannot;
      action.hidden = cannot;
      write.disabled = cannot;
      action.disabled = cannot;

      td.classList.toggle("cell-cannot", cannot);
      td.classList.toggle("cell-partial", kind === "partial");
    }

    function onCellChange(event) {
      applyCellEdit(event.target);
    }

    // Updates the machine after one dropdown in a cell changed.
    function applyCellEdit(select) {
      var td = select.closest("td");
      var state = Number(td.dataset.state);
      var symbol = td.dataset.symbol;
      var old = machine.table[state][symbol];
      var cell = old && !old.cannot ? { next: old.next, write: old.write, action: old.action } : { next: null, write: null, action: null };
      var value = select.value;
      var field = select.dataset.field;

      if (field === "next") {
        if (value === "x") {
          cell = { cannot: true };
        } else if (value === TM.HALT) {
          cell.next = TM.HALT;
          cell.action = "H";
        } else {
          cell.next = value === "" ? null : Number(value);
          if (cell.action === "H") {
            cell.action = null;
          }
        }
      } else if (field === "write") {
        cell.write = value === "" ? null : value;
      } else if (value === "H") {
        cell.action = "H";
        cell.next = TM.HALT;
      } else {
        cell.action = value === "" ? null : value;
        if (cell.next === TM.HALT) {
          cell.next = null;
        }
      }

      machine.table[state][symbol] = TM.cellKind(cell) === "empty" ? null : cell;
      refreshCell(td);
      renderDiagram();
    }

    function clearCell(td) {
      machine.table[Number(td.dataset.state)][td.dataset.symbol] = null;
      refreshCell(td);
      renderDiagram();
    }

    // Keyboard entry: with a dropdown focused, typing a character selects the
    // matching value directly, so a transition can be entered as
    // 1 Tab 0 Tab R Tab.
    function onCellKeydown(event) {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }
      var select = event.target;
      var key = event.key;
      if (key === "Delete" || key === "Backspace") {
        event.preventDefault();
        clearCell(select.closest("td"));
        return;
      }
      if (key.length !== 1 || key === " ") {
        return; // Tab, arrows, Enter, and Space keep their normal behavior
      }
      event.preventDefault();

      var field = select.dataset.field;
      var value = null;
      if (field === "next") {
        if (key >= "0" && key <= "9") {
          // Digits typed in quick succession form a multi-digit state number.
          var now = Date.now();
          var combined = typeBuffer.select === select && now - typeBuffer.time < 1000 ? typeBuffer.text + key : key;
          if (Number(combined) >= machine.k) {
            combined = key;
          }
          typeBuffer = { select: select, text: combined, time: now };
          if (Number(combined) < machine.k) {
            value = String(Number(combined));
          }
        } else if (key === "x" || key === "X") {
          value = "x";
        } else if (key === TM.HALT) {
          value = TM.HALT;
        }
      } else if (field === "write") {
        var sym = key === ">" ? TM.START : (key === "_" ? TM.BLANK : key);
        if (machine.symbols.indexOf(sym) !== -1) {
          value = sym;
        }
      } else {
        var action = key.toUpperCase();
        if (TM.ACTIONS.indexOf(action) !== -1) {
          value = action;
        }
      }

      if (value !== null) {
        select.value = value;
        applyCellEdit(select);
      }
    }

    function highlightCurrentCell() {
      var old = document.querySelector("td.current-cell");
      if (old) {
        old.classList.remove("current-cell");
      }
      if (run.halted) {
        return;
      }
      var td = cellMap[run.state] && cellMap[run.state][TM.readTape(run, run.head)];
      if (td) {
        td.classList.add("current-cell");
      }
    }

    /* ---- State diagram ---- */

    function svgEl(name, attributes, text) {
      var node = document.createElementNS(SVG_NS, name);
      Object.keys(attributes || {}).forEach(function (key) {
        node.setAttribute(key, attributes[key]);
      });
      if (text !== undefined) {
        node.textContent = text;
      }
      return node;
    }

    // Places the states on an ellipse, with state 0 at the left.
    function layoutNodes() {
      positions = [];
      var cx = VIEW_W / 2;
      var cy = VIEW_H / 2;
      for (var i = 0; i < machine.k; i++) {
        if (machine.k === 1) {
          positions.push({ x: cx, y: cy });
        } else {
          var angle = Math.PI + (2 * Math.PI * i) / machine.k;
          positions.push({ x: cx + 250 * Math.cos(angle), y: cy + 150 * Math.sin(angle) });
        }
      }
    }

    // Draws a block of label lines centered a little way from (x, y) in the
    // direction (nx, ny), far enough that the text clears the edge it labels.
    function drawLabel(parent, x, y, nx, ny, lines, gap) {
      var longest = 0;
      lines.forEach(function (line) {
        longest = Math.max(longest, line.text.length);
      });
      var width = longest * LABEL_CHAR_W;
      var height = lines.length * LABEL_LINE_H;
      var distance = gap + (Math.abs(nx) * width) / 2 + (Math.abs(ny) * height) / 2;
      var cx = x + nx * distance;
      var cy = y + ny * distance;
      var text = svgEl("text", { "class": "edge-label", "text-anchor": "middle" });
      lines.forEach(function (line, i) {
        var tspan = svgEl("tspan", {
          x: cx.toFixed(1),
          y: (cy - height / 2 + LABEL_LINE_H * (i + 0.75)).toFixed(1)
        }, line.text);
        if (line.active) {
          tspan.setAttribute("class", "active");
        }
        text.appendChild(tspan);
      });
      parent.appendChild(text);
    }

    function renderDiagram() {
      var svg = byId("diagram");
      var layer = byId("diagram-layer");
      layer.textContent = "";
      var k = machine.k;
      var last = run.last;

      // Collect what to draw from the complete cells of the table.
      var edges = {}; // "from>to" -> { from, to, lines, active }
      var halts = {}; // from -> { lines, active }
      var count = 0;
      for (var s = 0; s < k; s++) {
        machine.symbols.forEach(function (sym) {
          var cell = machine.table[s][sym];
          if (TM.cellKind(cell) !== "complete") {
            return;
          }
          count += 1;
          var active = !!last && last.from === s && last.symbol === sym;
          var line = { text: TM.transitionLabel(sym, cell), active: active };
          var group;
          if (cell.action === "H") {
            group = halts[s] || (halts[s] = { lines: [], active: false });
          } else {
            var key = s + ">" + cell.next;
            group = edges[key] || (edges[key] = { from: s, to: cell.next, lines: [], active: false });
          }
          group.lines.push(line);
          group.active = group.active || active;
        });
      }

      byId("diagram-title").textContent = "State diagram with " + k + (k === 1 ? " state and " : " states and ") + count + (count === 1 ? " transition" : " transitions") + ". The transition table gives the same information as text.";

      var centroid = { x: 0, y: 0 };
      positions.forEach(function (p) {
        centroid.x += p.x / k;
        centroid.y += p.y / k;
      });

      var edgeLayer = svgEl("g");
      var nodeLayer = svgEl("g");
      var labelLayer = svgEl("g");

      // Edges between two different states.
      Object.keys(edges).forEach(function (key) {
        var edge = edges[key];
        if (edge.from === edge.to) {
          return;
        }
        var a = positions[edge.from];
        var b = positions[edge.to];
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        var length = Math.sqrt(dx * dx + dy * dy) || 1;
        var nx = -dy / length;
        var ny = dx / length;
        // Bend the arrow if there is also one in the opposite direction.
        var bend = edges[edge.to + ">" + edge.from] ? 44 : 0;
        var control = { x: (a.x + b.x) / 2 + nx * bend, y: (a.y + b.y) / 2 + ny * bend };
        var startDir = unit(control.x - a.x, control.y - a.y);
        var endDir = unit(control.x - b.x, control.y - b.y);
        var p0 = { x: a.x + startDir.x * NODE_R, y: a.y + startDir.y * NODE_R };
        var p1 = { x: b.x + endDir.x * NODE_R, y: b.y + endDir.y * NODE_R };
        edgeLayer.appendChild(svgEl("path", {
          "class": edge.active ? "edge active" : "edge",
          d: "M" + p0.x.toFixed(1) + "," + p0.y.toFixed(1) + " Q" + control.x.toFixed(1) + "," + control.y.toFixed(1) + " " + p1.x.toFixed(1) + "," + p1.y.toFixed(1),
          "marker-end": "url(#arrowhead)"
        }));
        var mid = { x: 0.25 * p0.x + 0.5 * control.x + 0.25 * p1.x, y: 0.25 * p0.y + 0.5 * control.y + 0.25 * p1.y };
        drawLabel(labelLayer, mid.x, mid.y, nx, ny, edge.lines, 7);
      });

      // Things attached to a single state, fanned out on its outer side:
      // the start arrow, a self-loop, and a halt stub.
      for (var i = 0; i < k; i++) {
        var p = positions[i];
        var loop = edges[i + ">" + i];
        var halt = halts[i];
        var attachments = [];
        if (i === 0) {
          attachments.push("start");
        }
        if (loop) {
          attachments.push("loop");
        }
        if (halt) {
          attachments.push("halt");
        }
        var ox = p.x - centroid.x;
        var oy = p.y - centroid.y;
        var outward = Math.sqrt(ox * ox + oy * oy) < 1 ? Math.PI : Math.atan2(oy, ox);
        for (var j = 0; j < attachments.length; j++) {
          var angle = outward + (j - (attachments.length - 1) / 2) * 1.05;
          var d = { x: Math.cos(angle), y: Math.sin(angle) };
          if (attachments[j] === "start") {
            edgeLayer.appendChild(svgEl("line", {
              "class": "edge",
              x1: (p.x + d.x * (NODE_R + 40)).toFixed(1),
              y1: (p.y + d.y * (NODE_R + 40)).toFixed(1),
              x2: (p.x + d.x * (NODE_R + 1)).toFixed(1),
              y2: (p.y + d.y * (NODE_R + 1)).toFixed(1),
              "marker-end": "url(#arrowhead)"
            }));
            drawLabel(labelLayer, p.x + d.x * (NODE_R + 40), p.y + d.y * (NODE_R + 40), d.x, d.y, [{ text: "start" }], 4);
          } else if (attachments[j] === "loop") {
            var a1 = angle - 0.42;
            var a2 = angle + 0.42;
            var c1 = angle - 0.62;
            var c2 = angle + 0.62;
            var far = NODE_R + 52;
            edgeLayer.appendChild(svgEl("path", {
              "class": loop.active ? "edge active" : "edge",
              d: "M" + (p.x + NODE_R * Math.cos(a1)).toFixed(1) + "," + (p.y + NODE_R * Math.sin(a1)).toFixed(1) +
                " C" + (p.x + far * Math.cos(c1)).toFixed(1) + "," + (p.y + far * Math.sin(c1)).toFixed(1) +
                " " + (p.x + far * Math.cos(c2)).toFixed(1) + "," + (p.y + far * Math.sin(c2)).toFixed(1) +
                " " + (p.x + NODE_R * Math.cos(a2)).toFixed(1) + "," + (p.y + NODE_R * Math.sin(a2)).toFixed(1),
              "marker-end": "url(#arrowhead)"
            }));
            drawLabel(labelLayer, p.x + d.x * (NODE_R + 38), p.y + d.y * (NODE_R + 38), d.x, d.y, loop.lines, 6);
          } else {
            // Halt stub: a short arrow ending in a filled square. The square
            // is a mark, not a state.
            var tip = { x: p.x + d.x * (NODE_R + 34), y: p.y + d.y * (NODE_R + 34) };
            edgeLayer.appendChild(svgEl("line", {
              "class": halt.active ? "edge active" : "edge",
              x1: (p.x + d.x * NODE_R).toFixed(1),
              y1: (p.y + d.y * NODE_R).toFixed(1),
              x2: tip.x.toFixed(1),
              y2: tip.y.toFixed(1),
              "marker-end": "url(#arrowhead)"
            }));
            var mark = { x: p.x + d.x * (NODE_R + 41), y: p.y + d.y * (NODE_R + 41) };
            edgeLayer.appendChild(svgEl("rect", {
              "class": "halt-mark",
              x: (mark.x - 6).toFixed(1),
              y: (mark.y - 6).toFixed(1),
              width: 12,
              height: 12
            }));
            drawLabel(labelLayer, mark.x, mark.y, d.x, d.y, halt.lines, 12);
          }
        }
      }

      // States.
      for (var n = 0; n < k; n++) {
        var isCurrent = n === run.state;
        var group = svgEl("g", { "class": isCurrent ? "node current" : "node", "data-state": n });
        if (isCurrent) {
          group.appendChild(svgEl("circle", { "class": "node-ring", cx: positions[n].x.toFixed(1), cy: positions[n].y.toFixed(1), r: NODE_R + 6 }));
        }
        group.appendChild(svgEl("circle", { "class": "node-circle", cx: positions[n].x.toFixed(1), cy: positions[n].y.toFixed(1), r: NODE_R }));
        group.appendChild(svgEl("text", { "class": "node-label", x: positions[n].x.toFixed(1), y: (positions[n].y + 5).toFixed(1), "text-anchor": "middle" }, String(n)));
        nodeLayer.appendChild(group);
      }

      layer.appendChild(edgeLayer);
      layer.appendChild(nodeLayer);
      layer.appendChild(labelLayer);
      svg.setAttribute("viewBox", "0 0 " + VIEW_W + " " + VIEW_H);
    }

    function unit(x, y) {
      var length = Math.sqrt(x * x + y * y) || 1;
      return { x: x / length, y: y / length };
    }

    // Dragging a state with the mouse or a finger rearranges the diagram.
    function svgPoint(event) {
      var svg = byId("diagram");
      var point = svg.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      return point.matrixTransform(svg.getScreenCTM().inverse());
    }

    function onDiagramPointerDown(event) {
      var node = event.target.closest ? event.target.closest(".node") : null;
      if (!node) {
        return;
      }
      var index = Number(node.getAttribute("data-state"));
      var point = svgPoint(event);
      dragging = { index: index, dx: positions[index].x - point.x, dy: positions[index].y - point.y };
      byId("diagram").setPointerCapture(event.pointerId);
      event.preventDefault();
    }

    function onDiagramPointerMove(event) {
      if (!dragging) {
        return;
      }
      var point = svgPoint(event);
      positions[dragging.index] = {
        x: Math.min(VIEW_W - 40, Math.max(40, point.x + dragging.dx)),
        y: Math.min(VIEW_H - 40, Math.max(40, point.y + dragging.dy))
      };
      renderDiagram();
    }

    function onDiagramPointerUp() {
      dragging = null;
    }

    /* ---- Tape and run ---- */

    function renderTape() {
      var container = byId("tape");
      container.textContent = "";
      var first = Math.min(run.lo, run.head, -1) - 3;
      var last = Math.max(run.hi, run.head) + 3;
      last = Math.max(last, first + 16);

      container.appendChild(tapeEnd());
      var headCell = null;
      for (var p = first; p <= last; p++) {
        var cell = document.createElement("div");
        cell.className = p === run.head ? "tape-cell head" : "tape-cell";
        var symbol = document.createElement("span");
        symbol.className = "tape-symbol";
        symbol.textContent = TM.readTape(run, p);
        var index = document.createElement("span");
        index.className = "tape-index";
        index.textContent = String(p);
        var marker = document.createElement("span");
        marker.className = "tape-marker";
        marker.textContent = p === run.head ? "▲ head" : " ";
        cell.appendChild(symbol);
        cell.appendChild(index);
        cell.appendChild(marker);
        container.appendChild(cell);
        if (p === run.head) {
          headCell = cell;
        }
      }
      container.appendChild(tapeEnd());

      container.setAttribute("aria-label", "Tape, head cell in brackets: " + TM.tapeString(run));
      // Keep the head in view by scrolling the tape only, not the page.
      container.scrollLeft = headCell.offsetLeft - (container.clientWidth - headCell.offsetWidth) / 2;
    }

    function tapeEnd() {
      var end = document.createElement("div");
      end.className = "tape-end";
      end.textContent = "…";
      return end;
    }

    function updateRunView() {
      renderTape();
      byId("fact-steps").textContent = String(run.steps);
      byId("fact-state").textContent = run.halted ? run.state + " (halted)" : String(run.state);
      byId("fact-head").textContent = String(run.head);
      byId("fact-symbol").textContent = TM.readTape(run, run.head);
      byId("fact-tape").textContent = TM.tapeString(run);
      byId("step-button").disabled = run.halted;
      byId("run-button").disabled = run.halted;
      byId("run-button").textContent = timer ? "Pause" : "Run";
      byId("back-button").disabled = run.history.length === 0;
      renderDiagram();
      highlightCurrentCell();
    }

    function describeLast() {
      var t = run.last;
      var text = "in state " + t.from + " read " + t.symbol + ", wrote " + t.write;
      if (t.action === "L") {
        text += ", moved left";
      } else if (t.action === "R") {
        text += ", moved right";
      } else if (t.action === "S") {
        text += ", stayed in place";
      }
      return text;
    }

    function describeConfiguration() {
      return "State " + run.state + ", head at position " + run.head + " reading " + TM.readTape(run, run.head) + ".";
    }

    // Reads the tape input field. If it is valid, restarts the run on it.
    function checkInputAndReset() {
      var input = byId("tape-input").value;
      var error = TM.validateInput(machine, input);
      byId("input-error").textContent = error || "";
      byId("tape-input").setAttribute("aria-invalid", error ? "true" : "false");
      if (!error) {
        currentInput = input;
      } else if (TM.validateInput(machine, currentInput)) {
        currentInput = ""; // the alphabet changed and the old input no longer fits
      }
      resetRun();
    }

    function resetRun() {
      stopTimer();
      run = TM.createRun(currentInput);
      updateRunView();
      setStatus("Ready. " + describeConfiguration());
    }

    // Performs one step and reports it. Returns the result of TM.step.
    function doStep() {
      var outcome = TM.step(machine, run);
      if (outcome.result === "moved") {
        updateRunView();
        setStatus("Step " + run.steps + ": " + describeLast() + ". Now in state " + run.state + ", reading " + TM.readTape(run, run.head) + ".");
      } else if (outcome.result === "halted") {
        stopTimer();
        updateRunView();
        setStatus("Halted after " + run.steps + (run.steps === 1 ? " step: " : " steps: ") + describeLast() + ", and halted.");
      } else if (outcome.result === "undefined") {
        stopTimer();
        updateRunView();
        setStatus("Stopped at step " + run.steps + ": no transition is defined for state " + outcome.state + " reading " + outcome.symbol + ". Fill in that cell, then step or run to continue.");
      } else if (outcome.result === "cannot") {
        stopTimer();
        updateRunView();
        setStatus("Stopped at step " + run.steps + ": state " + outcome.state + " read " + outcome.symbol + ", but that cell is marked \"cannot occur\". The machine reached a case that was ruled out.");
      }
      return outcome.result;
    }

    function onStep() {
      stopTimer();
      doStep();
    }

    function onStepBack() {
      stopTimer();
      if (TM.stepBack(run)) {
        updateRunView();
        setStatus("Stepped back to step " + run.steps + ". " + describeConfiguration());
      }
    }

    function intervalMs() {
      return 1000 / Number(byId("speed").value);
    }

    function startTimer() {
      // Step-by-step announcements are silenced while running so that screen
      // readers are not flooded. The final result is announced.
      byId("status").setAttribute("aria-live", "off");
      timer = setInterval(tick, intervalMs());
    }

    function stopTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      byId("status").setAttribute("aria-live", "polite");
      byId("run-button").textContent = "Run";
    }

    function tick() {
      var result = doStep();
      if (result !== "moved") {
        return;
      }
      runBudget -= 1;
      if (runBudget <= 0) {
        stopTimer();
        updateRunView();
        setStatus("Paused after " + STEP_CAP.toLocaleString() + " steps without halting (step " + run.steps + "). Press Run to continue.");
      }
    }

    function onRunPause() {
      if (timer) {
        stopTimer();
        updateRunView();
        setStatus("Paused at step " + run.steps + ". " + describeConfiguration());
        return;
      }
      runBudget = STEP_CAP;
      startTimer();
      byId("run-button").textContent = "Pause";
    }

    function onSpeedChange() {
      var speed = byId("speed").value;
      byId("speed-value").textContent = speed + (speed === "1" ? " step per second" : " steps per second");
      if (timer) {
        clearInterval(timer);
        timer = setInterval(tick, intervalMs());
      }
    }

    /* ---- Start-up ---- */

    function init() {
      var exampleSelect = byId("example-select");
      TM.EXAMPLES.forEach(function (example, index) {
        addOption(exampleSelect, String(index), example.name);
      });

      byId("setup-form").addEventListener("submit", applySetup);
      byId("example-button").addEventListener("click", loadExample);
      byId("save-button").addEventListener("click", saveMachine);
      byId("file-input").addEventListener("change", loadMachine);
      byId("layout-button").addEventListener("click", function () {
        layoutNodes();
        renderDiagram();
      });
      byId("tape-input").addEventListener("input", checkInputAndReset);
      byId("step-button").addEventListener("click", onStep);
      byId("back-button").addEventListener("click", onStepBack);
      byId("run-button").addEventListener("click", onRunPause);
      byId("reset-button").addEventListener("click", resetRun);
      byId("speed").addEventListener("input", onSpeedChange);

      var svg = byId("diagram");
      svg.addEventListener("pointerdown", onDiagramPointerDown);
      svg.addEventListener("pointermove", onDiagramPointerMove);
      svg.addEventListener("pointerup", onDiagramPointerUp);
      svg.addEventListener("pointercancel", onDiagramPointerUp);

      syncSetupFields();
      layoutNodes();
      buildTable();
      onSpeedChange();
      resetRun();
      byId("script-warning").hidden = true;
    }

    init();
  })();
}
