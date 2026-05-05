import { request } from "./apiClient"

async function getCars() {
  try {
    return await request("/api/car/available")
  } catch(err) {
      console.error(err);
      throw err;
  }
}

async function getAllCars() {
  try {
    return await request("/api/admin/cars")
  } catch(err) {
    console.error(err);
    throw err;
  }
}

export { getCars, getAllCars }
