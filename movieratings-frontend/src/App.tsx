import { useState, useEffect } from 'react'
import { Star, Plus, Edit, Trash2, Film, User } from 'lucide-react'
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
    poster: "https://images.unsplash.com/photo-1489599735188-3c8bc0d4b4c0?w=300&h=450&fit=crop"
  },
  {
    id: 2,
    title: "The Godfather",
    year: 1972,
    genre: "Crime",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop"
  },
  {
    id: 3,
    title: "The Dark Knight",
    year: 2008,
    genre: "Action",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop"
  },
  {
    id: 4,
    title: "Pulp Fiction",
    year: 1994,
    genre: "Crime",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
    poster: "https://images.unsplash.com/photo-1489599735188-3c8bc0d4b4c0?w=300&h=450&fit=crop"
  },
  {
    id: 5,
    title: "Forrest Gump",
    year: 1994,
    genre: "Drama",
    description: "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop"
  },
  {
    id: 6,
    title: "Inception",
    year: 2010,
    genre: "Sci-Fi",
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop"
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
  const [currentView, setCurrentView] = useState<'movies' | 'about'>('movies')
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Film className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">MovieRatings</h1>
            </div>
            <nav className="flex gap-2">
              <Button
                variant={currentView === 'movies' ? 'default' : 'outline'}
                onClick={() => setCurrentView('movies')}
                className="flex items-center gap-2"
              >
                <Film className="w-4 h-4" />
                Movies
              </Button>
              <Button
                variant={currentView === 'about' ? 'default' : 'outline'}
                onClick={() => setCurrentView('about')}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                About Me
              </Button>
            </nav>
          </div>
          <p className="text-gray-600 mt-2">
            {currentView === 'movies' 
              ? 'Discover and review your favorite movies' 
              : 'Learn more about the creator of this app'
            }
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'movies' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map((movie) => {
              const avgRating = getAverageRating(movie.id)
              const reviewCount = getReviewCount(movie.id)
              
              return (
                <Card key={movie.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-[3/4] bg-gray-200 relative overflow-hidden">
                    <img 
                      src={movie.poster || "https://placehold.co/300x450/png"} 
                      alt={`${movie.title} poster`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/300x450/png"
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
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="overflow-hidden">
              <div className="aspect-[16/9] bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1489599735188-3c8bc0d4b4c0?w=800&h=450&fit=crop" 
                  alt="About me background"
                  className="w-full h-full object-cover opacity-30"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/800x450/png"
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <User className="w-16 h-16 mx-auto mb-4" />
                    <h2 className="text-4xl font-bold mb-2">About Me</h2>
                    <p className="text-xl opacity-90">Movie Enthusiast & Developer</p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Film className="w-5 h-5 text-blue-600" />
                    My Story
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Welcome to MovieRatings! I'm passionate about cinema and love sharing great films with fellow movie enthusiasts. 
                    This application was born from my desire to create a simple, elegant way to discover and review movies.
                  </p>
                  <p className="text-gray-600 leading-relaxed mt-4">
                    Whether you're looking for your next favorite film or want to share your thoughts on the latest blockbuster, 
                    this platform is designed to make movie discovery enjoyable and social.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Favorite Genres
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Drama</span>
                      <div className="flex">{renderStars(5)}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Sci-Fi</span>
                      <div className="flex">{renderStars(5)}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Crime</span>
                      <div className="flex">{renderStars(4)}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Action</span>
                      <div className="flex">{renderStars(4)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-green-600" />
                    What I Love About Movies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      Compelling storytelling and character development
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      Innovative cinematography and visual effects
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      Memorable soundtracks and scores
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      Films that challenge perspectives and inspire thought
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="w-5 h-5 text-purple-600" />
                    Get In Touch
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Have a movie recommendation or want to discuss cinema? I'd love to hear from you!
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>📧 Email: moviefan@example.com</p>
                    <p>🐦 Twitter: @movieratings</p>
                    <p>🎬 Letterboxd: /movieratings</p>
                  </div>
                  <Button className="mt-4 w-full">
                    Start a Conversation
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>My latest movie reviews and ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.slice(0, 3).map((review) => {
                    const movie = movies.find(m => m.id === review.movieId)
                    return (
                      <div key={review.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <img 
                            src={movie?.poster || "https://placehold.co/60x90/png"} 
                            alt={`${movie?.title} poster`}
                            className="w-12 h-18 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = "https://placehold.co/60x90/png"
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{movie?.title}</span>
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                          <span className="text-xs text-gray-400 mt-1">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                  {reviews.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No reviews yet. Check out the Movies section to get started!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
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
