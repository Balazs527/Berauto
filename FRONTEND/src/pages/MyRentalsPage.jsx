import { useEffect, useState } from 'react'
import { getUserRentals } from '../services/rentalService'

function MyRentalsPage() {
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try{
          const data = await getUserRentals()
          setRentals(data)
      }
      catch(err){
        setError(err.message)
      }
      finally{
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <p>Betöltés...</p>
  if (error) return <p>Hiba: {error}</p>

  return (
  <main className="page-shell">
    <h1>Kölcsönzéseim</h1>
    <p className="page-lead">
      Itt látszanak a felhasználó korábbi és aktív kölcsönzési igényei.
    </p>

    {rentals.length === 0 ? (
      <p>Nincs még kölcsönzésed.</p>
    ) : (
      <div className="table-wrapper">
        <table className="rentals-table">
          <thead>
            <tr>
              <th>Autó</th>
              <th>Rendszám</th>
              <th>Kategória</th>
              <th>Időszak</th>
              <th>Ár</th>
              <th>Státusz</th>
              <th>Átadás</th>
              <th>Visszaadás</th>
            </tr>
          </thead>

          <tbody>
            {rentals.map((rental) => (
              <tr key={rental.id}>
                <td>
                  {rental.car.brand} {rental.car.model}
                </td>

                <td>{rental.car.license_plate}</td>

                <td>{rental.car.category}</td>

                <td>
                  {rental.start_date} → {rental.end_date}
                </td>

                <td>{rental.total_price} Ft</td>

                <td>
                  <span className={`status status-${rental.status}`}>
                    {rental.status}
                  </span>
                </td>

                <td>
                  {rental.handover_at
                    ? new Date(rental.handover_at).toLocaleString()
                    : '-'}
                </td>

                <td>
                  {rental.returned_at
                    ? new Date(rental.returned_at).toLocaleString()
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </main>
)
}

export default MyRentalsPage;