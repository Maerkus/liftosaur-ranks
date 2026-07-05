# Graph Report - liftosaur-ranks  (2026-07-05)

## Corpus Check
- 1849 files · ~3,521,470 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 203 nodes · 242 edges · 21 communities (13 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5fe1af05`
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
- [[_COMMUNITY_SKILL|SKILL.md]]
- [[_COMMUNITY_Caveman Help|Caveman Help]]
- [[_COMMUNITY_Caveman Compress|Caveman Compress]]
- [[_COMMUNITY_SKILL|SKILL.md]]
- [[_COMMUNITY_caveman-commit|caveman-commit]]
- [[_COMMUNITY_caveman-review|caveman-review]]
- [[_COMMUNITY_caveman-stats|caveman-stats]]
- [[_COMMUNITY_benchmark.py|benchmark.py]]
- [[_COMMUNITY___init__.py|__init__.py]]
- [[_COMMUNITY_State Reducer & Diagnostics|State Reducer & Diagnostics]]
- [[_COMMUNITY_Liftoscript CodeMirror Editor|Liftoscript CodeMirror Editor]]
- [[_COMMUNITY_Record Page & Legal Docs|Record Page & Legal Docs]]
- [[_COMMUNITY_Liftoscript Documentation|Liftoscript Documentation]]
- [[_COMMUNITY_Licenses Page|Licenses Page]]

## God Nodes (most connected - your core abstractions)
1. `validate()` - 14 edges
2. `compress_file()` - 12 edges
3. `detect_file_type()` - 9 edges
4. `should_compress()` - 8 edges
5. `Caveman Compress` - 7 edges
6. `main()` - 7 edges
7. `Caveman Help` - 7 edges
8. `cavecrew` - 6 edges
9. `Snyk High Risk Rating` - 6 edges
10. `backup_dir_for()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Google Auth Callback Page` --semantically_similar_to--> `Google Auth Callback (Web variant)`  [INFERRED] [semantically similar]
  googleauthcallback.html → googleauthcallback-web.html
- `Health Connect Privacy Policy` --semantically_similar_to--> `Google Health Connect Integration (Privacy Notice section)`  [INFERRED] [semantically similar]
  healthconnectprivacypolicy.html → privacy.html
- `Example/Test Harness Page (ex.html)` --references--> `Web App Manifest (manifest.webmanifest)`  [EXTRACTED]
  ex.html → index.html
- `Liftosaur Terms of Use` --references--> `Liftosaur Privacy Notice`  [EXTRACTED]
  terms.html → privacy.html
- `benchmark_pair()` --calls--> `validate()`  [EXTRACTED]
  .agents/skills/caveman-compress/scripts/benchmark.py → .agents/skills/caveman-compress/scripts/validate.py

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Liftosaur Legal & Policy Document Set** — terms, privacy, healthconnectprivacypolicy, licenses [INFERRED 0.80]

## Communities (21 total, 8 thin omitted)

### Community 0 - "Account & Equipment Settings UI"
Cohesion: 0.09
Nodes (21): Android Emulator (mobile-mcp), Architecture Overview, AWS Lambda Development, Building, Comments, Development Commands, Development Tips, Git Commits (+13 more)

### Community 1 - "App Navigation & Program Preview"
Cohesion: 0.12
Nodes (27): main(), print_usage(), backup_dir_for(), build_compress_prompt(), build_fix_prompt(), call_claude(), compress_file(), is_sensitive_path() (+19 more)

### Community 2 - "Core Type Definitions"
Cohesion: 0.09
Nodes (20): Before / After, Benchmarks, How It Work, <img src="../../docs/assets/dancing-rock.svg" width="20" height="20" alt="rock"/> Caveman (285 tokens), Install, 📄 Original (706 tokens), Part of Caveman, Security (+12 more)

### Community 3 - "Equipment Setup & Program Preview"
Cohesion: 0.20
Nodes (17): count_bullets(), extract_code_blocks(), extract_headings(), extract_inline_codes(), extract_paths(), extract_urls(), Path, Line-based fenced code block extractor.      Handles ``` and ~~~ fences with var (+9 more)

### Community 7 - "SKILL.md"
Cohesion: 0.14
Nodes (12): cavecrew, Example chaining, How to invoke, Model overrides, See also, What it does, Auto-clarity (inherited), Chaining patterns (+4 more)

### Community 8 - "Caveman Help"
Cohesion: 0.14
Nodes (12): caveman-help, Example output, How to invoke, See also, What it does, Caveman Help, Configure Default Mode, Deactivate (+4 more)

### Community 9 - "Caveman Compress"
Cohesion: 0.17
Nodes (11): Boundaries, Caveman Compress, Compress, Compression Rules, Pattern, Preserve EXACTLY (never modify), Preserve Structure, Process (+3 more)

### Community 10 - "SKILL.md"
Cohesion: 0.17
Nodes (10): caveman, Example output, How to invoke, See also, What it does, Auto-Clarity, Boundaries, Intensity (+2 more)

### Community 11 - "caveman-commit"
Cohesion: 0.18
Nodes (9): caveman-commit, Example output, How to invoke, See also, What it does, Auto-Clarity, Boundaries, Examples (+1 more)

### Community 12 - "caveman-review"
Cohesion: 0.18
Nodes (9): caveman-review, Example output, How to invoke, See also, What it does, Auto-Clarity, Boundaries, Examples (+1 more)

### Community 13 - "caveman-stats"
Cohesion: 0.29
Nodes (5): caveman-stats, Example output, How to invoke, See also, What it does

### Community 14 - "benchmark.py"
Cohesion: 0.60
Nodes (5): benchmark_pair(), count_tokens(), main(), print_table(), Path

### Community 74 - "Record Page & Legal Docs"
Cohesion: 0.29
Nodes (7): Health Connect Privacy Policy, Liftosaur Privacy Notice, Global Privacy Control (GPC) Compliance, Google Health Connect Integration (Privacy Notice section), Liftosaur Terms of Use, Binding Arbitration Agreement, Health Disclaimer

## Knowledge Gaps
- **107 isolated node(s):** `What it does`, `How to invoke`, `Example chaining`, `Model overrides`, `See also` (+102 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `validate()` connect `Equipment Setup & Program Preview` to `App Navigation & Program Preview`, `benchmark.py`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `compress_file()` connect `App Navigation & Program Preview` to `Equipment Setup & Program Preview`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `What it does`, `How to invoke`, `Example chaining` to the rest of the system?**
  _119 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Account & Equipment Settings UI` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `App Navigation & Program Preview` be split into smaller, more focused modules?**
  _Cohesion score 0.12258064516129032 - nodes in this community are weakly interconnected._
- **Should `Core Type Definitions` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `SKILL.md` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._