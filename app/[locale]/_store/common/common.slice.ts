// src/redux/commonSlice.js
import { IPoint, ISavedBranch } from '@/_types'
import { createSlice } from '@reduxjs/toolkit'
import { destroyCookie, setCookie } from 'nookies'

interface ICommonState {
  filter_by_tags: string[]

  filter_by: string
  isMapModal: boolean
  isMapModalLg: boolean
  location: number[] | null
  deliveryType: string
  branch: any
  orderIds: any
  deliveryZoneId: string | null
  searchedProduct: string
  editingPoint: IPoint | null
  creatingPoint: boolean
  points: any[]
}

const initialState: ICommonState = {
  filter_by_tags: [],
  filter_by: '',
  isMapModal: false,
  isMapModalLg: false,
  location: null,
  deliveryType: 'delivery',
  branch: null,
  orderIds: null,
  deliveryZoneId: null,
  searchedProduct: '',
  editingPoint: null,
  creatingPoint: false,
  points: [],
}

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setFilterTags: (state, action) => {
      state.filter_by_tags = action.payload
      setCookie(null, 'filtered_by_tags', action.payload, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })
    },
    setFilter: (state, action) => {
      state.filter_by = action.payload
    },
    setDeliveryZoneId: (state, action) => {
      state.deliveryZoneId = action.payload
    },
    findProduct: (state, action) => {
      state.searchedProduct = action.payload
    },
    clearSearch: (state) => {
      state.searchedProduct = ''
    },
    saveDeliveryType: (state, action) => {
      state.deliveryType = action.payload
      setCookie(null, 'delivery_type', action.payload, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })
    },
    saveBranchData: (state, action: { payload: ISavedBranch }) => {
      state.branch = action.payload
      setCookie(null, 'branch_id', action.payload?.id, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })
      setCookie(null, 'branch_slug', action.payload?.slug, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })
      setCookie(null, 'menu_id', action.payload?.menu_id, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })
    },
    clearBranchData: (state) => {
      state.branch = null
      destroyCookie(null, 'branch_id')
      destroyCookie(null, 'branch_slug')
      destroyCookie(null, 'menu_id')
    },
    onOpenMap: (state) => {
      state.isMapModal = true
    },
    onCloseMap: (state) => {
      state.isMapModal = false
      state.editingPoint = null
      state.creatingPoint = false
    },
    saveLocation: (state, action) => {
      state.location = action.payload
    },
    removeUserLocation: (state) => {
      state.location = null
    },
    setOrderIds: (state, action) => {
      state.orderIds = action.payload
    },
    setMapModalLg: (state, action) => {
      state.isMapModalLg = action.payload
    },
    clearOrderIds: (state) => {
      state.orderIds = null
    },
    createPoint: (state) => {
      state.isMapModal = true
      state.creatingPoint = true
      state.deliveryType = 'delivery'
    },
    openPoint: (state, action) => {
      state.isMapModal = true
      state.editingPoint = action.payload
      state.deliveryType = 'delivery'
    },
    savePoint: (state, action) => {
      state.points = state.points
        .filter((item) => item.address !== action.payload?.address)
        .map((item) => ({ ...item, isActive: false }))
      state.points.push(action.payload)
      state.location = action.payload.location
      state.editingPoint = null
    },
    updatePoint: (state, action) => {
      state.points = state.points.map((item) =>
        item.id === state.editingPoint?.id
          ? action.payload
          : { ...item, isActive: false }
      )
      state.location = action.payload.location
      state.editingPoint = null
    },
    activatePoint: (state, action) => {
      const selectedPoint = state.points.find(
        (item) => item.id === action.payload
      )
      if (selectedPoint) {
        state.points = state.points.map((item) =>
          item.id !== selectedPoint.id
            ? { ...item, isActive: false }
            : { ...item, isActive: true }
        )
        state.location = selectedPoint.location
      }
    },
    removePoint: (state, action) => {
      state.points = state.points.filter((item) => item.id !== action.payload)
    },
  },
})

export default commonSlice.reducer
export const {
  createPoint,
  openPoint,
  setFilterTags,
  setFilter,
  saveLocation,
  removeUserLocation,
  setOrderIds,
  saveDeliveryType,
  saveBranchData,
  clearOrderIds,
  savePoint,
  setMapModalLg,
  updatePoint,
  removePoint,
  activatePoint,
  onOpenMap,
  onCloseMap,
  findProduct,
  clearSearch,
  clearBranchData,
  setDeliveryZoneId,
} = commonSlice.actions
