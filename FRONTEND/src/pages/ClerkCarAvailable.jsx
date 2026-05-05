import { useState, useEffect } from "react";
import { request } from "../services/apiClient";
import { getAllCars } from "../services/carService";

function ClerkCarAvailable() {
  const [cars, setCars] = useState([]);

 const fetchCars = async () => {
      const data = await getAllCars("clerk");
      setCars(data);
    };

  useEffect(() => {
    fetchCars()
  }, []);

  async function toggleAvailability(carId, currentAvailability) {
    try {
      await request(`/api/admin/cars/${carId}/availability`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !currentAvailability }),
      });

      fetchCars();
    } catch (error) {
      console.error("Hiba az elérhetőség módosításakor:", error);
    }
  }

  return (
    <main className="page-shell">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Rendszám</th>
            <th>Márka</th>
            <th>Modell</th>
            <th>Ár</th>
            <th>Km</th>
            <th>Kölcsönözhető</th>
          </tr>
        </thead>

        <tbody>
          {cars?.map((car) => (
            <tr key={car.id}>
              <td>{car.license_plate}</td>
              <td>{car.brand}</td>

              <td>{car.model}</td>
              <td>{car.daily_price}</td>

              <td>{car.odometer} km</td>
              <td>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={car.available}
                    onChange={() => toggleAvailability(car.id, car.available)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}



export default ClerkCarAvailable;
