# Visual Verification with MCP Tools

Claude Code has MCP tools configured for visual verification on web, iOS, and Android. Use these to verify UI changes after code modifications.

For iOS, prefer the `test-app` skill (`.claude/skills/test-app/SKILL.md`) — it covers the same `ios-simulator-mcp` workflow in more depth, plus live Redux state inspection and gotchas. The summary below is kept for Web and Android, which the skill doesn't cover.

## Web (Playwright MCP)
```
# Navigate and interact with the web app
mcp__playwright__browser_navigate - Open a URL
mcp__playwright__browser_snapshot  - Get page structure (accessibility tree)
mcp__playwright__browser_click     - Click elements by ref
mcp__playwright__browser_type      - Type into inputs
mcp__playwright__browser_take_screenshot - Capture visual state
```

**Workflow:**
First, figure out the host - use the prefix values from `localdomain.js` file, and then combine them with the liftosaur.com. E.g.
if main: "local", then the host is "local.liftosaur.com". If main is "localai", then the host is "localai.liftosaur.com".

1. Ensure dev server is running (`npm start`)
2. Navigate to `https://{main}.liftosaur.com:8080/app`
3. Use `browser_snapshot` to see interactive elements with refs
4. Click/type using element refs from snapshot
5. Take screenshots to verify visual state

## iOS Simulator (ios-simulator-mcp — PREFERRED for iOS)

The app is bare React Native (Fabric/New Arch), so the simulator exposes a real
native accessibility tree. Use `ios-simulator-mcp` (idb-backed), NOT mobile-mcp —
it's faster, ~token-free vs screenshots, and our `testID`s come through as stable
`AXUniqueId` refs (e.g. `save-program-exercise`, `input-set-reps-field`, `footer-workout`).

```
mcp__ios-simulator__get_booted_sim_id  - Get the booted sim UUID
mcp__ios-simulator__ui_describe_all    - Full accessibility tree (elements + frames)
mcp__ios-simulator__ui_find_element    - Find by AXLabel or AXUniqueId (our testID)
mcp__ios-simulator__ui_tap             - Tap at x,y
mcp__ios-simulator__ui_type            - Type text
mcp__ios-simulator__ui_swipe           - Swipe/scroll
mcp__ios-simulator__ui_view            - Compressed screenshot (visual check only)
mcp__ios-simulator__launch_app         - Launch by bundle id (com.liftosaur.www)
```

**Workflow (target by testID, never pixel-guess):**
1. `get_booted_sim_id` to get the UUID
2. `ui_find_element(["<testID>"])` → read the returned `frame` (x, y, width, height)
3. `ui_tap` at the frame center; re-run `ui_describe_all` to confirm the tree updated
4. Use `ui_view`/`screenshot` only for visual/pixel verification

**Prereqs (already installed):** `idb-companion` (brew `facebook/fb` tap) + `fb-idb`
client on PATH (`~/.local/bin/idb`). Note: `fb-idb` breaks on Python ≥3.13
(`asyncio.get_event_loop` removed) — if reinstalling, pin it: `pipx install
--python python3.11 fb-idb`.

## Android Emulator (mobile-mcp)
```
# Start emulator
~/Library/Android/sdk/emulator/emulator -list-avds        # List available
~/Library/Android/sdk/emulator/emulator -avd <name> &     # Start emulator

# Same mobile-mcp tools work for Android
# App package: com.liftosaur.www.twa
```

**Workflow:**
1. Start emulator (command above)
2. List devices - Android shows as `emulator-5554`
3. Launch app with package `com.liftosaur.www.twa`
4. Take screenshots and interact via coordinates

## Notes
- The app is bare React Native (not a WebView wrapper). iOS exposes a real native
  accessibility tree via `ios-simulator-mcp` — prefer semantic `testID`/AXUniqueId
  targeting over screenshots + coordinates.
- Android has no idb-based server; keep using `mobile-mcp` (screenshot + coordinate
  taps, package `com.liftosaur.www.twa`) for Android.
- The embedded Liftoscript editor is still an inlined-HTML WebView — it shows as one
  opaque native node in the a11y tree; verify editor flows via Playwright-against-web.
- Web verification via Playwright provides richer element detection via snapshots.
