function ProfilePage({ auth }) {
  const u = auth.user

  return (
    <main className="page-shell">
      <h1>Profil</h1>
      {u && (
        <>
          <p className="page-lead">
            Szerepkor:{' '}
            <strong>{(auth.role || '').toUpperCase()}</strong>
          </p>
          <dl className="profile-dl">
            <dt>Nev</dt>
            <dd>{u.name || '-'}</dd>
            <dt>E-mail</dt>
            <dd>{u.email || '-'}</dd>
            <dt>Telefon</dt>
            <dd>{u.phone || '-'}</dd>
            {u.address && (
              <>
                <dt>Lakcim</dt>
                <dd>
                  {u.address.postalcode} {u.address.city},{' '}
                  {u.address.street}
                </dd>
              </>
            )}
            <dt>Szerepkorok (API)</dt>
            <dd>
              {(u.roles || [])
                .map((r) => r?.name)
                .filter(Boolean)
                .join(', ') || '-'}
            </dd>
          </dl>
        </>
      )}
      <p className="page-lead">
        Itt kesobb szerkesztheto lesz a lakcim es a telefonszam.
      </p>
    </main>
  )
}

export default ProfilePage
