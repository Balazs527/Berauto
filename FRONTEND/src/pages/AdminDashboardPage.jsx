import { useState, useEffect } from "react";
import { request } from "../services/apiClient";
import { getAllCars } from "../services/carService";
import { MdSpeed, MdSave, MdClose, MdAdd  } from "react-icons/md";

function AdminDashboardPage() {
  const [cars, setCars] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedCar, setEditedCar] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isOdometerOpen, setOdometerOpen] = useState(false);

  const [newCar, setNewCar] = useState({
    license_plate: "",
    brand: "",
    model: "",
    daily_price: 0,
    odometer: 0,
    available: true,
    active: true,
    category: "",
    description: "",
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    const data = await getAllCars();
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
      active: true,
      category: "",
      description: "",
      year: new Date().getFullYear(),
    });

    fetchCars();
  }

function openOdometerModel(car) {

  setEditedCar(car);
  setOdometerOpen(true);
}

  async function saveOdometer() {
    try {
      await request(`/api/admin/cars/${editedCar.id}/odometer`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ odometer: editedCar.odometer }),
      });

      fetchCars();
    } catch (error) {
      console.error("Hiba az elérhetőség módosításakor:", error);
    }
    finally {
      setOdometerOpen(false);
    }
  }

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
      <h1>Admin dashboard</h1>

      <button 
        onClick={() => setShowModal(true)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 16px",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
          transition: "background-color 0.2s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
      >
        <MdAdd size={18} />
        Új autó
      </button>

      {/* MODAL */}
      {showModal && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <MdAdd  size={24} color="#3b82f6" />
              <h2 style={styles.modalCardTitle}>Új autó hozzáadása</h2>
              <button
                onClick={() => setShowModal(false)}
                style={styles.closeButton}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#transparent")}
              >
                <MdClose size={20} />
              </button>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Rendszám *</label>
                  <input
                    style={styles.input}
                    placeholder="pl. ABC-123"
                    value={newCar.license_plate}
                    onChange={(e) =>
                      setNewCar({ ...newCar, license_plate: e.target.value })
                    }
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Márka *</label>
                  <input
                    style={styles.input}
                    placeholder="pl. Toyota"
                    value={newCar.brand}
                    onChange={(e) =>
                      setNewCar({ ...newCar, brand: e.target.value })
                    }
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Modell *</label>
                  <input
                    style={styles.input}
                    placeholder="pl. Corolla"
                    value={newCar.model}
                    onChange={(e) =>
                      setNewCar({ ...newCar, model: e.target.value })
                    }
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Év</label>
                  <input
                    style={styles.input}
                    type="number"
                    placeholder="pl. 2023"
                    value={newCar.year}
                    onChange={(e) =>
                      setNewCar({ ...newCar, year: Number(e.target.value) })
                    }
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Kategória</label>
                  <input
                    style={styles.input}
                    placeholder="pl. Sedan"
                    value={newCar.category}
                    onChange={(e) =>
                      setNewCar({ ...newCar, category: e.target.value })
                    }
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Napi ár *</label>
                  <input
                    style={styles.input}
                    type="number"
                    placeholder="pl. 50"
                    value={newCar.daily_price}
                    onChange={(e) =>
                      setNewCar({
                        ...newCar,
                        daily_price: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Kilométer</label>
                  <input
                    style={styles.input}
                    type="number"
                    placeholder="pl. 0"
                    value={newCar.odometer}
                    onChange={(e) =>
                      setNewCar({
                        ...newCar,
                        odometer: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
                  <label style={styles.label}>Leírás</label>
                  <textarea
                    style={{ ...styles.input, minHeight: "80px", resize: "none" }}
                    placeholder="Autó leírása..."
                    value={newCar.description}
                    onChange={(e) =>
                      setNewCar({ ...newCar, description: e.target.value })
                    }
                  />
                </div>

                <div style={styles.checkboxGroup}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={newCar.active}
                      onChange={(e) =>
                        setNewCar({ ...newCar, active: e.target.checked })
                      }
                    />
                    Aktív
                  </label>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={newCar.available}
                      onChange={(e) =>
                        setNewCar({ ...newCar, available: e.target.checked })
                      }
                    />
                    Elérhető
                  </label>
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                style={styles.buttonCancel}
                onClick={() => setShowModal(false)}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#e5e7eb")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "#f3f4f6")
                }
              >
                <MdClose size={16} />
                Mégse
              </button>
              <button
                style={styles.buttonSave}
                onClick={createCar}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#2563eb")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "#3b82f6")
                }
              >
                <MdSave size={16} />
                Autó hozzáadása
              </button>
            </div>
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
            <th>Kölcsönözhető</th>
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
                  <>
                    <span>{car.odometer}</span>
                    <button
                      onClick={() => openOdometerModel(car) }
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: "8px",
                        padding: "6px",
                        borderRadius: "6px",
                        border: "1px solid #d1d5db",
                        backgroundColor: "#f9fafb",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#f3f4f6";
                        e.target.style.borderColor = "#9ca3af";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = "#f9fafb";
                        e.target.style.borderColor = "#d1d5db";
                      }}
                      aria-label="Kilométeróra szerkesztése"
                    >
                      <MdSpeed size={16} />
                    </button>
                  </>
                )}
                {isOdometerOpen && (
                  <div style={styles.backdrop}>
                    <div style={styles.modal}>
                      <div style={styles.modalHeader}>
                        <MdSpeed size={20} color="#10b981" />
                        <h3 style={styles.modalTitle}>Kilométeróra módosítása</h3>
                      </div>

                      <input
                        type="number"
                        style={styles.modalInput}
                        value={editedCar.odometer}
                        onChange={(e) =>
                          setEditedCar({
                            ...editedCar,
                            odometer: Number(e.target.value),
                          })
                        }
                        placeholder="Pl. 125000"
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#10b981")
                        }
                        onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                      />

                      <div style={styles.buttonGroup}>
                        <button
                          style={styles.buttonCancel}
                          onClick={() => setOdometerOpen(false) }
                          onMouseOver={(e) =>
                            (e.target.style.backgroundColor = "#e5e7eb")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.backgroundColor = "#f3f4f6")
                          }
                        >
                          <MdClose size={16} />
                          Mégse
                        </button>
                        <button
                          style={styles.buttonSave}
                          onClick={() => {
                            saveOdometer();
                          }}
                          onMouseOver={(e) =>
                            (e.target.style.backgroundColor = "#059669")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.backgroundColor = "#10b981")
                          }
                        >
                          <MdSave size={16} />
                          Mentés
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </td>

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

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "transparent",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingTop: "20px",
    paddingRight: "20px",
  },
  modal: {
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    minWidth: "380px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
    border: "1px solid #e5e7eb",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: "600",
    margin: 0,
    color: "#111827",
  },
  modalInput: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "20px",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
  },
  buttonSave: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  buttonCancel: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  
  // Új autó modal stílusok
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalCard: {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    maxWidth: "600px",
    width: "90%",
    maxHeight: "90vh",
    overflow: "auto",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "24px",
    borderBottom: "1px solid #e5e7eb",
    position: "relative",
  },
  modalCardTitle: {
    fontSize: "20px",
    fontWeight: "600",
    margin: 0,
    color: "#111827",
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    right: "24px",
    top: "24px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    transition: "background-color 0.2s",
    color: "#6b7280",
  },
  modalContent: {
    padding: "24px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "6px",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    transition: "border-color 0.2s, box-shadow 0.2s",
    outline: "none",
  },
  checkboxGroup: {
    display: "flex",
    gap: "20px",
    gridColumn: "1 / -1",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#374151",
    cursor: "pointer",
  },
  modalFooter: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
    padding: "24px",
    borderTop: "1px solid #e5e7eb",
  },
};

export default AdminDashboardPage;
