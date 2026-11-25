import type { CSSProperties } from "react";

import type { KeyLayout } from "@/lib/keyboard-layout";

interface KeyboardKeyProps {
  definition: KeyLayout;
  pressed: boolean;
  tested: boolean;
}

export function KeyboardKey({
  definition,
  pressed,
  tested,
}: KeyboardKeyProps) {
  const style: CSSProperties = {
    gridColumn: `${definition.x + 1} / span ${definition.w}`,
    gridRow: `${definition.y + 1} / span ${definition.h}`,
  };

  const state = pressed ? ", pressed" : tested ? ", tested" : "";
  const accessibleName = definition.ariaLabel ?? definition.label;

  return (
    <div className="keyboardCell" style={style}>
      <kbd
        className="keyboardKey"
        data-code={definition.code}
        data-variant={definition.variant}
        data-has-secondary={definition.secondary ? "true" : undefined}
        data-pressed={pressed ? "true" : undefined}
        data-tested={tested ? "true" : undefined}
        aria-label={`${accessibleName} key${state}`}
      >
        {definition.secondary ? (
          <span className="keyboardSecondary" aria-hidden="true">
            {definition.secondary}
          </span>
        ) : null}
        <span className="keyboardLabel">{definition.label}</span>
      </kbd>
    </div>
  );
}
