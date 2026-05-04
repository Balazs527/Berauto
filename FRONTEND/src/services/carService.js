import { request } from "./apiClient"

async function getCars() {
  try {
    return await request("/api/car/available")
  } catch {
    return request("/api/car/available")
  }
}

export { getCars }
