import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import sessionStorage from 'redux-persist/lib/storage/session'
import cartReducer from './cart/cart.slice'
import commonReducer from './common/common.slice'
import checkoutReducer from './checkout/checkout.slice'
import settingsReducer from './settings/settings.slice'
import sessionReducer from './session/session.slice'
import { authReducer } from './auth/auth.slice'

const authConfig = {
  key: 'auth',
  version: 1,
  storage,
}
const cartConfig = {
  key: 'cart',
  version: 1,
  storage,
}
const commonConfig = {
  key: 'common',
  version: 1,
  storage,
}
const settingsConfig = {
  key: 'settings',
  version: 1,
  storage,
}
const checkoutConfig = {
  key: 'checkout',
  version: 1,
  storage: sessionStorage,
}
const sessionConfig = {
  key: 'session',
  version: 1,
  storage: sessionStorage,
}

const rootReducer = combineReducers({
  auth: persistReducer(authConfig, authReducer),
  cart: persistReducer(cartConfig, cartReducer),
  common: persistReducer(commonConfig, commonReducer),
  checkout: persistReducer(checkoutConfig, checkoutReducer),
  settings: persistReducer(settingsConfig, settingsReducer),
  session: persistReducer(sessionConfig, sessionReducer),
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export let persistor = persistStore(store)
export type IRootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
