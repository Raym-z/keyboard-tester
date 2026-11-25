import type { PressInfo } from "@/hooks/useKeyboardTest";
import type { KeyLayout } from "@/lib/keyboard-layout";

interface StatsPanelProps {
  keyByCode: ReadonlyMap<string, KeyLayout>;
  totalKeys: number;
  pressedCodes: ReadonlySet<string>;
  history: PressInfo[];
  lastPress: PressInfo | null;
  uniqueCount: number;
}

function sideLabel(
  code: string,
  keyByCode: ReadonlyMap<string, KeyLayout>,
): string {
  const definition = keyByCode.get(code);

  if (!definition) {
    return code;
  }

  if (code.startsWith("Numpad")) {
    return `Num ${definition.label}`;
  }

  const isSideKey =
    definition.label === "Shift" ||
    definition.label === "Ctrl" ||
    definition.label === "Alt" ||
    definition.label === "Win" ||
    definition.label === "Cmd" ||
    definition.label === "Option";

  if (!isSideKey) {
    return definition.label;
  }

  if (code.endsWith("Left")) {
    return `${definition.label} L`;
  }

  if (code.endsWith("Right")) {
    return `${definition.label} R`;
  }

  return definition.label;
}

function readableKeyValue(value: string): string {
  if (value === " ") {
    return "Space";
  }

  return value || "—";
}

function StatCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3.5">
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        {title}
      </h3>
      <div className="mt-2 min-h-[52px]">{children}</div>
    </div>
  );
}

export function StatsPanel({
  keyByCode,
  totalKeys,
  pressedCodes,
  history,
  lastPress,
  uniqueCount,
}: StatsPanelProps) {
  const pressed = Array.from(pressedCodes);
  const progress = Math.min(100, Math.round((uniqueCount / totalKeys) * 100));
  const lastLabel = lastPress
    ? (keyByCode.get(lastPress.code)?.label ?? lastPress.code)
    : null;
  const lastKeyValue = lastPress ? readableKeyValue(lastPress.key) : null;

  return (
    <section aria-label="Test results" className="mt-3">
      <div className="grid gap-2.5 sm:grid-cols-3">
        <StatCard title="Unique keys">
          <div className="flex items-end gap-1.5">
            <span className="text-[28px] font-semibold leading-none tracking-tight text-slate-900 tabular-nums">
              {uniqueCount}
            </span>
            <span className="mb-0.5 text-xs text-slate-400">
              of {totalKeys}
            </span>
          </div>
          <div
            className="mt-2.5 h-1 overflow-hidden rounded-full bg-slate-200/80"
            role="progressbar"
            aria-label="Standard ANSI keys tested"
            aria-valuemin={0}
            aria-valuemax={totalKeys}
            aria-valuenow={uniqueCount}
          >
            <div
              className="h-full rounded-full bg-blue-500 transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </StatCard>

        <StatCard title="Currently pressed">
          {pressed.length > 0 ? (
            <div className="flex max-h-[64px] flex-wrap gap-1.5 overflow-y-auto pr-1">
              {pressed.map((code) => (
                <kbd
                  key={code}
                  title={code}
                  className="rounded-md bg-blue-600 px-2 py-1 text-[11px] font-semibold text-white shadow-sm"
                >
                  {sideLabel(code, keyByCode)}
                </kbd>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No keys held</p>
          )}
        </StatCard>

        <StatCard title="Last pressed">
          {lastPress && lastLabel ? (
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-sm font-semibold text-slate-800 shadow-sm">
                {lastLabel}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-mono text-xs font-medium text-slate-700">
                  {lastPress.code}
                </span>
                <span className="block truncate text-[11px] text-slate-400">
                  key: {lastKeyValue}
                </span>
              </span>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Waiting for input</p>
          )}
        </StatCard>
      </div>

      <div className="mt-2.5 rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3.5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Press history
          </h3>
          <span className="text-[11px] text-slate-400">
            {history.length > 0 ? "Newest first · last 12" : "No keys yet"}
          </span>
        </div>
        {history.length > 0 ? (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {history.map((press) => (
              <kbd
                key={press.id}
                title={`${press.code} (event.key: ${readableKeyValue(press.key)})`}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 font-mono text-[11px] text-slate-600 shadow-sm"
              >
                {sideLabel(press.code, keyByCode)}
              </kbd>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-400">
            Press a few keys to build a history.
          </p>
        )}
      </div>
    </section>
  );
}
