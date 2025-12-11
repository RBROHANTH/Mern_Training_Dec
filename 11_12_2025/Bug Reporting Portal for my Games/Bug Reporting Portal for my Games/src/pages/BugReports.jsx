import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = 'http://localhost:3000/api'

function BugReports() {
  const [bugReports, setBugReports] = useState([])
  const [gameName, setGameName] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editGameName, setEditGameName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Check for token on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    } else {
      fetchBugReports()
    }
  }, [navigate])

  // Fetch all bug reports
  const fetchBugReports = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/Bug_Reports`)
      const data = await response.json()
      setBugReports(data)
      setError('')
    } catch (err) {
      setError('Failed to fetch bug reports')
    } finally {
      setLoading(false)
    }
  }

  // Add new bug report
  const handleAddBugReport = async (e) => {
    e.preventDefault()
    if (!gameName.trim() || !description.trim()) return

    try {
      const response = await fetch(`${API_URL}/Bug_Reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          gameName: gameName,
          description: description
        })
      })
      if (response.ok) {
        setGameName('')
        setDescription('')
        fetchBugReports()
      } else {
        const data = await response.json()
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to add bug report')
    }
  }

  const handleStartEdit = (bugReport) => {
    setEditingId(bugReport._id)
    setEditGameName(bugReport.gameName || '')
    setEditDescription(bugReport.description || '')
  }

  // Save edit
  const handleSaveEdit = async (bugReport) => {
    if (!editGameName?.trim() || !editDescription?.trim()) return

    try {
      const response = await fetch(`${API_URL}/Bug_Reports/${bugReport._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          gameName: editGameName,
          description: editDescription
        })
      })
      if (response.ok) {
        setEditingId(null)
        setEditGameName('')
        setEditDescription('')
        fetchBugReports()
      }
    } catch (err) {
      setError('Failed to update bug report')
    }
  }

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditGameName('')
    setEditDescription('')
  }

  // Delete bug report
  const handleDeleteBugReport = async (id) => {
    try {
      const response = await fetch(`${API_URL}/Bug_Reports/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchBugReports()
      }
    } catch (err) {
      setError('Failed to delete bug report')
    }
  }

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="app">
      <div className="bug-report-container">
        <div className="header">
          <h1>🐞 Bug Reporting Portal</h1>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>

        <form onSubmit={handleAddBugReport} className="add-form">
          <div className="game-select">
            <p>Select Game:</p>
            <label>
              <input
                type="radio"
                name="game"
                value="Ambuli"
                checked={gameName === "Ambuli"}
                onChange={(e) => setGameName(e.target.value)}
              />
              Ambuli
            </label>
            <label>
              <input
                type="radio"
                name="game"
                value="Eco-Quest"
                checked={gameName === "Eco-Quest"}
                onChange={(e) => setGameName(e.target.value)}
              />
              Eco-Quest
            </label>
            <label>
              <input
                type="radio"
                name="game"
                value="NeuronX"
                checked={gameName === "NeuronX"}
                onChange={(e) => setGameName(e.target.value)}
              />
              NeuronX
            </label>
          </div>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Add Bug Report</button>
        </form>

        {error && <p className="error">{error}</p>}
        {loading && <p>Loading...</p>}

        <ul className="Game-list">
          {bugReports.map((bugReport) => (
            <li key={bugReport._id} className="Game-item">
              {editingId === bugReport._id ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editGameName}
                    onChange={(e) => setEditGameName(e.target.value)}
                    placeholder="Game name"
                  />
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description"
                  />
                  <button onClick={() => handleSaveEdit(bugReport)}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </div>
              ) : (
                <>
                  <div className="Game-content">
                    <span className="Game-name">{bugReport.gameName}</span>
                    <span className="Game-description">{bugReport.description}</span>
                  </div>
                  <div className="Game-actions">
                    <button onClick={() => handleStartEdit(bugReport)}>Edit</button>
                    <button onClick={() => handleDeleteBugReport(bugReport._id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {bugReports.length === 0 && !loading && (
          <p className="empty-message">No bug reports yet. Add one above!</p>
        )}
      </div>
    </div>
  )
}

export default BugReports
