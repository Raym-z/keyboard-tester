# Key Tester

A fast, client-side keyboard tester built with Next.js, TypeScript, and Tailwind CSS. Press any physical key and see it highlighted on a full-size ANSI keyboard, with live key stats and press history.

## Features

- Full-size ANSI (104-key) virtual keyboard, including the function row, navigation cluster, arrow keys, and numeric keypad.
- Windows and Mac layout switch, with Ctrl/Win/Alt and Control/Option/Command/Fn labels.
- Real-time highlighting for pressed keys using `KeyboardEvent.code`.
- Simultaneous key presses, modifier combinations, and release-order handling.
- Clear pressed-key state when the window loses focus or the page is hidden.
- Ignored repeat events so holding a key does not create duplicate history entries.
- Stats for unique keys tested, currently held keys, last key code, and recent press history.
- Reset button that clears highlights, counters, last key, and history.
- Responsive layout: the keyboard scales on tablets and scrolls horizontally on phones.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

```bash
npm run dev        # start the development server
npm run lint       # run ESLint
npm run typecheck  # run TypeScript without emitting
npm run build      # production build
npm run start      # serve the production build
```

## Project Structure

- `src/app/page.tsx` — page shell, header, limitations note, and footer.
- `src/app/globals.css` — Tailwind import, page theme, and virtual keyboard styles.
- `src/components/KeyboardTester.tsx` — client entry point, toolbar, and reset button.
- `src/components/Keyboard.tsx` — renders the virtual keyboard.
- `src/components/KeyboardKey.tsx` — reusable keycap component.
- `src/components/StatsPanel.tsx` — unique, pressed, last key, and history stats.
- `src/hooks/useKeyboardTest.ts` — keyboard event listeners and test state.
- `src/lib/keyboard-layout.ts` — Windows/Mac ANSI key definitions and grid geometry.

## Keyboard Notes and Limitations

Keys are matched by physical position using `event.code`, so the tester works across most keyboard layouts.

- Function keys F1–F12 are captured so they do not trigger browser actions such as Find or Reload. A few may still be handled at the browser/OS level.
- Browser- and OS-reserved shortcuts (for example Ctrl+W, Ctrl+T, Cmd+Tab, Alt+F4, and Print Screen) may be handled before the page can see them. Ctrl/Cmd/Alt shortcuts are deliberately not swallowed so normal browser behavior keeps working.
- Keys routed through an Fn layer may not report to the browser at all; on Mac this can include the Fn key itself.
- Menu and ContextMenu are Windows-only; the Mac layout replaces that key with Fn.
- Software keyboards that do not send an `event.code` may update the stats without highlighting a key.
- Non-ANSI keys such as `IntlBackslash` are not shown on the visual layout, though their code still appears in the stats/history.

All keyboard input is processed in the browser. There is no backend, storage, analytics, or external service.

## Deploying

This is a static client-side app and can be deployed directly to Vercel. No environment variables, database, or server configuration are required.
