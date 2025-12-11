import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Components/Home.jsx'
import BookList from './Components/BookList.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BookList />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
