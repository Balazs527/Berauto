function CarCard({ car }) {
  const title = [car.brand, car.model].filter(Boolean).join(" ") || "Ismeretlen modell"

  return (
    <article className="car-card">
      <h2 className="car-card-title">{title}</h2>
      <p className="car-card-row">
        <strong>Rendszam:</strong> {car.license_plate || "-"}
      </p>
      <p className="car-card-row">
        <strong>Kategoria:</strong> {car.category || "-"}
      </p>
      <p className="car-card-row">
        <strong>Ar/nap:</strong> {car.daily_price ? `${car.daily_price} Ft` : "-"}
      </p>
      <p className="car-card-row">
        <strong>Evjarat:</strong> {car.year || "-"}
      </p>
      <p className="car-card-row">
        <strong>Kilometer ora:</strong> {car.odometer ? `${car.odometer} km` : "-"}
      </p>
      <p className="car-card-row">
        <strong>Allapot:</strong> {car.available ? "elerheto" : "nem elerheto"}
      </p>
    </article>
  )
}

export default CarCard
