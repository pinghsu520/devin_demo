import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Mail, MapPin, Calendar, Heart, Star } from 'lucide-react'

export function AboutMe() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About Me</h2>
            <p className="text-xl text-gray-600">Movie enthusiast and passionate reviewer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-blue-600" />
                  <CardTitle>Personal Info</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">movie.lover@example.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Movie reviewer since 2020</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-blue-600" />
                  <CardTitle>My Passion</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  I've been passionate about cinema for over a decade. From classic Hollywood films 
                  to modern indie productions, I love exploring the art of storytelling through film. 
                  This platform allows me to share my thoughts and connect with fellow movie enthusiasts.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-blue-600" />
                  <CardTitle>Favorite Genres</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Drama</Badge>
                  <Badge variant="secondary">Sci-Fi</Badge>
                  <Badge variant="secondary">Crime</Badge>
                  <Badge variant="secondary">Thriller</Badge>
                  <Badge variant="secondary">Comedy</Badge>
                  <Badge variant="secondary">Action</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Review Philosophy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  I believe every film has something to offer, whether it's groundbreaking cinematography, 
                  compelling characters, or innovative storytelling. My reviews focus on both technical 
                  aspects and emotional impact, helping viewers discover their next favorite film.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>My Movie Journey</CardTitle>
              <CardDescription>A timeline of my cinematic experiences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-gray-900">2024 - MovieRatings Platform</h4>
                  <p className="text-gray-600">Launched this platform to share reviews and connect with movie lovers worldwide.</p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-gray-900">2022 - Film Festival Volunteer</h4>
                  <p className="text-gray-600">Started volunteering at local film festivals, discovering amazing independent films.</p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-gray-900">2020 - First Review</h4>
                  <p className="text-gray-600">Wrote my first movie review for "The Shawshank Redemption" - still one of my favorites!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
