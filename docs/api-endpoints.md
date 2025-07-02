# API Endpoints Documentation

## Movies

### GET /api/movies
Get all movies with their average ratings.

**Response:**
```json
[
  {
    "id": 1,
    "title": "The Shawshank Redemption",
    "year": 1994,
    "genre": "Drama",
    "description": "Two imprisoned men bond over a number of years...",
    "average_rating": 4.8,
    "review_count": 15
  }
]
```

## Reviews

### GET /api/movies/{movie_id}/reviews
Get all reviews for a specific movie.

**Response:**
```json
[
  {
    "id": 1,
    "movie_id": 1,
    "user_name": "John Doe",
    "rating": 5,
    "comment": "Amazing movie!",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### POST /api/reviews
Create a new review.

**Request Body:**
```json
{
  "movie_id": 1,
  "user_name": "Jane Smith",
  "rating": 4,
  "comment": "Great story and acting"
}
```

### PUT /api/reviews/{review_id}
Update an existing review.

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Updated: Absolutely fantastic!"
}
```

### DELETE /api/reviews/{review_id}
Delete a review.

**Response:** 204 No Content
