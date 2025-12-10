import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:3000/api'

function App() {
  // Food states
  const [foods, setFoods] = useState([])
  const [foodName, setFoodName] = useState('')
  const [foodPrice, setFoodPrice] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editFoodName, setEditFoodName] = useState('')
  const [editFoodPrice, setEditFoodPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch foods on mount
  useEffect(() => {
    fetchFoods()
  }, [])

  // Fetch all foods
  const fetchFoods = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/foods`)
      const data = await response.json()
      setFoods(data)
      setError('')
    } catch (err) {
      setError('Failed to fetch foods')
    } finally {
      setLoading(false)
    }
  }

  // Add new food
  const handleAddFood = async (e) => {
    e.preventDefault()
    if (!foodName.trim() || !foodPrice) return

    try {
      const response = await fetch(`${API_URL}/foods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          FoodName: foodName,
          FoodPrice: parseFloat(foodPrice)
        })
      })
      if (response.ok) {
        setFoodName('')
        setFoodPrice('')
        fetchFoods()
      } else {
        const data = await response.json()
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to add food')
    }
  }

  // Start editing
  const handleStartEdit = (food) => {
    setEditingId(food._id)
    setEditFoodName(food.FoodName)
    setEditFoodPrice(food.FoodPrice.toString())
  }

  // Save edit
  const handleSaveEdit = async (food) => {
    if (!editFoodName.trim() || !editFoodPrice) return

    try {
      const response = await fetch(`${API_URL}/foods/${food._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          FoodName: editFoodName,
          FoodPrice: parseFloat(editFoodPrice)
        })
      })
      if (response.ok) {
        setEditingId(null)
        setEditFoodName('')
        setEditFoodPrice('')
        fetchFoods()
      }
    } catch (err) {
      setError('Failed to update food')
    }
  }

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditFoodName('')
    setEditFoodPrice('')
  }

  // Delete food
  const handleDeleteFood = async (id) => {
    try {
      const response = await fetch(`${API_URL}/foods/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchFoods()
      }
    } catch (err) {
      setError('Failed to delete food')
    }
  }

  return (
    <div className="app">
      <div className="food-container">
        <div className="header">
          <h1>🍔 Food Menu App</h1>
        </div>

        <form onSubmit={handleAddFood} className="add-form">
          <input
            type="text"
            placeholder="Food name..."
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={foodPrice}
            onChange={(e) => setFoodPrice(e.target.value)}
            step="0.01"
            min="0"
          />
          <button type="submit">Add Food</button>
        </form>

        {error && <p className="error">{error}</p>}
        {loading && <p>Loading...</p>}

        <ul className="food-list">
          {foods.map((food) => (
            <li key={food._id} className="food-item">
              {editingId === food._id ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editFoodName}
                    onChange={(e) => setEditFoodName(e.target.value)}
                    placeholder="Food name"
                  />
                  <input
                    type="number"
                    value={editFoodPrice}
                    onChange={(e) => setEditFoodPrice(e.target.value)}
                    placeholder="Price"
                    step="0.01"
                    min="0"
                  />
                  <button onClick={() => handleSaveEdit(food)}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </div>
              ) : (
                <>
                  <div className="food-content">
                    <span className="food-name">{food.FoodName}</span>
                    <span className="food-price">₹{food.FoodPrice.toFixed(2)}</span>
                  </div>
                  <div className="food-actions">
                    <button onClick={() => handleStartEdit(food)}>Edit</button>
                    <button onClick={() => handleDeleteFood(food._id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {foods.length === 0 && !loading && (
          <p className="empty-message">No food items yet. Add one above!</p>
        )}
      </div>
    </div>
  )
}

export default App
