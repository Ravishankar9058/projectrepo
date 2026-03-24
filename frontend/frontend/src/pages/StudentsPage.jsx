import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchSchoolById } from '../api/schoolsApi'
import { fetchStudents, createStudent, updateStudent, deleteStudent } from '../api/studentsApi'

const EMPTY = { name: '', std: '', age: '', className: '' }

export default function StudentsPage() {
  const { schoolId } = useParams()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [school, setSchool] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')

  // Modal state
  const [modal, setModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setPageError('')
    const [schoolRes, studentsRes] = await Promise.allSettled([
      fetchSchoolById(schoolId),
      fetchStudents(schoolId),
    ])
    if (schoolRes.status === 'fulfilled') setSchool(schoolRes.value)
    if (studentsRes.status === 'fulfilled') setStudents(studentsRes.value)
    else setPageError('Failed to load students.')
    setLoading(false)
  }, [schoolId])

  useEffect(() => { load() }, [load])

  function openAdd() {
    setEditTarget(null)
    setForm(EMPTY)
    setFormError('')
    setModal(true)
  }

  function openEdit(s) {
    setEditTarget(s)
    setForm({ name: s.name ?? '', std: s.std ?? '', age: s.age ?? '', className: s.className ?? '' })
    setFormError('')
    setModal(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.name.trim()) { setFormError('Name is required.'); return }
    if (!form.std.trim()) { setFormError('Standard is required.'); return }
    const age = Number(form.age)
    if (!form.age || isNaN(age) || age < 6 || age > 16) {
      setFormError('Age must be between 6 and 16.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      if (editTarget) {
        await updateStudent(schoolId, editTarget.id, form)
      } else {
        await createStudent(schoolId, form)
      }
      setModal(false)
      await load()
    } catch (err) {
      setFormError(
        err.response?.data?.error || err.response?.data?.message || 'Save failed.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteStudent(schoolId, deleteTarget.id)
      setDeleteTarget(null)
      await load()
    } catch {
      setPageError('Failed to delete student.')
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

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
        {/* Header */}
        <div className="page-header">
          <div>
            <button className="btn-back" onClick={() => navigate('/')}>← Back</button>
            <h2>{school?.name ?? 'Students'}</h2>
            <p className="text-muted">{students.length} student{students.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="btn-primary" onClick={openAdd}>+ Add Student</button>
        </div>

        {pageError && <div className="alert-error">{pageError}</div>}

        {/* Table */}
        {loading ? (
          <div className="loading-row">Loading…</div>
        ) : students.length === 0 ? (
          <div className="empty">No students yet. Click "+ Add Student" to add one.</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Standard</th>
                  <th>Class</th>
                  <th>Age</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s.id}>
                    <td className="text-muted">{i + 1}</td>
                    <td>
                      <div className="student-cell">
                        <div className="student-mini-avatar">{s.name.charAt(0).toUpperCase()}</div>
                        <b>{s.name}</b>
                      </div>
                    </td>
                    <td><span className="badge">{s.std}</span></td>
                    <td>{s.className}</td>
                    <td>{s.age}</td>
                    <td>
                      <button className="btn-icon" title="Edit" onClick={() => openEdit(s)}>✏️</button>
                      <button className="btn-icon btn-icon-del" title="Delete" onClick={() => setDeleteTarget(s)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editTarget ? 'Edit Student' : 'Add Student'}</h3>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave} className="modal-body">
              <div className="field">
                <label>Full Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Student name"
                />
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Standard *</label>
                  <input
                    value={form.std}
                    onChange={e => setForm(p => ({ ...p, std: e.target.value }))}
                    placeholder="e.g. 7"
                  />
                </div>
                <div className="field">
                  <label>Class Section</label>
                  <input
                    value={form.className}
                    onChange={e => setForm(p => ({ ...p, className: e.target.value }))}
                    placeholder="e.g. A"
                  />
                </div>
              </div>
              <div className="field">
                <label>Age * (6 – 16)</label>
                <input
                  type="number"
                  min="6"
                  max="16"
                  value={form.age}
                  onChange={e => setForm(p => ({ ...p, age: e.target.value }))}
                  placeholder="e.g. 12"
                />
              </div>
              {formError && <p className="form-error">{formError}</p>}
              <div className="modal-actions">
                <button type="button" className="btn-outline-dark" onClick={() => setModal(false)} disabled={saving}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : editTarget ? 'Save Changes' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Remove Student</h3>
              <button className="modal-close" onClick={() => setDeleteTarget(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="delete-body">
                <span className="delete-icon">🗑️</span>
                <p>Remove <b>{deleteTarget.name}</b>?</p>
                <p className="sub">This cannot be undone.</p>
              </div>
              <div className="modal-actions">
                <button className="btn-outline-dark" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
                <button className="btn-danger" onClick={handleDelete} disabled={deleting}>
                  {deleting ? 'Removing…' : 'Remove'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
