import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:3000/api'

function App() {
  // Todo states
  const [todos, setTodos] = useState([])
  const [taskName, setTaskName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTaskName, setEditTaskName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos()
  }, [])

  // Fetch all todos
  const fetchTodos = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/todos`)
      const data = await response.json()
      setTodos(data)
      setError('')
    } catch (err) {
      setError('Failed to fetch todos')
    } finally {
      setLoading(false)
    }
  }

  // Add new todo
  const handleAddTodo = async (e) => {
    e.preventDefault()
    if (!taskName.trim()) return

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          TaskName: taskName,
          TaskStatus: false
        })
      })
      if (response.ok) {
        setTaskName('')
        fetchTodos()
      } else {
        const data = await response.json()
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to add todo')
    }
  }
  const handleToggleStatus = async (todo) => {
    try {
      const response = await fetch(`${API_URL}/todos/${todo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          TaskName: todo.TaskName,
          TaskStatus: !todo.TaskStatus
        })
      })
      if (response.ok) {
        fetchTodos()
      }
    } catch (err) {
      setError('Failed to update todo')
    }
  }
  const handleStartEdit = (todo) => {
    setEditingId(todo._id)
    setEditTaskName(todo.TaskName)
  }
  const handleSaveEdit = async (todo) => {
    if (!editTaskName.trim()) return

    try {
      const response = await fetch(`${API_URL}/todos/${todo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          TaskName: editTaskName,
          TaskStatus: todo.TaskStatus
        })
      })
      if (response.ok) {
        setEditingId(null)
        setEditTaskName('')
        fetchTodos()
      }
    } catch (err) {
      setError('Failed to update todo')
    }
  }

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTaskName('')
  }

  // Delete todo
  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchTodos()
      }
    } catch (err) {
      setError('Failed to delete todo')
    }
  }

  return (
    <div className="app">
      <div className="todo-container">
        <div className="header">
          <h1>Todo App</h1>
        </div>

        <form onSubmit={handleAddTodo} className="add-form">
          <input
            type="text"
            placeholder="Enter a new task..."
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>

        {error && <p className="error">{error}</p>}
        {loading && <p>Loading...</p>}

        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo._id} className={`todo-item ${todo.TaskStatus ? 'completed' : ''}`}>
              {editingId === todo._id ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editTaskName}
                    onChange={(e) => setEditTaskName(e.target.value)}
                  />
                  <button onClick={() => handleSaveEdit(todo)}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </div>
              ) : (
                <>
                  <div className="todo-content">
                    <input
                      type="checkbox"
                      checked={todo.TaskStatus}
                      onChange={() => handleToggleStatus(todo)}
                    />
                    <span className={todo.TaskStatus ? 'completed-text' : ''}>
                      {todo.TaskName}
                    </span>
                  </div>
                  <div className="todo-actions">
                    <button onClick={() => handleStartEdit(todo)}>Edit</button>
                    <button onClick={() => handleDeleteTodo(todo._id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {todos.length === 0 && !loading && (
          <p className="empty-message">No tasks yet. Add one above!</p>
        )}
      </div>
    </div>
  )
}

export default App
