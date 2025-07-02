import time
from devin_api import get_scope_prompt_response, get_solve_plan_text
from github_api import get_issues

def handle_list_issues():
    issues = get_issues()
    if not issues:
        return "No open GitHub issues found."
    message = "*Here are the current open GitHub issues:*\n"
    for issue in issues:
        message += f"- #{issue['number']}: {issue['title']}\n"
    return message

def handle_scope_issue(issue_number):
    return get_scope_prompt_response(issue_number)

def handle_solve_issue(issue_number, say, thread_ts):
    plan = get_solve_plan_text(issue_number)
    for step in plan:
        time.sleep(2)
        say(text=f"🛠️ {step}", thread_ts=thread_ts)
    say(text=f"✅ Issue #{issue_number} solved! Pull request created.", thread_ts=thread_ts)
