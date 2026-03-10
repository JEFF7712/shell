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
    spawn "amber-shell" "ipc" "call" "launcher" "toggle";
}

Mod+Shift+N hotkey-overlay-title="Notifications" {
    spawn "amber-shell" "ipc" "call" "notifications" "dismiss-all";
}
```
