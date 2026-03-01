# Complex Numbers & Mandelbrot Iteration (Interactive)

This tool provides a minimal conceptual bridge between complex numbers and the Mandelbrot set for use in a course on Computer Graphics.

It is designed to give students just enough background to implement a Mandelbrot renderer without requiring a full course in complex analysis.

## What it Includes

1. **Minimal Notes**
   - Complex numbers as points in the plane
   - Magnitude
   - Complex multiplication
   - Squaring formula
   - Mandelbrot iteration:
     ```
     z₀ = 0
     zₙ₊₁ = zₙ² + c
     ```
   - Escape condition: |z| > 2

2. **Interactive Visualization**
   - Draggable points for:
     - `z` (current iterate)
     - `c` (parameter)
   - Visual display of:
     - `f(z) = z² + c`
     - Arrow from `z` to `f(z)`
   - Real-time magnitude feedback
   - Keyboard accessibility

## Pedagogical Purpose

This tool helps students:

- See complex numbers as 2D vectors.
- Understand squaring geometrically.
- Visualize one step of the Mandelbrot iteration.
- Connect algebraic formulas to graphical behavior.

It is intentionally minimal and avoids polar coordinates or angle-based discussion to reduce cognitive load before programming.

## File Structure

```
mandelbrot/
└── index.html
```

The entire tool is self-contained in `index.html` (HTML, CSS, and JavaScript).

## Updating

If modifying:

- Keep accessibility considerations (keyboard support, visible focus, no color-only encoding).
- Preserve the minimal mathematical scope.
- Avoid introducing advanced complex analysis concepts unless intentionally expanding the tool.

---

Created for instructional use in Computer Graphics.
