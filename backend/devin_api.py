import os
import requests
from github_api import get_issue_by_number

DEVIN_API_KEY = os.getenv("DEVIN_API_KEY")
DEVIN_API_URL = os.getenv("DEVIN_API_URL", "https://api.devin.ai/v1")

HEADERS = {
    "Authorization": f"Bearer {DEVIN_API_KEY}",
    "Content-Type": "application/json"
}

def load_prompt(template_path, issue):
    with open(template_path) as f:
        prompt_template = f.read()
    prompt = prompt_template.replace("{{ISSUE_TITLE}}", issue['title'])
    prompt = prompt.replace("{{ISSUE_BODY}}", issue['body'])
    return prompt

def call_devin_api(prompt):
    payload = {
        "prompt": prompt,
        "max_tokens": 500,
        "temperature": 0.3
    }
    response = requests.post(f"{DEVIN_API_URL}/completions", headers=HEADERS, json=payload)
    response.raise_for_status()
    data = response.json()
    return data['choices'][0]['text'].strip()

def get_scope_prompt_response(issue_number):
    issue = get_issue_by_number(issue_number)
    if not issue:
        return "Issue not found."

    prompt = load_prompt("prompts/scope_prompt.txt", issue)
    devin_response = call_devin_api(prompt)
    return f"*Devin's Response for Issue #{issue_number}:*\n{devin_response}"

def get_solve_plan_text(issue_number):
    issue = get_issue_by_number(issue_number)
    if not issue:
        return ["Issue not found."]

    prompt = load_prompt("prompts/solve_prompt.txt", issue)
    devin_response = call_devin_api(prompt)
    steps = [line.strip() for line in devin_response.split('\n') if line.strip()]
    return steps
