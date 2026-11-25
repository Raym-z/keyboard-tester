"use client";

import { useState, type MouseEvent } from "react";

import { Keyboard } from "@/components/Keyboard";
import { StatsPanel } from "@/components/StatsPanel";
import { useKeyboardTest } from "@/hooks/useKeyboardTest";
import { getKeyboardLayout, type Platform } from "@/lib/keyboard-layout";

const PLATFORM_OPTIONS: Array<{ value: Platform; label: string }> = [
  { value: "windows", label: "Windows" },
  { value: "mac", label: "Mac" },
];

function ResetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

export function KeyboardTester() {
  const [platform, setPlatform] = useState<Platform>("windows");
  const layout = getKeyboardLayout(platform);

  const {
    pressedCodes,
    testedCodes,
    history,
    lastPress,
    uniqueCount,
    hasActivity,
    reset,
  } = useKeyboardTest(layout.codes);

  const pressedCount = pressedCodes.size;
  const status =
    pressedCount > 0
      ? `${pressedCount} key${pressedCount === 1 ? "" : "s"} held`
      : uniqueCount > 0
        ? "Ready for the next key"
        : "Listening for key presses";
  const hint =
    pressedCount > 0
      ? "Release a key to clear its highlight."
      : "Press any key on your physical keyboard.";

  const handleReset = (event: MouseEvent<HTMLButtonElement>) => {
    reset();
    event.currentTarget.blur();
  };

  const handlePlatformChange = (
    nextPlatform: Platform,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    if (nextPlatform !== platform) {
      reset();
      setPlatform(nextPlatform);
    }

    event.currentTarget.blur();
  };

  return (
    <section
      aria-labelledby="keyboard-tester-title"
      className="rounded-[26px] border border-slate-200/80 bg-white/80 p-3 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:p-5"
    >
      <h2 id="keyboard-tester-title" className="sr-only">
        Keyboard test
      </h2>

      <div className="flex flex-col gap-3 px-1 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-20 ${
                pressedCount > 0 ? "bg-blue-500" : "bg-emerald-500"
              }`}
            />
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                pressedCount > 0 ? "bg-blue-500" : "bg-emerald-500"
              }`}
            />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-800">
              {status}
            </p>
            <p className="truncate text-[11px] text-slate-400">{hint}</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="Keyboard layout"
            className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-slate-100/80 p-0.5"
          >
            {PLATFORM_OPTIONS.map((option) => {
              const isActive = platform === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={(event) =>
                    handlePlatformChange(option.value, event)
                  }
                  className={`inline-flex h-8 items-center rounded-[7px] px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                    isActive
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={handleReset}
            disabled={!hasActivity}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ResetIcon />
            Reset
          </button>
        </div>
      </div>

      <Keyboard
        layout={layout}
        pressedCodes={pressedCodes}
        testedCodes={testedCodes}
      />

      <StatsPanel
        keyByCode={layout.keyByCode}
        totalKeys={layout.keys.length}
        pressedCodes={pressedCodes}
        history={history}
        lastPress={lastPress}
        uniqueCount={uniqueCount}
      />
    </section>
  );
}
