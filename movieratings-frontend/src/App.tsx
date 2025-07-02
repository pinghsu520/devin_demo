import { useState, useEffect } from 'react'
import { Star, Plus, Edit, Trash2, Film } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import './App.css'

interface Movie {
  id: number
  title: string
  year: number
  genre: string
  description: string
  poster?: string
}

interface Review {
  id: number
  movieId: number
  userName: string
  rating: number
  comment: string
  createdAt: string
}

const sampleMovies: Movie[] = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    year: 1994,
    genre: "Drama",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    poster: "/images/posters/shawshank.jpg"
  },
  {
    id: 2,
    title: "The Godfather",
    year: 1972,
    genre: "Crime",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    poster: "/images/posters/godfather.jpg"
  },
  {
    id: 3,
    title: "The Dark Knight",
    year: 2008,
    genre: "Action",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
    poster: "/images/posters/dark-knight.jpg"
  },
  {
    id: 4,
    title: "Pulp Fiction",
    year: 1994,
    genre: "Crime",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
    poster: "/images/posters/pulp-fiction.jpg"
  },
  {
    id: 5,
    title: "Forrest Gump",
    year: 1994,
    genre: "Drama",
    description: "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.",
    poster: "/images/posters/forrest-gump.jpg"
  },
  {
    id: 6,
    title: "Inception",
    year: 2010,
    genre: "Sci-Fi",
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
    poster: "/images/posters/inception.jpg"
  }
]

const sampleReviews: Review[] = [
  { id: 1, movieId: 1, userName: "John Doe", rating: 5, comment: "Absolutely incredible movie! A masterpiece of storytelling.", createdAt: "2024-01-15T10:30:00Z" },
  { id: 2, movieId: 1, userName: "Jane Smith", rating: 4, comment: "Great acting and emotional depth. Highly recommended.", createdAt: "2024-01-16T14:20:00Z" },
  { id: 3, movieId: 2, userName: "Mike Johnson", rating: 5, comment: "The greatest crime film ever made. Marlon Brando is phenomenal.", createdAt: "2024-01-17T09:15:00Z" },
  { id: 4, movieId: 3, userName: "Sarah Wilson", rating: 5, comment: "Heath Ledger's Joker is unforgettable. Dark and compelling.", createdAt: "2024-01-18T16:45:00Z" },
  { id: 5, movieId: 4, userName: "Tom Brown", rating: 4, comment: "Tarantino at his finest. Non-linear storytelling at its best.", createdAt: "2024-01-19T11:30:00Z" },
  { id: 6, movieId: 5, userName: "Lisa Davis", rating: 4, comment: "Heartwarming and inspiring. Tom Hanks delivers an amazing performance.", createdAt: "2024-01-20T13:25:00Z" }
]

function App() {
  const [movies] = useState<Movie[]>(sampleMovies)
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [reviewForm, setReviewForm] = useState({
    userName: '',
    rating: 5,
    comment: ''
  })

  useEffect(() => {
    const savedReviews = localStorage.getItem('movieReviews')
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews))
    } else {
      setReviews(sampleReviews)
      localStorage.setItem('movieReviews', JSON.stringify(sampleReviews))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('movieReviews', JSON.stringify(reviews))
  }, [reviews])

  const getAverageRating = (movieId: number) => {
    const movieReviews = reviews.filter(review => review.movieId === movieId)
    if (movieReviews.length === 0) return 0
    const sum = movieReviews.reduce((acc, review) => acc + review.rating, 0)
    return Math.round((sum / movieReviews.length) * 10) / 10
  }

  const getReviewCount = (movieId: number) => {
    return reviews.filter(review => review.movieId === movieId).length
  }

  const handleSubmitReview = () => {
    if (!selectedMovie || !reviewForm.userName.trim() || !reviewForm.comment.trim()) return

    if (editingReview) {
      setReviews(prev => prev.map(review => 
        review.id === editingReview.id 
          ? { ...review, ...reviewForm, createdAt: new Date().toISOString() }
          : review
      ))
      setEditingReview(null)
    } else {
      const newReview: Review = {
        id: Date.now(),
        movieId: selectedMovie.id,
        userName: reviewForm.userName,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        createdAt: new Date().toISOString()
      }
      setReviews(prev => [...prev, newReview])
    }

    setReviewForm({ userName: '', rating: 5, comment: '' })
    setIsReviewDialogOpen(false)
  }

  const handleEditReview = (review: Review) => {
    setEditingReview(review)
    setReviewForm({
      userName: review.userName,
      rating: review.rating,
      comment: review.comment
    })
    setIsReviewDialogOpen(true)
  }

  const handleDeleteReview = (reviewId: number) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId))
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Film className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">MovieRatings</h1>
          </div>
          <p className="text-gray-600 mt-2">Discover and review your favorite movies</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => {
            const avgRating = getAverageRating(movie.id)
            const reviewCount = getReviewCount(movie.id)
            
            return (
              <Card key={movie.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[3/4] bg-gray-200 relative overflow-hidden">
                  <img 
                    src={movie.poster || "/images/posters/default-poster.jpg"} 
                    alt={`${movie.title} poster`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/posters/default-poster.jpg"
                    }}
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{movie.title}</CardTitle>
                      <CardDescription>{movie.year} • {movie.genre}</CardDescription>
                    </div>
                    <Badge variant="secondary">{movie.genre}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStars(Math.round(avgRating))}
                    <span className="text-sm text-gray-600">
                      {avgRating > 0 ? `${avgRating}/5` : 'No ratings'} ({reviewCount} reviews)
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{movie.description}</p>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          View Reviews
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{movie.title} Reviews</DialogTitle>
                          <DialogDescription>
                            {reviewCount} reviews • Average rating: {avgRating > 0 ? `${avgRating}/5` : 'No ratings'}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          {reviews
                            .filter(review => review.movieId === movie.id)
                            .map((review) => (
                              <div key={review.id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{review.userName}</span>
                                      {renderStars(review.rating)}
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedMovie(movie)
                                        handleEditReview(review)
                                      }}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteReview(review.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-sm">{review.comment}</p>
                              </div>
                            ))}
                          {reviewCount === 0 && (
                            <p className="text-center text-gray-500 py-8">No reviews yet. Be the first to review!</p>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setSelectedMovie(movie)
                        setEditingReview(null)
                        setReviewForm({ userName: '', rating: 5, comment: '' })
                        setIsReviewDialogOpen(true)
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingReview ? 'Edit Review' : 'Add Review'} for {selectedMovie?.title}
            </DialogTitle>
            <DialogDescription>
              Share your thoughts about this movie
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Your Name</label>
              <Input
                value={reviewForm.userName}
                onChange={(e) => setReviewForm(prev => ({ ...prev, userName: e.target.value }))}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Rating</label>
              <div className="mt-1">
                {renderStars(reviewForm.rating, true, (rating) => 
                  setReviewForm(prev => ({ ...prev, rating }))
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Review</label>
              <Textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Write your review..."
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitReview}>
                {editingReview ? 'Update Review' : 'Submit Review'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App
