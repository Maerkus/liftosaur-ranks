# Graph Report - liftosaur-ranks  (2026-07-05)

## Corpus Check
- 1826 files · ~3,512,858 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 40 nodes · 31 edges · 12 communities (5 shown, 7 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c4fe1ca0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Account & Equipment Settings UI|Account & Equipment Settings UI]]
- [[_COMMUNITY_App Navigation & Program Preview|App Navigation & Program Preview]]
- [[_COMMUNITY_Core Type Definitions|Core Type Definitions]]
- [[_COMMUNITY_Equipment Setup & Program Preview|Equipment Setup & Program Preview]]
- [[_COMMUNITY_App Bootstrap & Watch Bridge|App Bootstrap & Watch Bridge]]
- [[_COMMUNITY_Native Navigation Screens|Native Navigation Screens]]
- [[_COMMUNITY_Auth, Subscriptions & Admin Debug|Auth, Subscriptions & Admin Debug]]
- [[_COMMUNITY_State Reducer & Diagnostics|State Reducer & Diagnostics]]
- [[_COMMUNITY_Liftoscript CodeMirror Editor|Liftoscript CodeMirror Editor]]
- [[_COMMUNITY_Record Page & Legal Docs|Record Page & Legal Docs]]
- [[_COMMUNITY_Liftoscript Documentation|Liftoscript Documentation]]
- [[_COMMUNITY_Licenses Page|Licenses Page]]

## God Nodes (most connected - your core abstractions)
1. `Development Commands` - 6 edges
2. `Architecture Overview` - 6 edges
3. `Visual Verification with MCP Tools` - 5 edges
4. `Liftosaur Privacy Notice` - 3 edges
5. `Liftosaur Terms of Use` - 3 edges
6. `Google Health Connect Integration (Privacy Notice section)` - 2 edges
7. `Starting Development` - 1 edges
8. `Building` - 1 edges
9. `Testing & Quality` - 1 edges
10. `AWS Lambda Development` - 1 edges

## Surprising Connections (you probably didn't know these)
- `Google Auth Callback Page` --semantically_similar_to--> `Google Auth Callback (Web variant)`  [INFERRED] [semantically similar]
  googleauthcallback.html → googleauthcallback-web.html
- `Health Connect Privacy Policy` --semantically_similar_to--> `Google Health Connect Integration (Privacy Notice section)`  [INFERRED] [semantically similar]
  healthconnectprivacypolicy.html → privacy.html
- `Example/Test Harness Page (ex.html)` --references--> `Web App Manifest (manifest.webmanifest)`  [EXTRACTED]
  ex.html → index.html
- `Liftosaur Terms of Use` --references--> `Liftosaur Privacy Notice`  [EXTRACTED]
  terms.html → privacy.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Liftosaur Legal & Policy Document Set** — terms, privacy, healthconnectprivacypolicy, licenses [INFERRED 0.80]

## Communities (12 total, 7 thin omitted)

### Community 0 - "Account & Equipment Settings UI"
Cohesion: 0.33
Nodes (4): Comments, Git Commits, graphify, Knowledge Base

### Community 1 - "App Navigation & Program Preview"
Cohesion: 0.33
Nodes (6): Architecture Overview, Development Tips, Important Files, Key Concepts, Project Structure, Tech Stack

### Community 2 - "Core Type Definitions"
Cohesion: 0.33
Nodes (6): AWS Lambda Development, Building, Development Commands, iOS/watchOS Development, Starting Development, Testing & Quality

### Community 3 - "Equipment Setup & Program Preview"
Cohesion: 0.40
Nodes (5): Android Emulator (mobile-mcp), iOS Simulator (ios-simulator-mcp — PREFERRED for iOS), Notes, Visual Verification with MCP Tools, Web (Playwright MCP)

### Community 74 - "Record Page & Legal Docs"
Cohesion: 0.29
Nodes (7): Health Connect Privacy Policy, Liftosaur Privacy Notice, Global Privacy Control (GPC) Compliance, Google Health Connect Integration (Privacy Notice section), Liftosaur Terms of Use, Binding Arbitration Agreement, Health Disclaimer

## Knowledge Gaps
- **32 isolated node(s):** `Starting Development`, `Building`, `Testing & Quality`, `AWS Lambda Development`, `iOS/watchOS Development` (+27 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Development Commands` connect `Core Type Definitions` to `Account & Equipment Settings UI`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **Why does `Architecture Overview` connect `App Navigation & Program Preview` to `Account & Equipment Settings UI`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **Why does `Visual Verification with MCP Tools` connect `Equipment Setup & Program Preview` to `Account & Equipment Settings UI`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **What connects `Starting Development`, `Building`, `Testing & Quality` to the rest of the system?**
  _32 weakly-connected nodes found - possible documentation gaps or missing edges._