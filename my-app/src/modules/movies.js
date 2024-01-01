import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/movies'

const getAll = () => {
  const response = axios.get(baseUrl)
  return response.then(response => response.data)
}

const create = newMovie => {
  const response = axios.post(baseUrl, newMovie)
  return response.then(response => response.data)
}

const remove = id => {
  const response = axios.delete(`${baseUrl}/${id}`)
  return response.then(response => response.data)
}

const update = newMovie => {
  const response = axios.put(`${baseUrl}/${newMovie.id}`, newMovie)
  return response.then(response => response.data)
}

const moduleExport = { getAll, create, remove, update }

export default moduleExport