import { postJson, getJson } from './apiClient'

async function requestRentalAsUser(carId, startDate, endDate, token) {
  return postJson(
    '/api/user/rentals/request',
    {
      car_id: carId,
      start_date: startDate,
      end_date: endDate,
    },
    { Authorization: `Bearer ${token}` }
  )
}

async function requestRentalAsGuest(carId, startDate, endDate, customer) {
  return postJson('/api/rental/request', {
    car_id: carId,
    start_date: startDate,
    end_date: endDate,
    customer,
  })
}

async function getUserRentals() {
  return getJson('/api/user/rentals');
}

export { requestRentalAsUser, requestRentalAsGuest, getUserRentals }
