import os
import requests

DEVIN_API_URL = os.getenv("DEVIN_API_URL")
DEVIN_API_KEY = os.getenv("DEVIN_API_KEY")

def devin_scope_issue(issue_title, issue_body):
    prompt = f"""You are an AI engineer assistant. Analyze the following GitHub issue and return:
- Problem summary
- Suggested solution
- Estimated confidence (0-100%)

Title: {issue_title}
Description: {issue_body}
"""
    return call_devin_api(prompt)

def devin_execute_plan(issue_title, plan):
    prompt = f"""You are an AI engineer. The following GitHub issue was scoped and the plan is to:
{plan}

Begin implementing the solution.

Title: {issue_title}
"""
    return call_devin_api(prompt)

def call_devin_api(prompt):
    headers = {
        "Authorization": f"Bearer {DEVIN_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "prompt": prompt,
        "max_tokens": 300,
        "temperature": 0.3
    }
    resp = requests.post(f"{DEVIN_API_URL}/completions", json=payload, headers=headers)
    if resp.ok:
        return resp.json().get("choices", [{}])[0].get("text", "No response.")
    return f"Error from Devin API: {resp.status_code} {resp.text}"
