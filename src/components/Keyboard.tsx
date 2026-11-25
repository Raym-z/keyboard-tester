import type { KeyboardLayoutDefinition } from "@/lib/keyboard-layout";

import { KeyboardKey } from "./KeyboardKey";

interface KeyboardProps {
  layout: KeyboardLayoutDefinition;
  pressedCodes: ReadonlySet<string>;
  testedCodes: ReadonlySet<string>;
}

export function Keyboard({ layout, pressedCodes, testedCodes }: KeyboardProps) {
  return (
    <div>
      <div className="keyboardViewport">
        <div className="keyboardFrame">
          <div
            className="keyboardBoard"
            role="group"
            aria-label={`Virtual full-size ${layout.label} keyboard`}
          >
            {layout.keys.map((definition) => (
              <KeyboardKey
                key={definition.code}
                definition={definition}
                pressed={pressedCodes.has(definition.code)}
                tested={testedCodes.has(definition.code)}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="keyboardScrollHint mt-1 text-center text-[11px] text-slate-400">
        Swipe or scroll to see the full keyboard
      </p>
    </div>
  );
}
