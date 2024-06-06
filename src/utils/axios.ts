import axios, { AxiosRequestHeaders } from 'axios'
import useStore from '../store/store'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:9091/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})
axiosInstance.interceptors.request.use((config) => {
  const { token } = useStore.getState()
  if (token) {
    config.headers = { Authorization: `Bearer ${token}` } as AxiosRequestHeaders
  }
  return config
})

export default axiosInstance
