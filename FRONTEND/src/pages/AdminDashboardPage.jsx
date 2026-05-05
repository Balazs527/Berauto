import { useState, useEffect } from "react";
import { request } from "../services/apiClient";

function AdminDashboardPage() {
  const [cars, setCars] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedCar, setEditedCar] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [newCar, setNewCar] = useState({
    license_plate: "",
    brand: "",
    model: "",
    daily_price: 0,
    odometer: 0,
    available: true,
  });

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    const data = await request("/api/admin/cars");
    setCars(data);
  }

  function startEdit(car) {
    setEditingId(car.id);
    setEditedCar({ ...car });
  }

  async function saveEdit(id) {
    await request(`/api/admin/cars/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedCar),
    });

    setEditingId(null);
    setEditedCar({});
    fetchCars();
  }

  async function deleteCar(id) {
    if (!confirm("Biztos törlöd?")) return;

    await request(`/api/admin/cars/${id}`, {
      method: "DELETE",
    });

    fetchCars();
  }

  async function createCar() {
    await request("/api/admin/cars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCar),
    });

    setShowModal(false);

    setNewCar({
      license_plate: "",
      brand: "",
      model: "",
      daily_price: 0,
      odometer: 0,
      available: true,
    });

    fetchCars();
  }

  return (
    <main className="page-shell">
      <h1>Admin dashboard</h1>

      <button onClick={() => setShowModal(true)}>➕ Új autó</button>

      {/* MODAL */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Új autó</h2>

            <input
              placeholder="Rendszám"
              value={newCar.license_plate}
              onChange={(e) =>
                setNewCar({ ...newCar, license_plate: e.target.value })
              }
            />

            <input
              placeholder="Márka"
              value={newCar.brand}
              onChange={(e) =>
                setNewCar({ ...newCar, brand: e.target.value })
              }
            />

            <input
              placeholder="Modell"
              value={newCar.model}
              onChange={(e) =>
                setNewCar({ ...newCar, model: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Napi ár"
              value={newCar.daily_price}
              onChange={(e) =>
                setNewCar({
                  ...newCar,
                  daily_price: Number(e.target.value),
                })
              }
            />

            <input
              type="number"
              placeholder="Kilométer"
              value={newCar.odometer}
              onChange={(e) =>
                setNewCar({
                  ...newCar,
                  odometer: Number(e.target.value),
                })
              }
            />

            <label>
              Elérhető:
              <input
                type="checkbox"
                checked={newCar.available}
                onChange={(e) =>
                  setNewCar({
                    ...newCar,
                    available: e.target.checked,
                  })
                }
              />
            </label>

            <button onClick={createCar}>Mentés</button>
            <button onClick={() => setShowModal(false)}>Mégse</button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Rendszám</th>
            <th>Márka</th>
            <th>Modell</th>
            <th>Ár</th>
            <th>Km</th>
            <th>Elérhető</th>
            <th>Műveletek</th>
          </tr>
        </thead>

        <tbody>
          {cars?.map((car) => (
            <tr key={car.id}>
              <td>
                {editingId === car.id ? (
                  <input
                    value={editedCar.license_plate}
                    onChange={(e) =>
                      setEditedCar({
                        ...editedCar,
                        license_plate: e.target.value,
                      })
                    }
                  />
                ) : (
                  car.license_plate
                )}
              </td>

              <td>
                {editingId === car.id ? (
                  <input
                    value={editedCar.brand}
                    onChange={(e) =>
                      setEditedCar({
                        ...editedCar,
                        brand: e.target.value,
                      })
                    }
                  />
                ) : (
                  car.brand
                )}
              </td>

              <td>
                {editingId === car.id ? (
                  <input
                    value={editedCar.model}
                    onChange={(e) =>
                      setEditedCar({
                        ...editedCar,
                        model: e.target.value,
                      })
                    }
                  />
                ) : (
                  car.model
                )}
              </td>

              <td>
                {editingId === car.id ? (
                  <input
                    type="number"
                    value={editedCar.daily_price}
                    onChange={(e) =>
                      setEditedCar({
                        ...editedCar,
                        daily_price: Number(e.target.value),
                      })
                    }
                  />
                ) : (
                  car.daily_price
                )}
              </td>

              <td>
                {editingId === car.id ? (
                  <input
                    type="number"
                    value={editedCar.odometer}
                    onChange={(e) =>
                      setEditedCar({
                        ...editedCar,
                        odometer: Number(e.target.value),
                      })
                    }
                  />
                ) : (
                  car.odometer
                )}
              </td>

              <td>
                {editingId === car.id ? (
                  <input
                    type="checkbox"
                    checked={editedCar.available}
                    onChange={(e) =>
                      setEditedCar({
                        ...editedCar,
                        available: e.target.checked,
                      })
                    }
                  />
                ) : car.available ? (
                  "✔"
                ) : (
                  "❌"
                )}
              </td>

              <td>
                {editingId === car.id ? (
                  <>
                    <button onClick={() => saveEdit(car.id)}>💾</button>
                    <button onClick={() => setEditingId(null)}>❌</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(car)}>✏️</button>
                    <button onClick={() => deleteCar(car.id)}>🗑️</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default AdminDashboardPage;