# Wraith — Domain Glossary

## GlitchBanner
The ASCII art WRAITH logo rendered in the Header. On mount it plays a **boot sequence** (lines appear top→bottom). After that, a periodic **glitch pulse** randomly swaps characters every 4–6 s.

## EyeGlyph
A small animated character rendered alongside the GlitchBanner. Cycles through `◉ → ◎ → ○ → ◎ → ◉` in a loop to signal the system is alive ("observing").

## Spinner
An Ink braille-dot spinner (`⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏`) shown during initial data load. Disappears once data arrives.

## StatusBar
A sub-area in the Header showing "updated Xs ago" — derived from the last successful polling timestamp.

## ConfirmDialog
The amber-bordered dialog shown before destructive actions. Contains a `⚠` icon, the action message, and color-coded `[Y]` (danger) / `[n]` (dim) options.

## TabBar
The row of view selectors. Each tab shows a Unicode icon + label: `⚙ PROCESSES` / `⚙ SERVICES`. Active tab uses inverted colors.

## StatusMessage
Transient feedback line shown after user actions. Prefixed with a semantic icon: `✓` (ok), `✗` (err), `ℹ` (info).

## Feature
A self-contained domain slice under `src/features/`. Contains view-specific column definitions and action handlers. Current features: `processes`, `services`.

## Primitive
A pure visual building block under `src/ui/primitives/`. Has no domain knowledge — only renders. Examples: GlitchBanner, EyeGlyph, Spinner.
