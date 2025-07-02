import os
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler
from dotenv import load_dotenv
from handlers import handle_list_issues, handle_scope_issue, handle_solve_issue

load_dotenv()

app = App(token=os.getenv("SLACK_BOT_TOKEN"))

@app.event("app_mention")
def handle_mention(event, say):
    text = event.get("text", "").lower()
    thread_ts = event.get("thread_ts") or event.get("ts")

    if "list issues" in text:
        say(text=handle_list_issues(), thread_ts=thread_ts)
    elif "scope #" in text:
        issue_number = text.split("#")[-1].strip()
        say(text=handle_scope_issue(issue_number), thread_ts=thread_ts)
    elif "solve #" in text:
        issue_number = text.split("#")[-1].strip()
        say(text="Starting to solve...", thread_ts=thread_ts)
        handle_solve_issue(issue_number, say, thread_ts)
    else:
        say(text="Hi! You can say: `list issues`, `scope #<issue>`, or `solve #<issue>`.", thread_ts=thread_ts)

if __name__ == "__main__":
    handler = SocketModeHandler(app, os.getenv("SLACK_APP_TOKEN"))
    handler.start()
