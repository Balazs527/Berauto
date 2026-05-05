const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8888'

async function parseErrorBody(response) {
  try {
    const data = await response.json()
    if (typeof data.message === 'string') return data.message
    if (typeof data.detail === 'string') return data.detail
  } catch {
    /* nem JSON */
  }
  return `API hiba (${response.status})`
}

async function request(path, options = {}) {
  const { method = 'GET', headers = {}, body, ...rest } = options
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...getAuthHeader(),
      ...headers,
    },
    body,
    ...rest,
  })
  if (!response.ok) {
    const msg = await parseErrorBody(response)
    throw new Error(msg)
  }
  const text = await response.text()
  if (!text) return null
  return JSON.parse(text)
}

async function getJson(path) {
  return request(path, { method: 'GET' })
}

/**
 * JSON body küldése (pl. POST /api/user/login)
 */
async function postJson(path, jsonBody, extraHeaders = {}) {
  return request(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: JSON.stringify(jsonBody),
  })
}

/**
 * JSON body küldése PUT kérésként (pl. PUT /api/user/profile)
 */
async function putJson(path, jsonBody, extraHeaders = {}) {
  return request(path, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: JSON.stringify(jsonBody),
  })
}

function getAuthHeader() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export { API_BASE_URL, request, getJson, postJson, putJson, parseErrorBody }
