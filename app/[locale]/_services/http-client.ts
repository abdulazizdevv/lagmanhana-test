import axios from 'axios'
import { getUser } from '@/_utils/getStore'
import { store } from '@/_store'
import { authActions } from '@/_store/auth/auth.slice'

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export const request = axios.create({
  baseURL: baseUrl,
  headers: {
    Shipper: process.env.NEXT_PUBLIC_SHIPPER_ID,
    Platform: 'website',
  },
})

// ? TEST
// Shipper: 'd4b1658f-3271-4973-8591-98a82939a664',
// 56f1eb03-1885-48b1-a2a6-3c8024cc7e4e
request.interceptors.request.use(
  (config) => {
    if (config.headers) {
      const user = getUser()
      if (user?.access_token) {
        config.headers.Authorization = user?.access_token
      }
    }
    return config
  },
  (error) => errorHandler(error)
)

const errorHandler = (error: any) => {
  if (error && error.response) {
    if (error.response.status === 401 || error.response.status === 403) {
      if (typeof window !== 'undefined') {
        store.dispatch(authActions.logout())
      }
    } else if (error == 'Error: Request failed with status code 401') {
      store.dispatch(authActions.logout())
    }

    return Promise.reject(error.response)
  }

  return Promise.reject(error.response)
}
