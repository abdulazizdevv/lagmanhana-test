import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  payment_type: 'cash',
  card: { id: '', mask: '' },
  payment_type_id: '',
  payment_integration: '',
  accommodation: '',
  apartment: '',
  building: '',
  floor: '',
  description: '',
  destination: '',
  future_time: null,
  is_courier_call: true,
  is_operator_call: true,
  is_preorder: false,
  // not in this context but doesnt worth for another slice
  city: '',
}

const checkoutSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    saveCard: (state, action) => {
      state.card = action.payload
    },
    setCity: (state, action) => {
      state.city = action.payload
    },
    changePaymentIntegration: (state, action) => {
      state.payment_integration = action.payload
    },
    changePaymentId: (state, action) => {
      state.payment_type_id = action.payload
    },
    changePaymentType: (state, action) => {
      state.payment_type = action.payload
    },
    changeDestination: (state, action) => {
      state.destination = action.payload
    },
    changeAccommodation: (state, action) => {
      state.accommodation = action.payload
    },
    changeApartment: (state, action) => {
      state.apartment = action.payload
    },
    changeBuilding: (state, action) => {
      state.building = action.payload
    },
    changeFloor: (state, action) => {
      state.floor = action.payload
    },
    changeDescription: (state, action) => {
      state.description = action.payload
    },
    changeFutureTime: (state, action) => {
      state.future_time = action.payload
      state.is_preorder = action.payload ? true : false
    },
    changeCourierCall: (state, action) => {
      state.is_courier_call = action.payload
    },
    changeOperatorCall: (state, action) => {
      state.is_operator_call = action.payload
    },
    clear: (state) => ({ ...initialState }),
  },
})

export default checkoutSlice.reducer
export const checkoutActions = checkoutSlice.actions
