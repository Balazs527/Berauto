import { useState } from 'react'
import { login } from '../services/authService'

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const data = await login(email.trim(), password)
      onLoginSuccess(data)
    } catch (err) {
      setError(err.message || 'Sikertelen belepes.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="page-shell">
      <h1>Belepes</h1>
      <p className="page-lead">Jelentkezz be az e-mail cimeddel es jelszavaddal.</p>

      <form className="login-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>E-mail</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="form-field">
          <span>Jelszo</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="status status-error">{error}</p>}
        <button type="submit" className="submit-button" disabled={busy}>
          {busy ? 'Belepes...' : 'Belepes'}
        </button>
      </form>
    </main>
  )
}

export default LoginPage
