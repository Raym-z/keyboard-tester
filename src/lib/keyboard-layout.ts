export type KeyVariant = "standard" | "modifier" | "function" | "numpad";

export type Platform = "windows" | "mac";

export interface KeyboardLayoutDefinition {
  platform: Platform;
  label: string;
  keys: KeyLayout[];
  keyByCode: ReadonlyMap<string, KeyLayout>;
  codes: ReadonlySet<string>;
}

export interface KeyLayout {
  /** Physical key identifier from KeyboardEvent.code. */
  code: string;
  /** Compact label rendered on the keycap. */
  label: string;
  /** Shifted character or secondary hint, shown in the keycap corner. */
  secondary?: string;
  /** Grid column start, measured in quarter key units. */
  x: number;
  /** Grid row start, zero-based. */
  y: number;
  /** Grid column span, measured in quarter key units. */
  w: number;
  /** Grid row span. */
  h: number;
  variant: KeyVariant;
  ariaLabel?: string;
}

interface KeySpec {
  code: string;
  label: string;
  secondary?: string;
  /** Key width in key units (1u = 1 standard alpha key). */
  width?: number;
  /** Key height in rows. */
  height?: number;
  variant?: KeyVariant;
  ariaLabel?: string;
  /** Empty space after this key. Used to build the function-row groups. */
  gapAfter?: number;
}

const UNIT = 4; // The grid uses quarter key units so fractional key widths stay exact.

function row(y: number, startX: number, specs: KeySpec[]): KeyLayout[] {
  let x = startX;

  return specs.map((spec) => {
    const key: KeyLayout = {
      code: spec.code,
      label: spec.label,
      secondary: spec.secondary,
      x: Math.round(x * UNIT),
      y,
      w: Math.round((spec.width ?? 1) * UNIT),
      h: spec.height ?? 1,
      variant: spec.variant ?? "standard",
      ariaLabel: spec.ariaLabel,
    };

    x += (spec.width ?? 1) + (spec.gapAfter ?? 0);
    return key;
  });
}

const mainRow1: KeySpec[] = [
  { code: "Backquote", label: "`", secondary: "~" },
  { code: "Digit1", label: "1", secondary: "!" },
  { code: "Digit2", label: "2", secondary: "@" },
  { code: "Digit3", label: "3", secondary: "#" },
  { code: "Digit4", label: "4", secondary: "$" },
  { code: "Digit5", label: "5", secondary: "%" },
  { code: "Digit6", label: "6", secondary: "^" },
  { code: "Digit7", label: "7", secondary: "&" },
  { code: "Digit8", label: "8", secondary: "*" },
  { code: "Digit9", label: "9", secondary: "(" },
  { code: "Digit0", label: "0", secondary: ")" },
  { code: "Minus", label: "-", secondary: "_" },
  { code: "Equal", label: "=", secondary: "+" },
  { code: "Backspace", label: "Backspace", width: 2, variant: "modifier" },
];

const mainRow2: KeySpec[] = [
  { code: "Tab", label: "Tab", width: 1.5, variant: "modifier" },
  { code: "KeyQ", label: "Q" },
  { code: "KeyW", label: "W" },
  { code: "KeyE", label: "E" },
  { code: "KeyR", label: "R" },
  { code: "KeyT", label: "T" },
  { code: "KeyY", label: "Y" },
  { code: "KeyU", label: "U" },
  { code: "KeyI", label: "I" },
  { code: "KeyO", label: "O" },
  { code: "KeyP", label: "P" },
  { code: "BracketLeft", label: "[", secondary: "{" },
  { code: "BracketRight", label: "]", secondary: "}" },
  { code: "Backslash", label: "\\", secondary: "|", width: 1.5 },
];

const mainRow3: KeySpec[] = [
  { code: "CapsLock", label: "Caps", width: 1.75, variant: "modifier", ariaLabel: "Caps Lock" },
  { code: "KeyA", label: "A" },
  { code: "KeyS", label: "S" },
  { code: "KeyD", label: "D" },
  { code: "KeyF", label: "F" },
  { code: "KeyG", label: "G" },
  { code: "KeyH", label: "H" },
  { code: "KeyJ", label: "J" },
  { code: "KeyK", label: "K" },
  { code: "KeyL", label: "L" },
  { code: "Semicolon", label: ";", secondary: ":" },
  { code: "Quote", label: "'", secondary: '"' },
  { code: "Enter", label: "Enter", width: 2.25, variant: "modifier" },
];

const mainRow4: KeySpec[] = [
  { code: "ShiftLeft", label: "Shift", width: 2.25, variant: "modifier" },
  { code: "KeyZ", label: "Z" },
  { code: "KeyX", label: "X" },
  { code: "KeyC", label: "C" },
  { code: "KeyV", label: "V" },
  { code: "KeyB", label: "B" },
  { code: "KeyN", label: "N" },
  { code: "KeyM", label: "M" },
  { code: "Comma", label: ",", secondary: "<" },
  { code: "Period", label: ".", secondary: ">" },
  { code: "Slash", label: "/", secondary: "?" },
  { code: "ShiftRight", label: "Shift", width: 2.75, variant: "modifier" },
];

const windowsBottomRow: KeySpec[] = [
  { code: "ControlLeft", label: "Ctrl", width: 1.25, variant: "modifier" },
  { code: "MetaLeft", label: "Win", width: 1.25, variant: "modifier", ariaLabel: "Windows" },
  { code: "AltLeft", label: "Alt", width: 1.25, variant: "modifier" },
  { code: "Space", label: "Space", width: 6.25, variant: "modifier" },
  { code: "AltRight", label: "Alt", width: 1.25, variant: "modifier" },
  { code: "MetaRight", label: "Win", width: 1.25, variant: "modifier", ariaLabel: "Windows" },
  { code: "ContextMenu", label: "Menu", width: 1.25, variant: "modifier", ariaLabel: "Context menu" },
  { code: "ControlRight", label: "Ctrl", width: 1.25, variant: "modifier" },
];

const macBottomRow: KeySpec[] = [
  { code: "Fn", label: "Fn", width: 1.25, variant: "modifier", ariaLabel: "Function" },
  { code: "ControlLeft", label: "Ctrl", secondary: "⌃", width: 1.25, variant: "modifier" },
  { code: "AltLeft", label: "Option", secondary: "⌥", width: 1.25, variant: "modifier" },
  { code: "MetaLeft", label: "Cmd", secondary: "⌘", width: 1.25, variant: "modifier", ariaLabel: "Command" },
  { code: "Space", label: "Space", width: 6.25, variant: "modifier" },
  { code: "MetaRight", label: "Cmd", secondary: "⌘", width: 1.25, variant: "modifier", ariaLabel: "Command" },
  { code: "AltRight", label: "Option", secondary: "⌥", width: 1.25, variant: "modifier" },
  { code: "ControlRight", label: "Ctrl", secondary: "⌃", width: 1.25, variant: "modifier" },
];

const functionRow: KeySpec[] = [
  { code: "Escape", label: "Esc", variant: "function", ariaLabel: "Escape", gapAfter: 1 },
  ...Array.from({ length: 4 }, (_, index): KeySpec => ({
    code: `F${index + 1}`,
    label: `F${index + 1}`,
    variant: "function",
    gapAfter: index === 3 ? 0.5 : 0,
  })),
  ...Array.from({ length: 4 }, (_, index): KeySpec => ({
    code: `F${index + 5}`,
    label: `F${index + 5}`,
    variant: "function",
    gapAfter: index === 3 ? 0.5 : 0,
  })),
  ...Array.from({ length: 4 }, (_, index): KeySpec => ({
    code: `F${index + 9}`,
    label: `F${index + 9}`,
    variant: "function",
  })),
];

const navigationTopRow: KeySpec[] = [
  { code: "PrintScreen", label: "PrtSc", variant: "function", ariaLabel: "Print Screen" },
  { code: "ScrollLock", label: "ScrLk", variant: "function", ariaLabel: "Scroll Lock" },
  { code: "Pause", label: "Pause", variant: "function" },
];

const navigationRow1: KeySpec[] = [
  { code: "Insert", label: "Ins", ariaLabel: "Insert" },
  { code: "Home", label: "Home" },
  { code: "PageUp", label: "PgUp", ariaLabel: "Page Up" },
];

const navigationRow2: KeySpec[] = [
  { code: "Delete", label: "Del", ariaLabel: "Delete" },
  { code: "End", label: "End" },
  { code: "PageDown", label: "PgDn", ariaLabel: "Page Down" },
];

const arrowTopRow: KeySpec[] = [
  { code: "ArrowUp", label: "↑", ariaLabel: "Up arrow" },
];

const arrowBottomRow: KeySpec[] = [
  { code: "ArrowLeft", label: "←", ariaLabel: "Left arrow" },
  { code: "ArrowDown", label: "↓", ariaLabel: "Down arrow" },
  { code: "ArrowRight", label: "→", ariaLabel: "Right arrow" },
];

const numpadRow1: KeySpec[] = [
  { code: "NumLock", label: "Num", ariaLabel: "Num Lock", variant: "numpad" },
  { code: "NumpadDivide", label: "/", ariaLabel: "Numpad divide", variant: "numpad" },
  { code: "NumpadMultiply", label: "×", ariaLabel: "Numpad multiply", variant: "numpad" },
  { code: "NumpadSubtract", label: "−", ariaLabel: "Numpad subtract", variant: "numpad" },
];

const numpadRow2: KeySpec[] = [
  { code: "Numpad7", label: "7", ariaLabel: "Numpad 7", variant: "numpad" },
  { code: "Numpad8", label: "8", ariaLabel: "Numpad 8", variant: "numpad" },
  { code: "Numpad9", label: "9", ariaLabel: "Numpad 9", variant: "numpad" },
  { code: "NumpadAdd", label: "+", ariaLabel: "Numpad add", height: 2, variant: "numpad" },
];

const numpadRow3: KeySpec[] = [
  { code: "Numpad4", label: "4", ariaLabel: "Numpad 4", variant: "numpad" },
  { code: "Numpad5", label: "5", ariaLabel: "Numpad 5", variant: "numpad" },
  { code: "Numpad6", label: "6", ariaLabel: "Numpad 6", variant: "numpad" },
];

const numpadRow4: KeySpec[] = [
  { code: "Numpad1", label: "1", ariaLabel: "Numpad 1", variant: "numpad" },
  { code: "Numpad2", label: "2", ariaLabel: "Numpad 2", variant: "numpad" },
  { code: "Numpad3", label: "3", ariaLabel: "Numpad 3", variant: "numpad" },
  { code: "NumpadEnter", label: "Enter", ariaLabel: "Numpad enter", height: 2, variant: "modifier" },
];

const numpadRow5: KeySpec[] = [
  { code: "Numpad0", label: "0", width: 2, ariaLabel: "Numpad 0", variant: "numpad" },
  { code: "NumpadDecimal", label: ".", ariaLabel: "Numpad decimal", variant: "numpad" },
];

/**
 * Full-size ANSI (104-key) layout.
 *
 * The entire board is a 92 x 6 quarter-unit grid:
 * 60 for the typing area, 2 for a gap, 12 for navigation, 2 for a gap, 16 for the numpad.
 */
function createLayout(
  platform: Platform,
  label: string,
  bottomRow: KeySpec[],
): KeyboardLayoutDefinition {
  const keys: KeyLayout[] = [
    ...row(0, 0, functionRow),
    ...row(1, 0, mainRow1),
    ...row(2, 0, mainRow2),
    ...row(3, 0, mainRow3),
    ...row(4, 0, mainRow4),
    ...row(5, 0, bottomRow),
    ...row(0, 15.5, navigationTopRow),
    ...row(1, 15.5, navigationRow1),
    ...row(2, 15.5, navigationRow2),
    ...row(4, 16.5, arrowTopRow),
    ...row(5, 15.5, arrowBottomRow),
    ...row(1, 19, numpadRow1),
    ...row(2, 19, numpadRow2),
    ...row(3, 19, numpadRow3),
    ...row(4, 19, numpadRow4),
    ...row(5, 19, numpadRow5),
  ];

  return {
    platform,
    label,
    keys,
    keyByCode: new Map(keys.map((key) => [key.code, key])),
    codes: new Set(keys.map((key) => key.code)),
  };
}

export const KEYBOARD_LAYOUTS: Record<Platform, KeyboardLayoutDefinition> = {
  windows: createLayout("windows", "Windows", windowsBottomRow),
  mac: createLayout("mac", "Mac", macBottomRow),
};

export function getKeyboardLayout(platform: Platform): KeyboardLayoutDefinition {
  return KEYBOARD_LAYOUTS[platform];
}
