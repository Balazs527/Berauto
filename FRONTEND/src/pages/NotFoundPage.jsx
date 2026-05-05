import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="page-shell">
      <h1>404 - Az oldal nem talalhato</h1>
      <Link className="home-button home-button-primary" to="/">
        Vissza a fooldalra
      </Link>
    </main>
  )
}

export default NotFoundPage
