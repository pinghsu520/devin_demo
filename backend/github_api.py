import os
import requests

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_REPO = os.getenv("GITHUB_REPO")  # format: owner/repo

HEADERS = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

def get_issues():
    url = f"https://api.github.com/repos/{GITHUB_REPO}/issues"
    params = {
        "state": "open",
        "per_page": 10
    }
    response = requests.get(url, headers=HEADERS, params=params)
    response.raise_for_status()
    issues = response.json()

    # Filter out pull requests
    pure_issues = [i for i in issues if 'pull_request' not in i]

    return [{
        "number": issue["number"],
        "title": issue["title"],
        "body": issue.get("body", "")
    } for issue in pure_issues]

def get_issue_by_number(issue_number):
    issues = get_issues()
    return next((i for i in issues if str(i["number"]) == str(issue_number)), None)
