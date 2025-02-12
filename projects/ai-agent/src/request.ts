import axios from "axios"



const request = axios.create({
  baseURL: 'http://192.168.1.105:5000',
  timeout: 2000 * 10
})

export const getAxios = () => {
  return axios
}

export default request