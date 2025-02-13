import axios from "axios"

// console.log('import.meta.env.VITE_BASE_URL', import.meta.env.VITE_BASE_URL)

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 2000 * 10
})

export const getAxios = () => {
  return axios
}

export default request