# Amber Shell v1

A strict TypeScript shell scaffold with Vitest for smoke testing.

## IPC entrypoints

Amber Shell exposes a minimal `ipc` subcommand that Niri keybindings can call
to drive the shell modules via the shared command bus. The current set of
commands covers the launcher overlay and the notification stack:

- `call launcher toggle` toggles the launcher window.
- `call notifications dismiss-all` clears every visible notification banner.

Use the shell CLI and pass the tokens below from your Niri binding to keep
the wiring in sync:

```niri
Mod+Space hotkey-overlay-title="App Launcher" {
    # call launcher toggle
    spawn "amber-shell" "ipc" "call" "launcher" "toggle";
}

Mod+Shift+N hotkey-overlay-title="Notifications" {
    spawn "amber-shell" "ipc" "call" "notifications" "dismiss-all";
}
```

For a curated binding snippet that stays synchronized with the CLI, see
[docs/setup/niri-integration.md](docs/setup/niri-integration.md) or import
`recommendedNiriBinding()` from `src/ipc/commands.js`.

## Verification

- `scripts/verify.sh` is the final gate: it runs `pnpm typecheck`, the
  full Vitest suite, and `pnpm lint` when a lint script is configured.
- `tests/verification.test.ts` keeps the verification logic executable via
  `verifyCommands()` so tooling can assert the required checks are present.
