# Devin Demo - GitHub Issues Integration

This project demonstrates how to integrate Devin AI with GitHub Issues, allowing you to automate issue analysis and resolution.

## Features

### Frontend (MovieRatings)
- View a list of movies with their average ratings
- Add new movie reviews
- Edit existing reviews
- Delete reviews
- Responsive React frontend with Vite
- Local storage for data persistence

### Backend (GitHub Issues Integration)
- List all open GitHub issues
- Analyze issues with Devin AI to generate scope and confidence scores
- Execute action plans to automatically resolve issues
- Slack bot integration for easy interaction

## Tech Stack

### Frontend
- React 18
- Vite
- TypeScript
- Tailwind CSS
- Local Storage for data persistence

### Backend
- Python
- Slack Bolt Framework
- Devin AI API
- GitHub API

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- Devin AI API key
- GitHub API token
- Slack bot token and app token

### Environment Setup

Create a `.env` file in the `backend` directory with the following variables:
```
DEVIN_API_KEY=your_devin_api_key
GITHUB_TOKEN=your_github_token
GITHUB_REPO=your_username/your_repo
SLACK_BOT_TOKEN=your_slack_bot_token
SLACK_APP_TOKEN=your_slack_app_token
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/pinghsu520/devin_demo.git
cd devin_demo
```

2. Set up the frontend
```bash
cd movieratings-frontend
npm install
npm run dev
```

3. Set up the backend
```bash
cd backend
pip install -r requirements.txt
python slackbot.py
```

## GitHub Issues Integration Usage

### Slack Commands
Once the Slack bot is running, you can interact with it using the following commands:

- `@devin list issues` - Shows all open GitHub issues
- `@devin scope #123` - Analyzes issue #123 and returns a scope with confidence score and fix issue

