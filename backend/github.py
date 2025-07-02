import os
import requests

from dotenv import load_dotenv
load_dotenv()


GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_REPO = os.getenv("GITHUB_REPO")

def list_issues():
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json"
    }
    url = f"https://api.github.com/repos/{GITHUB_REPO}/issues"
    print(f"🔗 Calling GitHub API: {url}")
    response = requests.get(url, headers=headers)

    print(f"🔧 Status: {response.status_code}")
    if not response.ok:
        print(f"❌ GitHub error: {response.text}")
        return []

    data = response.json()
    print(f"📦 Raw response: {data[:1]}")  # Show 1 item only for readability
    print(f"📊 Total items: {len(data)}")

    issues = [item for item in data if "pull_request" not in item]
    print(f"✅ Issues (not PRs): {len(issues)}")

    return issues


def get_issue_by_number(issue_number):
    url = f"https://api.github.com/repos/{GITHUB_REPO}/issues/{issue_number}"
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json"
    }
    resp = requests.get(url, headers=headers)
    return resp.json() if resp.ok else None
