// src/redux/sessionSlice.js
import { createSlice } from '@reduxjs/toolkit'
import { destroyCookie, setCookie } from 'nookies'

interface ISession {
  mobileAd: boolean
  caniuseCookies: boolean
}

const initialState: ISession = {
  mobileAd: true,
  caniuseCookies: true,
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    closeAd: (state) => {
      state.mobileAd = false
    },
    useCookies: (state) => {
      state.caniuseCookies = false
    },
  },
})

export default sessionSlice.reducer
export const sessionActions = sessionSlice.actions
