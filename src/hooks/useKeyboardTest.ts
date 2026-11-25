"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface PressInfo {
  id: number;
  code: string;
  key: string;
}

/** Keys whose default action scrolls or moves focus in the page. */
const PAGE_NAVIGATION_CODES = new Set([
  "Space",
  "Tab",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
  "PageUp",
  "PageDown",
]);

const HISTORY_LIMIT = 12;
const FUNCTION_KEY_PATTERN = /^F([1-9]|1[0-2])$/;

function shouldPreventDefault(event: KeyboardEvent): boolean {
  // Leave Ctrl/Cmd/Alt shortcuts to the browser instead of swallowing them.
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return false;
  }

  // F-keys trigger browser actions such as Find (F3) or Reload (F5).
  return (
    PAGE_NAVIGATION_CODES.has(event.code) ||
    FUNCTION_KEY_PATTERN.test(event.code)
  );
}

function readCode(event: KeyboardEvent): string {
  return event.code || event.key || "Unidentified";
}

export function useKeyboardTest(knownCodes: ReadonlySet<string>) {
  const [pressedCodes, setPressedCodes] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [testedCodes, setTestedCodes] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [history, setHistory] = useState<PressInfo[]>([]);
  const [lastPress, setLastPress] = useState<PressInfo | null>(null);
  const sequence = useRef(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (shouldPreventDefault(event)) {
        event.preventDefault();
      }

      // Held keys fire keydown repeatedly. State is already set from the first event.
      if (event.repeat) {
        return;
      }

      const code = readCode(event);
      const press: PressInfo = {
        id: sequence.current++,
        code,
        key: event.key,
      };

      setPressedCodes((previous) => {
        if (previous.has(code)) {
          return previous;
        }

        const next = new Set(previous);
        next.add(code);
        return next;
      });

      setTestedCodes((previous) => {
        if (previous.has(code)) {
          return previous;
        }

        const next = new Set(previous);
        next.add(code);
        return next;
      });

      setLastPress(press);
      setHistory((previous) => [press, ...previous].slice(0, HISTORY_LIMIT));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (shouldPreventDefault(event)) {
        event.preventDefault();
      }

      const code = readCode(event);

      setPressedCodes((previous) => {
        if (!previous.has(code)) {
          return previous;
        }

        const next = new Set(previous);
        next.delete(code);
        return next;
      });
    };

    const clearPressed = () => {
      setPressedCodes((previous) => (previous.size === 0 ? previous : new Set()));
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        clearPressed();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", clearPressed);
    window.addEventListener("pagehide", clearPressed);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", clearPressed);
      window.removeEventListener("pagehide", clearPressed);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const reset = useCallback(() => {
    setPressedCodes(new Set());
    setTestedCodes(new Set());
    setHistory([]);
    setLastPress(null);
  }, []);

  const uniqueCount = useMemo(() => {
    let count = 0;

    for (const code of testedCodes) {
      if (knownCodes.has(code)) {
        count += 1;
      }
    }

    return count;
  }, [knownCodes, testedCodes]);

  const hasActivity =
    pressedCodes.size > 0 ||
    testedCodes.size > 0 ||
    history.length > 0 ||
    lastPress !== null;

  return {
    pressedCodes,
    testedCodes,
    history,
    lastPress,
    uniqueCount,
    hasActivity,
    reset,
  };
}
