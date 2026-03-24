import apiClient from './apiClient'

export async function fetchSchools() {
  const res = await apiClient.get('/schools')
  return res.data
}

export async function fetchSchoolById(id) {
  const res = await apiClient.get(`/schools/${id}`)
  return res.data
}
