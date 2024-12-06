import { createSlice } from '@reduxjs/toolkit'
import { destroyCookie, setCookie } from 'nookies'

interface IState {
  user: {
    name: string
    date_of_birth: string
    access_token: string
  } | null
  isError: boolean
  isSuccess: boolean
  isLoading: boolean
  message: string
  activeWindow: string
}

const initialState: IState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  activeWindow: 'login',
}

export const { actions: authActions, reducer: authReducer } = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ''
    },
    logout: () => {
      destroyCookie(null, 'user_id')
      destroyCookie(null, 'access_token')
      return initialState
    },
    setUser: (state, action) => {
      state.user = action.payload
      setCookie(null, 'user_id', action.payload?.id, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })
      setCookie(null, 'access_token', action.payload?.access_token, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })
    },
    setActiveWindow: (state, action) => {
      state.activeWindow = action.payload
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user.name = action.payload.name
        state.user.date_of_birth = action.payload.date_of_birth
      }
    },
  },
})
