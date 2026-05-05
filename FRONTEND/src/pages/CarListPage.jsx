import { useEffect, useState } from "react"
import CarCard from "../components/CarCard"
import { getCars } from "../services/carService"

function CarListPage() {
  const [cars, setCars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let isMounted = true

    async function loadCars() {
      try {
        setIsLoading(true)
        const data = await getCars()
        if (isMounted) {
          setCars(Array.isArray(data) ? data : [])
          setError("")
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Nem sikerult az autok betoltese.")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadCars()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1 className="app-title">BerAuto - Autolista</h1>
        <p className="app-subtitle">Az aktualisan elerheto autok</p>
      </header>

      {isLoading && <p className="status status-loading">Betoltes...</p>}
      {!isLoading && error && <p className="status status-error">{error}</p>}

      {!isLoading && !error && cars.length === 0 && (
        <p className="status">Nincs megjelenitheto auto.</p>
      )}

      {!isLoading && !error && cars.length > 0 && (
        <section className="car-grid">
          {cars.map((car) => (
            <CarCard key={car.id || car.plateNumber || car.name} car={car} />
          ))}
        </section>
      )}
    </main>
  )
}

export default CarListPage
