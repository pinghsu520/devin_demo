# Catan Rules Chat System

An AI-powered chat interface for Catan board game rules with PDF cross-referencing and screenshot functionality.

## Features

- **ChatGPT-like Interface**: Clean, modern chat UI built with React Native
- **AI-Powered Responses**: Uses Anthropic Claude (free tier) or Grok API for intelligent rule explanations
- **PDF Cross-Reference**: Automatically finds and displays relevant rule sections from official Catan PDF
- **Screenshot Extraction**: Shows exact rule pages with zoom/pan capabilities
- **Dual AI Support**: Switch between Claude and Grok AI providers
- **Docker Deployment**: Easy setup with Docker Compose

## Architecture

- **Frontend**: React Native with Expo (mobile-first, web-compatible)
- **Backend**: Flask API with PDF processing capabilities
- **AI Integration**: Anthropic Claude API (free tier) and Grok API support
- **PDF Processing**: PyPDF2 for text extraction, pdf2image for screenshots
- **Deployment**: Docker containers for both frontend and backend

## Quick Start

### Prerequisites

- Docker and Docker Compose
- API keys for Anthropic Claude or Grok (optional, will show error messages if not configured)

### Setup

1. **Clone and navigate to the project**:
   ```bash
   cd /path/to/devin_demo
   ```

2. **Configure environment variables**:
   ```bash
   cp game-rules-flask-backend/.env.example game-rules-flask-backend/.env
   # Edit .env file with your API keys
   ```

3. **Run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

4. **Access the application**:
   - Web interface: http://localhost:19006
   - API backend: http://localhost:5000
   - Health check: http://localhost:5000/api/health

### Manual Setup (Development)

#### Backend Setup

```bash
cd game-rules-flask-backend

# Install Python dependencies
pip install -r requirements.txt

# Install system dependencies (for PDF processing)
# Ubuntu/Debian:
sudo apt-get install poppler-utils

# macOS:
brew install poppler

# Set environment variables
export ANTHROPIC_API_KEY="your_key_here"
export XAI_API_KEY="your_grok_key_here"

# Run Flask backend
python app.py
```

#### Frontend Setup

```bash
cd game-rules-chat-app

# Install Node.js dependencies
npm install

# Install Expo CLI globally
npm install -g @expo/cli

# Start development server
npx expo start --web
```

## API Endpoints

### Chat Endpoint
```
POST /api/chat
Content-Type: application/json

{
  "message": "How do I build a settlement?",
  "provider": "anthropic"  // or "grok"
}
```

Response:
```json
{
  "response": "To build a settlement in Catan...",
  "rule_sections": [
    {
      "page": 5,
      "text": "Settlement building rules...",
      "score": 3
    }
  ],
  "screenshots": [
    {
      "page": 5,
      "image": "base64_encoded_image",
      "relevance_score": 3
    }
  ],
  "provider": "anthropic"
}
```

### Search Rules
```
GET /api/rules/search?q=settlement
```

### Get Page Screenshot
```
GET /api/rules/page/5
```

## Configuration

### Environment Variables

- `ANTHROPIC_API_KEY`: Your Anthropic Claude API key (free tier available)
- `XAI_API_KEY`: Your Grok API key

### AI Provider Selection

The app supports both Anthropic Claude and Grok:

- **Claude (Anthropic)**: Free tier available, good for general rule explanations
- **Grok**: Paid API, potentially more creative responses

Switch between providers using the toggle in the app header.

## PDF Processing

The system uses the official Catan base rules PDF (included in repository):
- **Text Extraction**: PyPDF2 extracts searchable text from each page
- **Screenshot Generation**: pdf2image converts pages to high-quality images
- **Relevance Scoring**: Keyword matching determines most relevant rule sections
- **Cross-Reference**: AI responses are automatically matched with PDF sections

## Development

### Adding New Game Rules

1. Add PDF file to `game-rules-flask-backend/` directory
2. Update `PDF_PATH` in `app.py`
3. Modify AI prompts to reference the new game
4. Update search keywords and scoring logic

### Customizing AI Responses

Edit the system prompts in `ai_service.py`:
- Modify `get_anthropic_response()` for Claude customization
- Modify `get_grok_response()` for Grok customization

### UI Customization

The React Native app uses:
- **Styling**: StyleSheet with gradient backgrounds
- **Icons**: Expo Vector Icons
- **Navigation**: Modal-based image viewing
- **State Management**: React hooks

## Troubleshooting

### Common Issues

1. **PDF not loading**: Ensure `catan_base_rules.pdf` exists in backend directory
2. **API errors**: Check API keys in environment variables
3. **Image display issues**: Verify pdf2image and poppler installation
4. **CORS errors**: Flask-CORS is configured for React Native development

### Logs

- Backend logs: Check Flask console output
- Frontend logs: Check browser console or Expo development tools

## Testing

### Manual Testing

1. **Health Check**: Visit http://localhost:5000/api/health
2. **Chat Functionality**: Ask "How do I build a settlement?"
3. **Screenshot Display**: Verify rule images appear and are clickable
4. **AI Provider Switch**: Toggle between Claude and Grok
5. **Error Handling**: Test with invalid API keys

### Sample Questions

- "How do I build a settlement?"
- "What happens when I roll a 7?"
- "How do I trade with other players?"
- "What are the victory conditions?"
- "How do development cards work?"

## Deployment

### Production Deployment

1. **Environment Setup**: Configure production API keys
2. **Docker Build**: Use multi-stage builds for optimization
3. **Reverse Proxy**: Configure nginx for production serving
4. **SSL**: Add HTTPS certificates for secure API communication

### Scaling Considerations

- **Caching**: Add Redis for PDF processing cache
- **Load Balancing**: Multiple Flask backend instances
- **CDN**: Serve static assets and images via CDN
- **Database**: Store chat history and user preferences

## License

This project is part of the devin_demo repository. See main repository for license information.
