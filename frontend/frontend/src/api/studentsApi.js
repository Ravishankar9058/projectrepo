import apiClient from './apiClient'

export async function fetchStudents(schoolId) {
  const res = await apiClient.get(`/schools/${schoolId}/students`)
  return res.data
}

export async function createStudent(schoolId, data) {
  const res = await apiClient.post(`/schools/${schoolId}/students`, {
    ...data,
    age: Number(data.age),
  })
  return res.data
}

export async function updateStudent(schoolId, studentId, data) {
  const res = await apiClient.put(`/schools/${schoolId}/students/${studentId}`, {
    ...data,
    age: Number(data.age),
  })
  return res.data
}

export async function deleteStudent(schoolId, studentId) {
  await apiClient.delete(`/schools/${schoolId}/students/${studentId}`)
}
