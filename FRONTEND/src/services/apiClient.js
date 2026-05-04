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

export { API_BASE_URL, request, getJson, postJson, parseErrorBody }
