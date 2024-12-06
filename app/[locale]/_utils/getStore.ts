import { store } from '@/_store'

export function getUser() {
  return store.getState().auth.user
}

export function getCurrency() {
  return store.getState().settings?.country?.currency
}
