import os
import requests

DEVIN_API_URL = os.getenv("DEVIN_API_URL")
DEVIN_API_KEY = os.getenv("DEVIN_API_KEY")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_REPO = os.getenv("GITHUB_REPO")

def list_issues():
    """
    Fetch open issues from the configured GitHub repository
    """
    headers = {"Authorization": f"token {GITHUB_TOKEN}"} if GITHUB_TOKEN else {}
    repo = GITHUB_REPO or "owner/repo"
    
    url = f"https://api.github.com/repos/{repo}/issues"
    response = requests.get(url, headers=headers, params={"state": "open"})
    
    if response.ok:
        return response.json()
    else:
        print(f"GitHub API error: {response.status_code} {response.text}")
        return []

def get_issue_by_number(issue_number):
    """
    Fetch a specific issue by its number
    """
    headers = {"Authorization": f"token {GITHUB_TOKEN}"} if GITHUB_TOKEN else {}
    repo = GITHUB_REPO or "owner/repo"
    
    url = f"https://api.github.com/repos/{repo}/issues/{issue_number}"
    response = requests.get(url, headers=headers)
    
    if response.ok:
        return response.json()
    else:
        print(f"GitHub API error: {response.status_code} {response.text}")
        return None

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
