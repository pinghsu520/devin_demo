import os
from dotenv import load_dotenv
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler
from github import list_issues, get_issue_by_number
from devin import devin_scope_issue, devin_execute_plan

load_dotenv()



app = App(token=os.getenv("SLACK_BOT_TOKEN"))

@app.event("app_mention")
def handle_mention(event, say):
    text = event.get("text", "").lower()
    print(f"Received mention: {text}")

    if "list issues" in text:
        issues = list_issues()
        if not issues:
            say("✅ No open issues.")
        else:
            msg = "*📝 Open GitHub Issues:*\n"
            for issue in issues:
                if "pull_request" not in issue:
                    msg += f"- #{issue['number']}: *{issue['title']}* (<{issue['html_url']}>)\n"
            say(msg)

    elif "scope" in text:
        parts = text.split()
        issue_number = next((p[1:] for p in parts if p.startswith("#")), None)
        if not issue_number:
            say("❗Please specify an issue like `scope #23`")
            return

        issue = get_issue_by_number(issue_number)
        if not issue:
            say("❌ Couldn't find that issue.")
            return

        say(f"🧠 Scoping issue #{issue_number}...")
        result, confidence = devin_scope_issue(issue['title'], issue.get('body', ''))
        if result.startswith("Error"):
            say(f"❌ {result}")
        else:
            confidence_emoji = "🟢" if confidence >= 0.7 else "🟡" if confidence >= 0.4 else "🔴"
            say(f"📋 Scope result (Confidence: {confidence:.1f} {confidence_emoji}):\n{result}")

    elif "complete" in text:
        parts = text.split()
        issue_number = next((p[1:] for p in parts if p.startswith("#")), None)
        if not issue_number:
            say("❗Please specify an issue like `complete #23`")
            return

        issue = get_issue_by_number(issue_number)
        if not issue:
            say("❌ Couldn't find that issue.")
            return

        # First scope the issue to get confidence
        result, confidence = devin_scope_issue(issue['title'], issue.get('body', ''))
        if result.startswith("Error"):
            say(f"❌ {result}")
            return
            
        # Check confidence level before proceeding
        if confidence < 0.4:
            say(f"⚠️ Confidence too low ({confidence:.1f} 🔴) to implement. Please review the issue and try again.")
            return
            
        say(f"🚀 Executing action plan for issue #{issue_number}...")
        result = devin_execute_plan(issue['title'], "Solve this issue based on the scope.")
        if result.startswith("Error"):
            say(f"❌ {result}")
        else:
            say(f"🛠️ Execution started:\n{result}")

    else:
        say("👋 Try commands like: `list issues`, `scope #<number>`, `complete #<number>`")

if __name__ == "__main__":
    print("⚡ Devin Slackbot is running!")
    handler = SocketModeHandler(app, os.getenv("SLACK_APP_TOKEN"))
    handler.start()
