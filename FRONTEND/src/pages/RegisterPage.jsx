import { useState } from 'react'
import { register } from '../services/authService'

function RegisterPage({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    street: '',
    city: '',
    postalcode: '',
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Validaciok
    if (formData.password !== formData.passwordConfirm) {
      setError('A jelszo es a megerosites nem egyeznek.')
      return
    }

    if (formData.password.length < 6) {
      setError('A jelszo legalabb 6 karakterbol alljon.')
      return
    }

    if (!formData.postalcode || isNaN(formData.postalcode)) {
      setError('Az iranyitoszamnak szamnak kell lennie.')
      return
    }

    setBusy(true)
    try {
      const data = await register(
        formData.name.trim(),
        formData.email.trim(),
        formData.password,
        formData.phone.trim(),
        {
          street: formData.street.trim(),
          city: formData.city.trim(),
          postalcode: parseInt(formData.postalcode),
        }
      )
      onLoginSuccess(data)
    } catch (err) {
      setError(err.message || 'Sikertelen regisztracio.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="page-shell">
      <h1>Regisztracio</h1>
      <p className="page-lead">Hozz letre egy uj fiokot az alabbi informaciokal.</p>

      <form className="register-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Nev</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label className="form-field">
          <span>E-mail</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="form-field">
          <span>Jelszo</span>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <label className="form-field">
          <span>Jelszo megerosites</span>
          <input
            type="password"
            name="passwordConfirm"
            autoComplete="new-password"
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
          />
        </label>

        <label className="form-field">
          <span>Telefonszam</span>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>

        <fieldset className="address-fieldset">
          <legend>Cim</legend>

          <label className="form-field">
            <span>Utca</span>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-field">
            <span>Varos</span>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-field">
            <span>Iranyitoszam</span>
            <input
              type="number"
              name="postalcode"
              value={formData.postalcode}
              onChange={handleChange}
              required
            />
          </label>
        </fieldset>

        {error && <p className="status status-error">{error}</p>}
        <button type="submit" className="submit-button" disabled={busy}>
          {busy ? 'Regisztracio...' : 'Regisztracio'}
        </button>
      </form>
    </main>
  )
}

export default RegisterPage
