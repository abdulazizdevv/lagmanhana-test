import { createSlice } from '@reduxjs/toolkit'
import { CartItem } from '@/_types'
import { v4 as uuidv4 } from 'uuid'

const initialState = {
  cart: [] as CartItem[],
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    ADD_TO_CART: (state, action) => {
      if (
        action.payload.type == 'simple' &&
        action.payload.order_modifiers.length == 0
      ) {
        const itemInCart = state.cart.find(
          (item) => item.product_id === action.payload.product_id
        )
        if (itemInCart) {
          if (!itemInCart?.default_product) itemInCart.quantity++
        } else {
          state.cart.push({
            ...action.payload,
            quantity: action.payload.quantity ? action.payload.quantity : 1,
            key: uuidv4(),
          })
        }
      } else {
        state.cart.push({
          ...action.payload,
          quantity: action.payload.quantity ? action.payload.quantity : 1,
          key: uuidv4(),
        })
      }
    },
    SET_QUANTITY: (state, action) => ({
      ...state,
      cart: state.cart.map((item) =>
        item.key === action.payload?.key
          ? { ...item, quantity: action.payload?.quantity }
          : item
      ),
    }),
    INCREMENT: (state, action) => ({
      ...state,
      cart: state.cart.map((item) =>
        item.key === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    }),
    DECREMENT: (state, action) => ({
      ...state,
      cart: state.cart.map((item) =>
        item.key === action.payload
          ? { ...item, quantity: item.quantity === 1 ? 1 : item.quantity - 1 }
          : item
      ),
    }),
    REMOVE: (state, action) => ({
      ...state,
      cart: state.cart.filter((item) => item.key !== action.payload),
    }),
    UPDATE_MODIFIERS: (state, action) => ({
      ...state,
      cart: state.cart.map((item) =>
        item.key === action.payload.key
          ? { ...item, order_modifiers: action.payload.data }
          : item
      ),
    }),
    STOP: (state, action) => {
      state.cart = state.cart.map((item) =>
        item.product_id === action.payload ? { ...item, in_stop: true } : item
      )
    },
    EXCLUDE: (state, action) => {
      state.cart = state.cart.map((item) =>
        item.product_id === action.payload && item.in_stop
          ? { ...item, in_stop: false }
          : item
      )
    },
    EXCLUDE_STOP: (state) => {
      state.cart = state.cart.map((item) =>
        item.in_stop ? { ...item, in_stop: false } : item
      )
    },
    UPDATE_PRICES: (state, action) => {
      state.cart = state.cart.map((item) => {
        const matchingRes = action.payload?.find(
          (el: any) => el.product_id === item.product_id
        )
        let allDiscountsAmount =
          matchingRes?.discounts?.length > 0
            ? matchingRes?.discounts?.reduce(
                (sum: number, obj: any) => sum + obj?.discount_price,
                0
              )
            : 0
        return {
          ...item,
          price_with_discount: item?.price + allDiscountsAmount,
        }
      })
    },
    CLEAR: (state) => ({
      ...state,
      cart: [],
    }),
  },
})

export default cartSlice.reducer
export const {
  ADD_TO_CART,
  INCREMENT,
  DECREMENT,
  REMOVE,
  SET_QUANTITY,
  UPDATE_MODIFIERS,
  CLEAR,
  STOP,
  EXCLUDE,
  EXCLUDE_STOP,
  UPDATE_PRICES,
} = cartSlice.actions
