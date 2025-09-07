import os
import logging
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests
import PyPDF2
from pdf2image import convert_from_path
from PIL import Image
import io
import base64
import re
from typing import Dict, List, Tuple, Optional

load_dotenv()

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
GROK_API_KEY = os.getenv("XAI_API_KEY")
PDF_PATH = "catan_base_rules.pdf"

class PDFProcessor:
    def __init__(self, pdf_path: str):
        self.pdf_path = pdf_path
        self.pages_text = []
        self.pages_images = []
        self._load_pdf()
    
    def _load_pdf(self):
        try:
            with open(self.pdf_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                for page in reader.pages:
                    text = page.extract_text()
                    self.pages_text.append(text)
            
            self.pages_images = convert_from_path(self.pdf_path, dpi=200)
            logger.info(f"Loaded PDF with {len(self.pages_text)} pages")
        except Exception as e:
            logger.error(f"Error loading PDF: {e}")
    
    def search_rule_sections(self, query: str, ai_service) -> List[Dict]:
        relevant_pages = ai_service.find_relevant_sections(query, self.pages_text)
        
        results = []
        for page_info in relevant_pages:
            page_num = page_info['page']
            if 1 <= page_num <= len(self.pages_text):
                results.append({
                    'page': page_num,
                    'text': self.pages_text[page_num - 1][:500],
                    'score': page_info['relevance_score'],
                    'reasoning': page_info.get('reasoning', '')
                })
        
        return results[:3]
    
    def get_page_screenshot(self, page_num: int) -> Optional[str]:
        try:
            if 0 <= page_num - 1 < len(self.pages_images):
                img = self.pages_images[page_num - 1]
                buffer = io.BytesIO()
                img.save(buffer, format='PNG')
                img_str = base64.b64encode(buffer.getvalue()).decode()
                return img_str
            return None
        except Exception as e:
            logger.error(f"Error creating screenshot: {e}")
            return None

class AIService:
    def __init__(self):
        self.anthropic_key = ANTHROPIC_API_KEY
        self.grok_key = GROK_API_KEY
    
    def get_anthropic_response(self, question: str) -> str:
        if not self.anthropic_key:
            return "Anthropic API key not configured"
        
        try:
            headers = {
                "Content-Type": "application/json",
                "x-api-key": self.anthropic_key,
                "anthropic-version": "2023-06-01"
            }
            
            payload = {
                "model": "claude-3-haiku-20240307",
                "max_tokens": 1000,
                "messages": [
                    {
                        "role": "user",
                        "content": f"You are a Catan board game expert. Answer this question about Catan rules clearly and concisely: {question}"
                    }
                ]
            }
            
            response = requests.post(
                "https://api.anthropic.com/v1/messages",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.ok:
                data = response.json()
                return data.get("content", [{}])[0].get("text", "No response")
            else:
                logger.error(f"Anthropic API error: {response.status_code} {response.text}")
                return f"API Error: {response.status_code}"
                
        except Exception as e:
            logger.error(f"Error calling Anthropic API: {e}")
            return f"Error: {str(e)}"
    
    def get_grok_response(self, question: str) -> str:
        if not self.grok_key:
            return "Grok API key not configured"
        
        try:
            headers = {
                "Authorization": f"Bearer {self.grok_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a Catan board game expert. Answer questions about Catan rules clearly and concisely."
                    },
                    {
                        "role": "user",
                        "content": question
                    }
                ],
                "model": "grok-beta",
                "stream": False,
                "temperature": 0.7
            }
            
            response = requests.post(
                "https://api.x.ai/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.ok:
                data = response.json()
                return data.get("choices", [{}])[0].get("message", {}).get("content", "No response")
            else:
                logger.error(f"Grok API error: {response.status_code} {response.text}")
                return f"API Error: {response.status_code}"
                
        except Exception as e:
            logger.error(f"Error calling Grok API: {e}")
            return f"Error: {str(e)}"
    
    def find_relevant_sections(self, question: str, pages_text: List[str]) -> List[Dict]:
        if not self.anthropic_key:
            logger.warning("Anthropic API key not configured, falling back to keyword search")
            return self._fallback_keyword_search(question, pages_text)
        
        try:
            pdf_content = ""
            for i, text in enumerate(pages_text):
                pdf_content += f"\n--- PAGE {i+1} ---\n{text}\n"
            
            headers = {
                "Content-Type": "application/json",
                "x-api-key": self.anthropic_key,
                "anthropic-version": "2023-06-01"
            }
            
            prompt = f"""You are a Catan board game expert. I have a PDF of Catan rules with {len(pages_text)} pages. 

User question: "{question}"

PDF Content:
{pdf_content[:8000]}

Please analyze which pages contain the most relevant information to answer the user's question. Return your response as a JSON array with the top 3 most relevant pages, each containing:
- "page": page number (1-{len(pages_text)})
- "relevance_score": score from 1-10 (10 being most relevant)
- "reasoning": brief explanation of why this page is relevant

Example format:
[
  {{"page": 2, "relevance_score": 9, "reasoning": "Contains settlement building rules"}},
  {{"page": 5, "relevance_score": 7, "reasoning": "Shows settlement placement examples"}}
]

Only return the JSON array, no other text."""
            
            payload = {
                "model": "claude-3-haiku-20240307",
                "max_tokens": 1000,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            }
            
            response = requests.post(
                "https://api.anthropic.com/v1/messages",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.ok:
                data = response.json()
                content = data.get("content", [{}])[0].get("text", "")
                
                try:
                    relevant_pages = json.loads(content)
                    if isinstance(relevant_pages, list):
                        return relevant_pages
                except json.JSONDecodeError:
                    logger.error("Failed to parse AI response as JSON")
                
            logger.error(f"AI section analysis failed, falling back to keyword search")
            return self._fallback_keyword_search(question, pages_text)
                
        except Exception as e:
            logger.error(f"Error in AI section analysis: {e}")
            return self._fallback_keyword_search(question, pages_text)
    
    def _fallback_keyword_search(self, query: str, pages_text: List[str]) -> List[Dict]:
        results = []
        query_lower = query.lower()
        
        for page_num, text in enumerate(pages_text):
            text_lower = text.lower()
            if any(keyword in text_lower for keyword in query_lower.split()):
                score = sum(1 for keyword in query_lower.split() if keyword in text_lower)
                results.append({
                    'page': page_num + 1,
                    'relevance_score': score,
                    'reasoning': f"Contains {score} matching keywords"
                })
        
        return sorted(results, key=lambda x: x['relevance_score'], reverse=True)[:3]

pdf_processor = PDFProcessor(PDF_PATH)
ai_service = AIService()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "Catan Rules Chat API"})

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        question = data.get('message', '')
        ai_provider = data.get('provider', 'anthropic')
        
        if not question:
            return jsonify({"error": "Message is required"}), 400
        
        if ai_provider == 'grok':
            ai_response = ai_service.get_grok_response(question)
        else:
            ai_response = ai_service.get_anthropic_response(question)
        
        rule_sections = pdf_processor.search_rule_sections(question, ai_service)
        
        screenshots = []
        for section in rule_sections:
            screenshot = pdf_processor.get_page_screenshot(section['page'])
            if screenshot:
                screenshots.append({
                    'page': section['page'],
                    'image': screenshot,
                    'relevance_score': section['score']
                })
        
        return jsonify({
            "response": ai_response,
            "rule_sections": rule_sections,
            "screenshots": screenshots,
            "provider": ai_provider
        })
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/rules/search', methods=['GET'])
def search_rules():
    try:
        query = request.args.get('q', '')
        if not query:
            return jsonify({"error": "Query parameter 'q' is required"}), 400
        
        sections = pdf_processor.search_rule_sections(query, ai_service)
        return jsonify({"sections": sections})
        
    except Exception as e:
        logger.error(f"Error in search endpoint: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/rules/page/<int:page_num>', methods=['GET'])
def get_page_screenshot(page_num):
    try:
        screenshot = pdf_processor.get_page_screenshot(page_num)
        if screenshot:
            return jsonify({"page": page_num, "image": screenshot})
        else:
            return jsonify({"error": "Page not found"}), 404
            
    except Exception as e:
        logger.error(f"Error getting page screenshot: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
