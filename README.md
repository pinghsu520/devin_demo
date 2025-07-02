# MovieRatings - Full Stack Web Application

A full-stack web application that allows users to rate and review movies.

## Features

- View a list of movies with their average ratings
- Add new movie reviews
- Edit existing reviews
- Delete reviews
- Responsive React frontend with Vite
- Flask REST API backend
- PostgreSQL/SQLite database

## Tech Stack

### Frontend
- React 18
- Vite
- TypeScript
- Tailwind CSS
- Axios for API calls

### Backend
- Flask
- SQLAlchemy ORM
- PostgreSQL/SQLite
- RESTful API design

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- PostgreSQL (optional, SQLite works too)

### Installation

1. Clone the repository
```bash
git clone https://github.com/pinghsu520/devin_demo.git
cd devin_demo
```

2. Set up the backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

3. Set up the frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

- `GET /api/movies` - Get all movies with average ratings
- `GET /api/movies/{id}/reviews` - Get reviews for a specific movie
- `POST /api/reviews` - Create a new review
- `PUT /api/reviews/{id}` - Update an existing review
- `DELETE /api/reviews/{id}` - Delete a review

## Contributing

Please see the GitHub issues for planned features and improvements.

## License

MIT License
