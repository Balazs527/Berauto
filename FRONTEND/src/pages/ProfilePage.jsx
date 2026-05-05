import { useState } from 'react'
import { updateProfile } from '../services/authService'

function ProfilePage({ auth, onProfileUpdate }) {
  const u = auth.user
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    phone: u?.phone || '',
    address: {
      city: u?.address?.city || '',
      street: u?.address?.street || '',
      postalcode: u?.address?.postalcode || '',
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const addressField = name.replace('address.', '')
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]:
            addressField === 'postalcode' ? parseInt(value) || '' : value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSave = async () => {
    setError('')
    setIsLoading(true)
    try {
      const result = await updateProfile(
        formData.phone,
        formData.address,
        auth.token
      )
      onProfileUpdate(result)
      setIsEditing(false)
    } catch (err) {
      setError(err.message || 'Hiba történt a profil frissítésekor')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      phone: u?.phone || '',
      address: {
        city: u?.address?.city || '',
        street: u?.address?.street || '',
        postalcode: u?.address?.postalcode || '',
      },
    })
    setError('')
    setIsEditing(false)
  }

  return (
    <main className="page-shell">
      <h1>Profil</h1>
      {u && (
        <>
          <p className="page-lead">
            Szerepkor:{' '}
            <strong>{(auth.role || '').toUpperCase()}</strong>
          </p>

          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

          {isEditing ? (
            <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>
                  Telefon:
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>

              <fieldset className="profile-address">
                <legend>Lakcím</legend>

                <div className="form-group">
                  <label>
                    Város:
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                </div>

                <div className="form-group">
                  <label>
                    Utca:
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                </div>

                <div className="form-group">
                  <label>
                    Irányítószám:
                    <input
                      type="number"
                      name="address.postalcode"
                      value={formData.address.postalcode}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                </div>
              </fieldset>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? 'Mentés...' : 'Mentés'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="btn-secondary"
                >
                  Mégse
                </button>
              </div>
            </form>
          ) : (
            <>
              <dl className="profile-dl">
                <dt>Név</dt>
                <dd>{u.name || '-'}</dd>
                <dt>E-mail</dt>
                <dd>{u.email || '-'}</dd>
                <dt>Telefon</dt>
                <dd>{u.phone || '-'}</dd>
                {u.address && (
                  <>
                    <dt>Lakcím</dt>
                    <dd>
                      {u.address.postalcode} {u.address.city},{' '}
                      {u.address.street}
                    </dd>
                  </>
                )}
                <dt>Szerepkorok (API)</dt>
                <dd>
                  {(u.roles || [])
                    .map((r) => r?.name)
                    .filter(Boolean)
                    .join(', ') || '-'}
                </dd>
              </dl>

              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Szerkesztés
              </button>
            </>
          )}
        </>
      )}
    </main>
  )
}

export default ProfilePage
