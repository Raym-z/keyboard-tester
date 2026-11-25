import { KeyboardTester } from "@/components/KeyboardTester";

function KeyboardMark() {
  return (
    <div className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-blue-600 shadow-[0_8px_20px_-12px_rgba(15,23,42,0.45)]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
        <path d="M6 10h.01M9 10h.01M12 10h.01M15 10h.01M18 10h.01M6.5 13h.01M10 13h.01M13.5 13h.01M17 13h.01M8 16h8" />
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto w-full max-w-2xl px-6 pb-8 pt-12 text-center sm:pt-16">
        <div className="mb-5 flex justify-center">
          <KeyboardMark />
        </div>
        <h1 className="text-4xl font-semibold tracking-[-0.035em] text-slate-900 sm:text-5xl">
          Key Tester
        </h1>
        <p className="mt-3 text-[15px] text-slate-500 sm:text-base">
          Test your keyboard keys instantly.
        </p>
      </header>

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-3 pb-12 sm:px-6">
        <KeyboardTester />

        <aside className="mx-auto mt-5 max-w-3xl rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-3 text-left text-[11px] leading-relaxed text-slate-500">
          <p>
            <span className="font-medium text-slate-600">Good to know:</span>{" "}
            keys are matched by physical position using{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px] text-slate-600">
              event.code
            </code>
            , so the tester works across most keyboard layouts. F1–F12 and
            navigation keys are captured so they do not trigger browser actions
            here. Browser- and OS-reserved shortcuts (such as Ctrl+W, Ctrl+T,
            Cmd+Tab, Alt+F4, and Print Screen) may still be handled before the
            page can see them, and keys routed through an Fn layer may not
            report at all. Software keyboards
            that do not send an <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px] text-slate-600">event.code</code>{" "}
            may update the stats without highlighting a key. Non-ANSI keys are
            not shown on this layout.
          </p>
        </aside>
      </main>

      <footer className="border-t border-slate-200/70 bg-white/50 px-6 py-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 text-center text-[11px] text-slate-500 sm:flex-row sm:text-left">
          <p>
            All keyboard input is processed in your browser. Nothing is stored
            or sent to a server.
          </p>
          <p className="text-slate-400">Full-size ANSI · 104 keys</p>
        </div>
      </footer>
    </div>
  );
}
