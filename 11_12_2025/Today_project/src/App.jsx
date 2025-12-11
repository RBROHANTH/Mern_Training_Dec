import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [foods, setFoods] = useState([])
  const [newFoodName, setNewFoodName] = useState('')
  const [newFoodPrice, setNewFoodPrice] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
      fetchFoods()
    }
  }, [])

  const fetchFoods = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/foods', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setFoods(data)
    } catch (error) {
      console.error('Error fetching foods:', error)
    }
  }

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      if (response.ok) {
        alert('Registration successful! Please log in.')
      } else {
        const data = await response.json()
        alert(data.message || 'Registration failed.')
      }
    } catch (error) {
      console.error('Error during registration:', error)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('token', data.token)
        setIsLoggedIn(true)
        fetchFoods()
      } else {
        alert(data.message || 'Login failed.')
      }
    } catch (error) {
      console.error('Error during login:', error)
    }
  }

  const handleAddFood = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/foods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ FoodName: newFoodName, FoodPrice: Number(newFoodPrice) })
      })
      if (response.ok) {
        setNewFoodName('')
        setNewFoodPrice('')
        fetchFoods()
      } else {
        alert('Failed to add food.')
      }
    } catch (error) {
      console.error('Error adding food:', error)
    }
  }

  const handleDeleteFood = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3000/api/foods/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        fetchFoods()
      }
    } catch (error) {
      console.error('Error deleting food:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    setFoods([])
  }

  // If NOT logged in, show login/register form
  if (!isLoggedIn) {
    return (
      <div className="container">
        <h1>Food App</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div>
            <button type="button" onClick={handleRegister}>Register</button>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    )
  }

  // If logged in, show food management
  return (
    <div className="container">
      <h1>Food App</h1>
      <button onClick={handleLogout}>Logout</button>
      
      <h2>Add New Food</h2>
      <form onSubmit={handleAddFood}>
        <input
          type="text"
          placeholder="Food Name"
          value={newFoodName}
          onChange={(e) => setNewFoodName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={newFoodPrice}
          onChange={(e) => setNewFoodPrice(e.target.value)}
          required
        />
        <button type="submit">Add Food</button>
      </form>

      <h2>Food List</h2>
      {foods.length === 0 ? (
        <p>No foods added yet.</p>
      ) : (
        <ul>
          {foods.map((food) => (
            <li key={food._id}>
              {food.FoodName} - ₹{food.FoodPrice}
              <button onClick={() => handleDeleteFood(food._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App