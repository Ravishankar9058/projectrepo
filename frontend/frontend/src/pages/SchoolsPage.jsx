import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchSchools } from '../api/schoolsApi'

export default function SchoolsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'

  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSchools()
      .then(setSchools)
      .catch(() => setError('Failed to load schools.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      {/* Navbar */}
      <nav className="navbar">
        <span className="nav-brand">🏫 School Portal</span>
        <div className="nav-right">
          <span className="nav-user">👤 {user?.username}</span>
          <button className="btn-outline" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="container">
        <div className="page-header">
          <h2>{isAdmin ? 'All Schools' : 'My School'}</h2>
          <p className="text-muted">{schools.length} school{schools.length !== 1 ? 's' : ''}</p>
        </div>

        {error && <div className="alert-error">{error}</div>}

        {loading ? (
          <div className="loading-row">Loading…</div>
        ) : schools.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🏫</div>
            No schools found.
          </div>
        ) : (
          <div className="cards-grid">
            {schools.map(school => (
              <div
                key={school.id}
                className="school-card"
                onClick={() => navigate(`/schools/${school.id}/students`)}
              >
                <div className="school-avatar">{school.name.charAt(0)}</div>
                <div className="school-info">
                  <h3>{school.name}</h3>
                  <p className="text-muted">ID: {school.id}</p>
                </div>
                <span className="arrow">→</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
