import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCars } from '../services/carService'
import { requestRentalAsUser, requestRentalAsGuest } from '../services/rentalService'

function HomePage({ auth }) {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCar, setSelectedCar] = useState(null)
  const [showGuestForm, setShowGuestForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [rentalDates, setRentalDates] = useState({
    startDate: '',
    endDate: '',
  })

  const [guestData, setGuestData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      city: '',
      street: '',
      postalcode: '',
    },
  })

  useEffect(() => {
    loadCars()
  }, [])

  const loadCars = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getCars()
      setCars(data || [])
    } catch (err) {
      setError(err.message || 'Hiba az autók lekérésekor')
    } finally {
      setLoading(false)
    }
  }

  const handleRentalClick = (car) => {
    setSelectedCar(car)
    setRentalDates({ startDate: '', endDate: '' })
    if (!auth.isAuthenticated) {
      setShowGuestForm(true)
      setGuestData({
        name: '',
        email: '',
        phone: '',
        address: {
          city: '',
          street: '',
          postalcode: '',
        },
      })
    }
  }

  const handleDateChange = (e) => {
    const { name, value } = e.target
    setRentalDates((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleGuestDataChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const addressField = name.replace('address.', '')
      setGuestData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]:
            addressField === 'postalcode' ? parseInt(value) || '' : value,
        },
      }))
    } else {
      setGuestData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmitUserRental = async () => {
    if (!rentalDates.startDate || !rentalDates.endDate) {
      setError('Kérjük, válasszon dátumokat!')
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      await requestRentalAsUser(
        selectedCar.id,
        rentalDates.startDate,
        rentalDates.endDate,
        auth.token
      )
      setSelectedCar(null)
      setRentalDates({ startDate: '', endDate: '' })
      alert('Kölcsönzési igény elküldve!')
    } catch (err) {
      setError(err.message || 'Hiba az igény elküldésekor')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitGuestRental = async () => {
    if (!rentalDates.startDate || !rentalDates.endDate) {
      setError('Kérjük, válasszon dátumokat!')
      return
    }
    if (!guestData.name || !guestData.email || !guestData.phone) {
      setError('Kérjük, töltsön ki minden kötelező adatot!')
      return
    }
    if (
      !guestData.address.city ||
      !guestData.address.street ||
      !guestData.address.postalcode
    ) {
      setError('Kérjük, töltsön ki a teljes címet!')
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      await requestRentalAsGuest(selectedCar.id, rentalDates.startDate, rentalDates.endDate, {
        name: guestData.name,
        email: guestData.email,
        phone: guestData.phone,
        address: guestData.address,
      })
      setSelectedCar(null)
      setShowGuestForm(false)
      setRentalDates({ startDate: '', endDate: '' })
      alert('Kölcsönzési igény elküldve!')
    } catch (err) {
      setError(err.message || 'Hiba az igény elküldésekor')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    setSelectedCar(null)
    setShowGuestForm(false)
    setRentalDates({ startDate: '', endDate: '' })
    setError('')
  }

  return (
    <main className="home-shell">
      <section className="home-hero">
        <p className="home-kicker">BerAuto</p>
        <h1 className="home-title">Autokolcsonzes egyszeruen</h1>
        <p className="home-description">
          A rendszerben felhasznalok, ugyintezok es adminisztratorok dolgoznak
          kulon szerepkorokkel. Itt tudod majd elerni az autolistat,
          regisztraciot, bejelentkezest es a sajat folyamatokat.
        </p>
      </section>

      <section className="home-available-cars">
        <h2>Elérhető autók</h2>
        {loading && <p>Autók betöltése...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && cars.length === 0 && <p>Jelenleg nincsenek elérhető autók.</p>}
        {!loading && cars.length > 0 && (
          <div className="car-grid">
            {cars.map((car) => (
              <div key={car.id} className="car-card">
                <h3 className="car-card-title">
                  {car.brand} {car.model}
                </h3>
                <div className="car-card-row">
                  <strong>Rendszám:</strong> {car.license_plate}
                </div>
                <div className="car-card-row">
                  <strong>Kategória:</strong> {car.category}
                </div>
                <div className="car-card-row">
                  <strong>Év:</strong> {car.year}
                </div>
                <div className="car-card-row">
                  <strong>Napi ár:</strong> {car.daily_price.toLocaleString('hu-HU')} Ft
                </div>
                <div className="car-card-row">
                  <strong>Leírás:</strong> {car.description}
                </div>
                <button
                  className="btn-primary"
                  onClick={() => handleRentalClick(car)}
                  style={{ marginTop: '0.75rem', width: '100%' }}
                >
                  Kölcsönzés
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

   

      {selectedCar && !showGuestForm && auth.isAuthenticated && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Kölcsönzés: {selectedCar.brand} {selectedCar.model}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="form-group">
              <label>
                Kezdődátum:
                <input
                  type="date"
                  name="startDate"
                  value={rentalDates.startDate}
                  onChange={handleDateChange}
                  required
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Végdátum:
                <input
                  type="date"
                  name="endDate"
                  value={rentalDates.endDate}
                  onChange={handleDateChange}
                  required
                />
              </label>
            </div>
            <div className="form-actions">
              <button
                className="btn-primary"
                onClick={handleSubmitUserRental}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Elküldés...' : 'Igény beküldése'}
              </button>
              <button
                className="btn-secondary"
                onClick={handleCloseModal}
                disabled={isSubmitting}
              >
                Mégsem
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCar && showGuestForm && !auth.isAuthenticated && (
        <div className="modal-overlay">
          <div className="modal-content modal-large">
            <h2>Kölcsönzés: {selectedCar.brand} {selectedCar.model}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={(e) => e.preventDefault()}>
              <h3>Személyes adatok</h3>
              <div className="form-group">
                <label>
                  Név:
                  <input
                    type="text"
                    name="name"
                    value={guestData.name}
                    onChange={handleGuestDataChange}
                    required
                  />
                </label>
              </div>
              <div className="form-group">
                <label>
                  E-mail:
                  <input
                    type="email"
                    name="email"
                    value={guestData.email}
                    onChange={handleGuestDataChange}
                    required
                  />
                </label>
              </div>
              <div className="form-group">
                <label>
                  Telefon:
                  <input
                    type="tel"
                    name="phone"
                    value={guestData.phone}
                    onChange={handleGuestDataChange}
                    required
                  />
                </label>
              </div>

              <h3>Lakcím</h3>
              <div className="form-group">
                <label>
                  Város:
                  <input
                    type="text"
                    name="address.city"
                    value={guestData.address.city}
                    onChange={handleGuestDataChange}
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
                    value={guestData.address.street}
                    onChange={handleGuestDataChange}
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
                    value={guestData.address.postalcode}
                    onChange={handleGuestDataChange}
                    required
                  />
                </label>
              </div>

              <h3>Kölcsönzés dátumai</h3>
              <div className="form-group">
                <label>
                  Kezdődátum:
                  <input
                    type="date"
                    name="startDate"
                    value={rentalDates.startDate}
                    onChange={handleDateChange}
                    required
                  />
                </label>
              </div>
              <div className="form-group">
                <label>
                  Végdátum:
                  <input
                    type="date"
                    name="endDate"
                    value={rentalDates.endDate}
                    onChange={handleDateChange}
                    required
                  />
                </label>
              </div>

              <div className="form-actions">
                <button
                  className="btn-primary"
                  onClick={handleSubmitGuestRental}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Elküldés...' : 'Igény beküldése'}
                </button>
                <button
                  className="btn-secondary"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Mégsem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default HomePage
