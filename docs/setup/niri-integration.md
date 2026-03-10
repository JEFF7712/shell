# Niri integration

Amber Shell exposes an `ipc` entrypoint so Niri keybindings can dispatch
commands through the shared command bus. Right now the launcher module
publishes a toggle command (`call launcher toggle`), which is the binding
that most users want for a global hotkey.

The shell includes a helper, `recommendedNiriBinding()` in
`src/ipc/commands.js`, which emits the following snippet:

```
Mod+Space hotkey-overlay-title="App Launcher" {
    # call launcher toggle
    spawn "/home/rupan/projects/shell/bin/amber-shell" "ipc" "call" "launcher" "toggle";
}
```

Use that snippet as your baseline and expand it with extra modifiers or
window tracking if needed. Keep this file around so you always have a
text reference for configuring Niri with the `call launcher toggle`
command.
