import axios from 'axios'
const baseUrl = '/api/tiingo'

const getTicker = async (ticker) => {
  /*
  const config = {
    headers: {
      Authorization: token,
    },
  }
  */
  const response = await axios.post(baseUrl, { ticker })
  return response.data
}

export default { getTicker }