// src/redux/settingSlice.js
import { IPoint } from '@/_types'
import { createSlice } from '@reduxjs/toolkit'
import { destroyCookie, setCookie } from 'nookies'

interface ISettings {
  country: { iso_code: string; currency: string }
}

const initialState: ISettings = {
  country: { iso_code: 'UZ', currency: 'UZS' },
}

const settingSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCountry: (state, action) => {
      state.country = action.payload
    },
  },
})

export default settingSlice.reducer
export const settingActions = settingSlice.actions
