/**
 * Elonyorend: Admin > Clerk > User (tokebb szerepkor eseten).
 */
function derivePrimaryRole(rolesArray) {
  const names = (rolesArray || [])
    .map((r) => (typeof r === 'string' ? r : r?.name))
    .filter(Boolean)
    .map((n) => String(n).toLowerCase())

  if (names.includes('admin')) return 'admin'
  if (names.includes('clerk')) return 'clerk'
  return 'user'
}

export { derivePrimaryRole }
