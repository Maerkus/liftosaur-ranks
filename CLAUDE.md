# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Starting Development
```bash
npm start          # Frontend dev server
npm run start:server  # Backend dev server with hot reload
```

### Building
```bash
npm run build      # Production build
npm run build:dev  # Development build
npm run build:lambda  # Build Lambda functions
```

### Testing & Quality
```bash
npm test           # Run all tests
npm run onetest    # Run single test file
npm run playwright # Run Playwright E2E tests
npm run lint       # ESLint for TypeScript files
```

### AWS Lambda Development
```bash
npm run start:lambda  # Local Lambda API
npm run watch:lambda  # Watch & rebuild Lambda
```

### iOS/watchOS Development
```bash
# Build watch bundle (included in build:dev, deployed to server)
npm run build:dev

# Watch bundle is downloaded from https://www.liftosaur.com/watch-bundle.js
# by WatchCacheManager at runtime - no manual copy needed

# Build watch app (run from ./ios)
xcodebuild -workspace Liftosaur.xcworkspace -scheme "LiftosaurWatch" -destination 'platform=watchOS Simulator,id=6D3DDA86-DDC2-4D24-8908-21839A099D79' build
```

## Visual Verification with MCP Tools

For iOS, use the `test-app` skill. For Web (Playwright) and Android (mobile-mcp) workflows, see `.claude/docs/visual-verification.md`.

## Architecture Overview

Liftosaur is a PWA weightlifting tracker using a custom DSL called Liftoscript for defining workout programs.

### Tech Stack
- **Frontend**: Preact, TypeScript, Tailwind CSS, CodeMirror 6
- **State Management**: Custom Redux-like with lens-shmens for immutable updates
- **Backend**: AWS Lambda + DynamoDB + S3
- **Infrastructure**: AWS CDK

### Key Concepts

1. **Liftoscript**: Domain-specific language for workout programs
   - Text-based, markdown-like syntax with JavaScript-like scripting
   - Programs are immutable snapshots
   - See `/llms/liftoscript.md` for language reference

2. **State Management Pattern**:
   - Single global state in `src/models/state.ts`
   - Updates via lenses: `updateState(dispatch, lb<IState>().p('exercises').i(0).p('name').record('Bench Press'))`
   - State persisted to IndexedDB for offline support

3. **Program Model**:
   - Programs don't know about user equipment or settings
   - User settings (1RM, plates) applied on execution
   - Sharing creates immutable program links

### Project Structure & Important Files
See `.claude/docs/architecture.md` for the directory layout and key file list.

### Development Tips
- State updates must use lenses for immutability
- Programs are text (Liftoscript) as source of truth
- Keep bundle size minimal (current ~200kb total)
- Test Liftoscript changes thoroughly - it's the core of the app

For detailed Liftoscript documentation, see `/llms/liftoscript.md` and `/llms/liftoscript_examples.md`.

## Comments
NEVER add comments unless they explain WHY something non-obvious is done. Comments that describe WHAT the code does are forbidden - the code itself should be readable.

DO NOT add comments for:
- Function/method descriptions (use clear naming instead)
- Variable explanations
- Type annotations
- "What this does" explanations
- TODOs unless explicitly requested

The ONLY acceptable comments explain:
- Non-obvious business logic reasoning
- Workarounds for external bugs/limitations
- Safety-critical warnings

If you find yourself wanting to add a comment, first try to make the code clearer instead. Assume the reader knows the programming language.

BAD (describes what):
```typescript
// Check if user is subscribed
if (user.subscription?.active) {
```

GOOD (explains why):
```typescript
// Stripe webhook can be delayed, so we also check local cache
if (user.subscription?.active || cachedSubscription) {
```

## Git Commits

Do NOT add "Co-Authored-By: Claude ..." (or any other AI attribution) lines to commit messages.

## Knowledge Base

Project knowledge base lives in `lambda/scripts/memory/`. See `lambda/scripts/memory/INDEX.md` for a compact overview of all captured knowledge.

When you discover important architectural decisions, non-obvious bug root causes, new subsystems, or significant product features — use the `/kb` skill to capture them.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
