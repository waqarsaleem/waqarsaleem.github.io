# Tool specification: Turing machine simulator

## Purpose

The student defines a Turing machine by filling in its transition table, sees it as a state diagram, and runs it on an input one step at a time.

- **Course:** COSC 440, Theory of Computation
- **Topic or unit:** Turing machines
- **Used:** in class and by students on their own

## Model

- **States.** The machine has k states, numbered 0 to k−1. It starts in state 0. There is no halt state.
- **Alphabet.** Always contains 0, 1, ▷ (start of input), and ϕ (null). The student may add extra symbols.
- **Tape.** Infinite in both directions. It holds ▷, then the input immediately to its right, and ϕ in every other cell. ▷ is an ordinary symbol: the head may move left past it, and the machine may overwrite it.
- **Positions.** The first input symbol is at position 0 and ▷ is at position −1.
- **Start.** The head starts on the first input symbol (position 0), not on ▷. With empty input, the head starts on the ϕ just right of ▷.
- **Transition function.** Takes the current state and the symbol under the head, and gives a next state, a symbol to write, and an action.
- **Actions.** L (move left), R (move right), S (stay), H (halt).
- **Step.** Write the symbol, then change state and move.
- **Halting.** On action H, the machine writes the symbol and stops. The next state is irrelevant and is shown as `*`. The halting step counts as a step.
- **Result.** There is no accept or reject and no designated output. The final state and tape are shown.

This start position follows the instructor's convention and may differ from the course textbook.

## Page sections

Above the numbered sections is a collapsible block, "How to use this tool", open by default. It names the two ways to start, loading an example or building a machine, and points to the step for each.

1. **Set up the machine.** Number of states, extra symbols, examples, save and load.
2. **Transition table.** Where the machine is defined.
3. **Run the machine.** The tape input, then a panel holding the tape, the run controls, and the status message, then the state diagram and the readouts.

The panel in section 3 stays at the top of the window while the student scrolls through the diagram, so the controls and the diagram can be seen together. It does this only on a window at least 48rem wide and 38rem tall. On a smaller window, or at a high zoom level, it scrolls with the page, because a pinned panel would take too much of the screen. On a wide window the diagram is also sized to fit beside the panel.

## Inputs

- **Number of states.** A whole number from 1 to 20.
- **Extra symbols.** Single typable characters, typed one after another. Rejected: whitespace, duplicates, the four built-in symbols, and `>` and `_` (reserved as keyboard shortcuts). At most 12.
- **Changing either of these** rebuilds the table, keeps every existing entry that is still valid, and restarts the run. A field that refers to a removed state or symbol is blanked.
- **Transition table.** One row per state. Columns in the order 0, 1, extra symbols, ▷, ϕ. Each cell is one of:
  - **Empty.** Not yet filled in.
  - **Transition.** Three dropdowns: next state, symbol to write, action.
  - **Incomplete.** Some but not all of the three chosen. Treated as empty when run.
  - **Cannot occur.** The student asserts this case is never reached.
- **Halt pairing.** Choosing action H sets the next state to `*`, and choosing `*` sets the action to H. Changing either one away clears the other.
- **Iterative building.** Cells may be filled, changed, or cleared at any time, including during a paused run. Edits apply from the next step.
- **Tape input.** Any symbols of the alphabet except ▷ and ϕ. Changing it restarts the run.

## Display

- **State diagram.**
  - One circle per state, labeled with its number, placed automatically on an ellipse with state 0 at the left.
  - An arrow labeled "start" points into state 0.
  - Each complete transition is an arrow labeled `a / b, A`, where a is the symbol read, b the symbol written, and A the action. Transitions between the same two states share one arrow with stacked labels. Arrows in opposite directions between two states curve apart.
  - A transition from a state to itself is a loop.
  - A halting transition is a short arrow leaving its state and ending in a filled square. The square is a mark, not a state.
  - Empty, incomplete, and cannot-occur cells are not drawn.
  - The diagram redraws whenever the table changes.
  - The current state has a double outline and highlight fill. The transition just taken is drawn thicker with its label in bold.
  - States can be dragged to rearrange the picture. This is cosmetic and mouse or touch only. A button restores the automatic layout.
  - Text equivalent: the transition table.
- **Tape.** A row of cells showing each symbol with its position number beneath, extending a few cells beyond the used part, with an ellipsis at each end. The head cell has a thick border, highlight fill, and the word "head" beneath. The tape scrolls to keep the head centered.
  - Text equivalent: the tape readout, which lists the used part of the tape with the head cell in brackets.
- **Table.** The cell the machine will use next has a thick border. Incomplete cells have a dashed border. Cannot-occur cells are striped.
- **Readouts.** Steps taken, current state, head position, symbol under head, and tape as text.

## Actions

| Control | Effect | Unavailable when |
|---|---|---|
| Update table | Applies the number of states and extra symbols | Never |
| Load example | Replaces the machine and input with the chosen example | Never |
| Save machine to file | Downloads the machine | Never |
| Load machine from file | Replaces the machine with the one in the file | Never |
| Reset diagram layout | Restores automatic placement of states | Never |
| Step | Performs one step | Halted |
| Step back | Undoes the last step | No steps taken |
| Run, Pause | Steps automatically at the chosen speed; the label shows the next action | Halted |
| Reset | Restarts the run on the current input | Never |
| Run speed | 1 to 20 steps per second, default 2 | Never |

## Outcomes and messages

| Outcome | Behavior |
|---|---|
| Normal step | Status reports the step number, what was read and written, the move, and the new state and symbol |
| Halt | Status reports "Halted after n steps". Step and Run become unavailable. Step back and Reset still work. |
| Empty or incomplete cell reached | The run stops with "no transition is defined" naming the state and symbol. The student can fill in the cell and continue. |
| Cannot-occur cell reached | The run stops with a distinct message saying the machine reached a case that was ruled out. |
| Step cap reached | Run pauses after 10,000 steps without halting. Pressing Run continues for another 10,000. |
| Invalid setup or input | An error beside the field names the problem. The previous valid value stays in effect. |

During an automatic run, per-step screen-reader announcements are silenced and the final result is announced.

## Keyboard entry

In the transition table, Tab moves through the cells in row order with three stops per cell, and typing a character at a stop selects that value. A full transition is entered as, for example, `1` Tab `0` Tab `R` Tab.

- **Next state stop:** digits select a state, and two digits typed within one second select a two-digit state. `x` marks the cell cannot occur, after which Tab moves straight to the next cell. `*` selects halt.
- **Symbol stop:** the symbol's own character. `>` selects ▷ and `_` selects ϕ.
- **Action stop:** `L`, `R`, `S`, or `H`, in either case.
- **Delete or Backspace** at any stop clears the cell.

## Limits

- States: 1 to 20.
- Extra symbols: at most 12.
- Step cap: 10,000 steps per press of Run.

## Save and load

- **Saved:** number of states, extra symbols, and every non-empty table cell, including incomplete and cannot-occur cells.
- **Not saved:** tape input, run progress, and diagram layout.
- **File:** `turing-machine.json`, with format name `tm-simulator`, version 1.
- Nothing is stored in the browser. Reloading the page clears the machine.

## Examples

| Name | Demonstrates | Sample input |
|---|---|---|
| Flip every bit | A one-state machine with a self-loop and a halt | 10110 |
| Binary increment | Scanning right, then carrying left. On a carry out of the leftmost digit it overwrites ▷ and writes a new ▷ one cell further left, using the two-way tape. | 1011 |
| Parity of the number of 1s | Using state as memory. Appends 0 for even or 1 for odd. | 1101 |

## Out of scope

- Accept and reject states, and languages decided or recognized.
- Multiple tapes, nondeterminism, and multi-track tapes.
- Typed aliases for ▷ and ϕ in the tape input, since the input may not contain either.
- Keyboard rearrangement of the diagram.

## Decisions log

- **2026-11-09.** Head starts on the first input symbol, per the instructor's specification.
- **2026-11-09.** Tape is infinite in both directions.
- **2026-11-09.** No halt state. Halting transitions are drawn as stubs.
- **2026-11-09.** Table entry uses dropdowns, with a "cannot occur" marker and `*` for the state of a halting transition.
- **2026-11-09.** The machine may be built iteratively. Empty cells are allowed, and a run that reaches one stops and can continue once the cell is filled.
- **2026-11-09.** Edge labels use the form `a / b, A`.
- **2026-11-09.** Fast keyboard entry with Tab was added as an alternative to the mouse.
- **2026-11-10.** Save and load were added, as a JSON file.
- **2026-11-10.** `>` and `_` were reserved so that ▷ and ϕ can be selected from the keyboard.
- **2026-11-10.** Stylesheet split into the shared `base.css` and this tool's `tool.css`.
- **2026-11-14.** The diagram moved into the run section, and the tape, controls, and status were made a sticky panel. Before this, the controls were a full screen below the diagram, so a student stepping through a machine could not see both.
- **2026-11-14.** A "How to use this tool" block was added at the top of the page, so that a student opening the tool for the first time knows where to begin.
- **2026-11-14.** The pinned-panel style was moved into the shared `base.css` as `.sticky-panel` (v2), with the diagram sizing left in `tool.css`.
