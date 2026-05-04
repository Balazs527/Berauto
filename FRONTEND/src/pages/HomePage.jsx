import { Link } from 'react-router-dom'

function HomePage({ auth }) {
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
        <div className="home-actions">
          <Link to="/cars" className="home-button home-button-primary">
            Autok bongeszese
          </Link>
          {!auth.isAuthenticated && (
            <>
              <Link to="/login" className="home-button">
                Belepes
              </Link>
              <Link to="/guest-rental" className="home-button">
                Vendeg berles
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="home-sections">
        <article className="home-card">
          <h2>Felhasznalo</h2>
          <ul>
            <li>Regisztracio es bejelentkezes</li>
            <li>Sajat adatok kezelese</li>
            <li>Autok megtekintese es igenyles</li>
          </ul>
        </article>

        <article className="home-card">
          <h2>Ugyintezo</h2>
          <ul>
            <li>Igenyek elfogadasa</li>
            <li>Atadas es visszavetel rogzites</li>
            <li>Szamlazas</li>
          </ul>
        </article>

        <article className="home-card">
          <h2>Adminisztrator</h2>
          <ul>
            <li>Auto felvitel, modositas, torles</li>
            <li>Kilometer ora allitas</li>
            <li>Keszlet allapot felugyelet</li>
          </ul>
        </article>
      </section>
    </main>
  )
}

export default HomePage
