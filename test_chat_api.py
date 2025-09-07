import requests
import json

def test_chat_api():
    """Test the chat API endpoint and verify response structure"""
    url = "http://localhost:5001/api/chat"
    
    test_data = {
        "message": "How do you build settlements in Catan?",
        "provider": "anthropic"
    }
    
    try:
        response = requests.post(url, json=test_data, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Chat API Test: SUCCESS")
            print(f"Response keys: {list(data.keys())}")
            print(f"AI Response length: {len(data.get('response', ''))}")
            print(f"Rule sections found: {len(data.get('rule_sections', []))}")
            print(f"Screenshots generated: {len(data.get('screenshots', []))}")
            
            screenshots = data.get('screenshots', [])
            if screenshots:
                first_screenshot = screenshots[0]
                print(f"First screenshot page: {first_screenshot.get('page')}")
                print(f"First screenshot image size: {len(first_screenshot.get('image', ''))} chars")
            
            return True
        else:
            print(f"❌ Chat API Test: FAILED - Status {response.status_code}")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Chat API Test: FAILED - {e}")
        return False

if __name__ == "__main__":
    test_chat_api()
