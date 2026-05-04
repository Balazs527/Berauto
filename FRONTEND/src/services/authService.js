import { postJson } from './apiClient'
import { derivePrimaryRole } from '../utils/roles'

async function login(email, password) {
  const data = await postJson('/api/user/login', { email, password })
  return {
    ...data,
    primaryRole: derivePrimaryRole(data.roles),
  }
}

export { login }
