import { Link, useLocation } from 'react-router-dom'
import { Film } from 'lucide-react'

export function Navigation() {
  const location = useLocation()
  
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Film className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">MovieRatings</h1>
          </div>
          <nav className="flex gap-6">
            <Link 
              to="/" 
              className={`text-lg font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Movies
            </Link>
            <Link 
              to="/about" 
              className={`text-lg font-medium transition-colors ${
                location.pathname === '/about' 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              About Me
            </Link>
          </nav>
        </div>
        <p className="text-gray-600 mt-2">Discover and review your favorite movies</p>
      </div>
    </header>
  )
}
