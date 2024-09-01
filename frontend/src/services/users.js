import axios from 'axios'
const baseUrl = '/api/users'

let token = null

const setToken = (newToken) => {
  token = newToken
}

const getAllUsers = async () => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  const response = await axios.get(baseUrl, config)
  return response.data
}

const updateUser = async (id, updatedData) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  const response = await axios.put(`${baseUrl}/${id}`, updatedData, config)
  return response.data
}

const deleteUser = async (id) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAllUsers, setToken, updateUser, deleteUser }