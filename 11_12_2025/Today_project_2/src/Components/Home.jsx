import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <h1>Welcome to Book Store</h1>
      <p>Browse our collection of books!</p>
      <Link to="/books">
        <button>View Books</button>
      </Link>
    </div>
  )
}

export default Home
