import { Link } from 'react-router-dom'

function Navbar({ auth, onLogout }) {
  const guestLinks = [
    { to: '/', label: 'Fooldal' },
    { to: '/register', label: 'Regisztracio' },
    { to: '/login', label: 'Belepes' },
  ]

  const userLinks = [
    { to: '/', label: 'Fooldal' },
    { to: '/my-rentals', label: 'Kolcsonzeseim' },
    { to: '/profile', label: 'Profil' },
  ]

  const clerkLinks = [
        { to: '/clerk', label: 'Vezérlőpult' },
    { to: '/clerk/available', label: 'Kölcsönözhetőség' }
  ]

  const adminLinks = [
    { to: '/admin', label: 'Flotta kezelese' },
    { to: '/cars', label: 'Uj auto' },
  ]

  const links =
    auth.role === 'user'
      ? userLinks
      : auth.role === 'clerk'
        ? clerkLinks
        : auth.role === 'admin'
          ? adminLinks
          : guestLinks

  return (
    <header className="topbar">
      <div className="topbar-content">
        <Link to="/" className="brand">
          BerAuto
        </Link>
        <nav className="topbar-nav">
          {links.map((item) => (
            <Link key={item.to} to={item.to} className="topbar-link">
              {item.label}
            </Link>
          ))}
          {auth.isAuthenticated && (
            <button className="logout-button" onClick={onLogout}>
              Kijelentkezes
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
