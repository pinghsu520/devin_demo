import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { Movies } from './components/Movies'
import { AboutMe } from './components/AboutMe'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Movies />} />
          <Route path="/about" element={<AboutMe />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
