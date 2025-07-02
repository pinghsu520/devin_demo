import os
import requests
import time

from dotenv import load_dotenv
load_dotenv()


DEVIN_API_URL = "https://api.devin.ai/v1"
DEVIN_API_KEY = os.getenv("DEVIN_API_KEY")


def devin_scope_issue(issue_title, issue_body):
    prompt = f"""You are an AI engineer assistant. Analyze the following GitHub issue and return:
- Problem summary
- Suggested solution  
- Estimated confidence score (0.0 to 1.0)

Title: {issue_title}
Description: {issue_body}

Please provide a clear analysis with a confidence score for how well you understand the issue and can solve it."""
    
    session_id = create_devin_session(prompt)
    if not session_id:
        return "Error: Could not create Devin session", 0.0
    
    result = wait_for_session_completion(session_id)
    
    confidence_score = extract_confidence_score(result)
    
    return result, confidence_score

def extract_confidence_score(response_text):
    """Extract confidence score from Devin's response text"""
    import re
    
    if isinstance(response_text, str):
        patterns = [
            r'confidence\s*(?:score)?\s*:?\s*([0-1](?:\.\d+)?)',
            r'([0-1](?:\.\d+)?)\s*confidence',
            r'score\s*:?\s*([0-1](?:\.\d+)?)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, response_text.lower())
            if match:
                try:
                    score = float(match.group(1))
                    if 0.0 <= score <= 1.0:
                        return score
                except ValueError:
                    continue
    
    return 0.0

def devin_execute_plan(issue_title, plan):
    prompt = f"""You are an AI engineer. Execute the following plan for this GitHub issue:

Issue: {issue_title}
Plan: {plan}

Please implement the solution step by step."""
    
    session_id = create_devin_session(prompt)
    if not session_id:
        return "Error: Could not create Devin session"
    
    return wait_for_session_completion(session_id)

def create_devin_session(prompt):
    headers = {
        "Authorization": f"Bearer {DEVIN_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "prompt": prompt
    }
    
    try:
        resp = requests.post(f"{DEVIN_API_URL}/sessions", json=payload, headers=headers)
        if resp.ok:
            return resp.json().get("session_id")
        else:
            print(f"Error creating session: {resp.status_code} {resp.text}")
            return None
    except Exception as e:
        print(f"Exception creating session: {e}")
        return None

def wait_for_session_completion(session_id, max_wait_time=300):
    headers = {
        "Authorization": f"Bearer {DEVIN_API_KEY}",
        "Content-Type": "application/json"
    }
    
    start_time = time.time()
    while time.time() - start_time < max_wait_time:
        try:
            resp = requests.get(f"{DEVIN_API_URL}/session/{session_id}", headers=headers)
            if not resp.ok:
                return f"Error getting session details: {resp.status_code} {resp.text}"
            
            session_data = resp.json()
            status = session_data.get("status_enum", "unknown")
            
            if status == "finished":
                messages = session_data.get("messages", [])
                devin_messages = [msg for msg in messages if msg.get("type") == "devin_message"]
                if devin_messages:
                    return devin_messages[-1].get("message", "No response from Devin")
                return "Session completed but no response found"
            
            elif status in ["blocked", "expired"]:
                return f"Session {status}: Unable to complete task"
            
            time.sleep(10)
            
        except Exception as e:
            return f"Error polling session: {e}"
    
    return "Session exceeded maximum wait time"
