import { useEffect, useState } from "react";
import { request } from "../services/apiClient";

function ClerkDashboardPage() {
  const [view, setView] = useState("all");
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'handover' vagy 'return' vagy 'invoice'
  const [selectedRental, setSelectedRental] = useState(null);
  const [odometerValue, setOdometerValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function fetchData() {
    setLoading(true);
    setError(null);

    try {
      let allRentals = [];

      // Az "all" view-ban mindent letöltünk
      if (view === "all") {
        const requests = await request("/api/clerk/rentals/requests");
        const running = await request("/api/clerk/rentals/running");
        const expired = await request("/api/clerk/rentals/expired");
        allRentals = [...requests, ...running, ...expired];
      } else if (view === "requests") {
        allRentals = await request("/api/clerk/rentals/requests");
      } else if (view === "running") {
        allRentals = await request("/api/clerk/rentals/running");
      } else if (view === "expired") {
        allRentals = await request("/api/clerk/rentals/expired");
      }

      setRentals(allRentals);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [view]);

  // ACTIONS
  async function accept(id) {
    setActionError(null);
    try {
      await request(`/api/clerk/rentals/${id}/accept`, { method: "POST" });
      fetchData();
    } catch (err) {
      setActionError(err.message);
    }
  }

  function openHandoverModal(rental) {
    setSelectedRental(rental);
    setModalType("handover");
    setOdometerValue(rental.car.odometer || "");
    setModalOpen(true);
    setActionError(null);
  }

  function openReturnModal(rental) {
    setSelectedRental(rental);
    setModalType("return");
    setOdometerValue(rental.start_odometer || "");
    setModalOpen(true);
    setActionError(null);
  }

  function openInvoiceModal(rental) {
    setSelectedRental(rental);
    setModalType("invoice");
    setModalOpen(true);
    setActionError(null);
  }

  async function submitHandover() {
    if (!odometerValue) {
      setActionError("Kérjük, adja meg az odometer értékét!");
      return;
    }

    setIsSubmitting(true);
    setActionError(null);
    try {
      await request(`/api/clerk/rentals/${selectedRental.id}/handover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start_odometer: parseInt(odometerValue) }),
      });
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitReturn() {
    if (!odometerValue) {
      setActionError("Kérjük, adja meg az odometer értékét!");
      return;
    }

    setIsSubmitting(true);
    setActionError(null);
    try {
      await request(`/api/clerk/rentals/${selectedRental.id}/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ end_odometer: parseInt(odometerValue) }),
      });
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitInvoice() {
    setIsSubmitting(true);
    setActionError(null);
    try {
      await request(`/api/clerk/rentals/${selectedRental.id}/invoice`, {
        method: "POST",
      });
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedRental(null);
    setModalType(null);
    setOdometerValue("");
    setActionError(null);
  }

  const getStatusLabel = (status) => {
    const labels = {
      requested: "Igény beérkezett",
      accepted: "Elfogadva",
      handed_over: "Autó átadva",
      returned: "Autó visszavétele",
    };
    return labels[status] || status;
  };

  return (
    <main className="page-shell">
      <h1>Ügyintéző Dashboard</h1>

      {/* FILTER BUTTONS */}
      <div className="filter-bar">
        <button
          onClick={() => setView("all")}
          style={{
            backgroundColor: view === "all" ? "#124b8c" : "#fff",
            color: view === "all" ? "#fff" : "#111827",
          }}
        >
          Összes
        </button>
        <button
          onClick={() => setView("running")}
          style={{
            backgroundColor: view === "running" ? "#124b8c" : "#fff",
            color: view === "running" ? "#fff" : "#111827",
          }}
        >
          Futó
        </button>
        <button
          onClick={() => setView("expired")}
          style={{
            backgroundColor: view === "expired" ? "#124b8c" : "#fff",
            color: view === "expired" ? "#fff" : "#111827",
          }}
        >
          Lejárt
        </button>
      </div>

      {actionError && (
        <p style={{ color: "red", marginBottom: "1rem" }}>{actionError}</p>
      )}

      {loading && <p>Betöltés...</p>}
      {error && <p style={{ color: "red" }}>Hiba: {error}</p>}

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="clerk-table">
          <thead>
            <tr>
              <th>Autó</th>
              <th>Ügyfél</th>
              <th>Időszak</th>
              <th>Státusz</th>
              <th>Műveletek</th>
            </tr>
          </thead>

          <tbody>
            {rentals.map((r) => (
              <tr key={r.id}>
                <td>
                  {r.car.brand} {r.car.model}
                  <br />
                  {r.car.license_plate}
                </td>

                <td>
                  {r.customer?.name || r.user?.name || "Ismeretlen felhasználó"}
                  <br />
                  {r.customer?.email || r.user?.email || "-"}
                </td>

                <td>
                  {r.start_date} → {r.end_date}
                </td>

                <td>
                  <strong>{getStatusLabel(r.status)}</strong>
                </td>

                <td>
                  {/* REQUESTED - Elfogadás */}
                  {r.status === "requested" && (
                    <button className="btn-primary" onClick={() => accept(r.id)}>
                      Elfogadás
                    </button>
                  )}

                  {/* ACCEPTED - Átadás */}
                  {r.status === "accepted" && (
                    <button
                      className="btn-primary"
                      onClick={() => openHandoverModal(r)}
                    >
                      Autó átadása
                    </button>
                  )}

                  {/* HANDED_OVER - Visszavétel */}
                  {r.status === "handed_over" && (
                    <button
                      className="btn-primary"
                      onClick={() => openReturnModal(r)}
                    >
                      Autó visszavétele
                    </button>
                  )}

                  {/* RETURNED - Számla */}
                  {r.status === "returned" && (
                    <button
                      className="btn-primary"
                      onClick={() => openInvoiceModal(r)}
                    >
                      Számla létrehozása
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            {modalType === "handover" && (
              <>
                <h2>Autó átadása</h2>
                <p>
                  <strong>
                    {selectedRental.car.brand} {selectedRental.car.model}
                  </strong>
                  <br />
                  Rendszám: {selectedRental.car.license_plate}
                </p>
                {actionError && (
                  <p style={{ color: "red", marginBottom: "1rem" }}>
                    {actionError}
                  </p>
                )}
                <div className="form-group">
                  <label>
                    Odometer érték (km):
                    <input
                      type="number"
                      value={odometerValue}
                      onChange={(e) => setOdometerValue(e.target.value)}
                      disabled={isSubmitting}
                      min="0"
                    />
                  </label>
                </div>
                <div className="form-actions">
                  <button
                    className="btn-primary"
                    onClick={submitHandover}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Feldolgozás..." : "Átadás megerősítése"}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={closeModal}
                    disabled={isSubmitting}
                  >
                    Mégse
                  </button>
                </div>
              </>
            )}

            {modalType === "return" && (
              <>
                <h2>Autó visszavétele</h2>
                <p>
                  <strong>
                    {selectedRental.car.brand} {selectedRental.car.model}
                  </strong>
                  <br />
                  Rendszám: {selectedRental.car.license_plate}
                  <br />
                  Átadott km: {selectedRental.start_odometer}
                </p>
                {actionError && (
                  <p style={{ color: "red", marginBottom: "1rem" }}>
                    {actionError}
                  </p>
                )}
                <div className="form-group">
                  <label>
                    Jelenlegi odometer érték (km):
                    <input
                      type="number"
                      value={odometerValue}
                      onChange={(e) => setOdometerValue(e.target.value)}
                      disabled={isSubmitting}
                      min={selectedRental.start_odometer}
                    />
                  </label>
                </div>
                <div className="form-actions">
                  <button
                    className="btn-primary"
                    onClick={submitReturn}
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Feldolgozás..."
                      : "Visszavétel megerősítése"}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={closeModal}
                    disabled={isSubmitting}
                  >
                    Mégse
                  </button>
                </div>
              </>
            )}

            {modalType === "invoice" && (
              <>
                <h2>Számla létrehozása</h2>
                <p>
                  <strong>
                    {selectedRental.car.brand} {selectedRental.car.model}
                  </strong>
                  <br />
                  Ügyfél:{" "}
                  {selectedRental.customer?.name ||
                    selectedRental.user?.name ||
                    "Ismeretlen"}
                </p>

                <div className="invoice-preview">
                  <div className="invoice-row">
                    <span>Napi ár:</span>
                    <strong>
                      {selectedRental.car.daily_price.toLocaleString(
                        "hu-HU"
                      )}{" "}
                      Ft
                    </strong>
                  </div>
                  <div className="invoice-row">
                    <span>Időszak:</span>
                    <strong>
                      {selectedRental.start_date} - {selectedRental.end_date}
                    </strong>
                  </div>
                  <div className="invoice-row">
                    <span>Bruttó összeg:</span>
                    <strong>
                      {Math.round(
                        selectedRental.total_price * 1.27
                      ).toLocaleString("hu-HU")}{" "}
                      Ft
                    </strong>
                  </div>
                </div>

                {actionError && (
                  <p style={{ color: "red", marginBottom: "1rem" }}>
                    {actionError}
                  </p>
                )}
                <div className="form-actions">
                  <button
                    className="btn-primary"
                    onClick={submitInvoice}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Feldolgozás..." : "Számla kibocsátása"}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={closeModal}
                    disabled={isSubmitting}
                  >
                    Mégse
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default ClerkDashboardPage;
