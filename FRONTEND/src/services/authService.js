import { postJson, putJson } from './apiClient'
import { derivePrimaryRole } from '../utils/roles'

async function login(email, password) {
  const data = await postJson('/api/user/login', { email, password })
  return {
    ...data,
    primaryRole: derivePrimaryRole(data.roles),
  }
}

async function register(name, email, password, phone, address) {
  const data = await postJson('/api/user/registrate', {
    name,
    email,
    password,
    phone,
    address,
  })
  return {
    ...data,
    primaryRole: derivePrimaryRole(data.roles),
  }
}

async function updateProfile(phone, address, token) {
  const data = await putJson(
    '/api/user/profile',
    { phone, address },
    { Authorization: `Bearer ${token}` }
  )
  return {
    ...data,
    primaryRole: derivePrimaryRole(data.roles),
  }
}

export { login, register, updateProfile }
