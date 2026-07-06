import json
import os
import sys


def main():
    data = json.load(sys.stdin)
    session_id = data.get("session_id", "nosession")
    marker = f"/tmp/.graphify-nudge-{session_id}"
    if os.path.exists(marker):
        return

    tool_input = data.get("tool_input", data)
    exts = (
        ".py", ".js", ".ts", ".tsx", ".jsx", ".astro", ".vue", ".svelte",
        ".go", ".rs", ".java", ".rb", ".c", ".h", ".cpp", ".hpp", ".cc",
        ".cs", ".kt", ".swift", ".php", ".scala", ".lua", ".sh", ".md",
        ".rst", ".txt", ".mdx",
    )
    vals = [
        str(tool_input.get("file_path") or ""),
        str(tool_input.get("pattern") or ""),
        str(tool_input.get("path") or ""),
    ]
    joined = " ".join(vals).lower().replace("\\", "/")
    if "graphify-out/" in joined:
        return

    tails = []
    for v in vals:
        if not v:
            continue
        name = v.lower().replace("\\", "/").rsplit("/", 1)[-1]
        if "." in name:
            tails.append("." + name.rsplit(".", 1)[-1])
    if not any(tail in exts for tail in tails):
        return

    if not os.path.exists("graphify-out/graph.json"):
        return

    open(marker, "w").close()
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "additionalContext": (
                "MANDATORY: graphify-out/graph.json exists. You MUST run graphify before "
                "reading source files. Use: `graphify query \"<question>\"` (scoped subgraph), "
                "`graphify explain \"<concept>\"`, or `graphify path \"<A>\" \"<B>\"`. Only read "
                "raw files after graphify has oriented you, or to modify/debug specific lines. "
                "This rule applies to subagents too — include it in every subagent prompt "
                "involving code exploration. (This reminder fires once per session.)"
            ),
        }
    }))


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
