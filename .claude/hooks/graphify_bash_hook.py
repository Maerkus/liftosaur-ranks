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
    cmd = str(tool_input.get("command", ""))
    triggers = ("grep", "rg ", "ripgrep", "find ", "fd ", "ack ", "ag ")
    if not any(t in cmd for t in triggers):
        return

    if not os.path.exists("graphify-out/graph.json"):
        return

    open(marker, "w").close()
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "additionalContext": (
                "MANDATORY: graphify-out/graph.json exists. You MUST run "
                "`graphify query \"<question>\"` before grepping raw files. Only grep after "
                "graphify has oriented you, or to modify/debug specific lines. "
                "(This reminder fires once per session.)"
            ),
        }
    }))


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
