import { Link } from 'react-router-dom'
function BookList() {
  const books = [
    { id: 1, title: 'React Basics', author: 'John Doe' },
    { id: 2, title: 'JavaScript Mastery', author: 'Jane Smith' },
    { id: 3, title: 'Node.js Guide', author: 'Bob Wilson' }
  ]
  return (
    <div>
      <h1>Book List</h1>
      <Link to="/">
        <button>Back to Home</button>
      </Link>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <strong>{book.title}</strong> by {book.author}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BookList