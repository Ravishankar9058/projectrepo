import axios from 'axios'

export async function loginApi(username, password) {
  const credentials = btoa(`${username}:${password}`)
  const res = await axios.get('/api/auth/login', {
    headers: { Authorization: `Basic ${credentials}` },
  })
  return { credentials, user: res.data }
}
