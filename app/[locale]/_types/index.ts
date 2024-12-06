export interface IUser {
  name: string
  access_token: string
  date_of_birth: string | null
  phone: string
  id: string
}

export interface IAuthState {
  auth: {
    user: IUser | null
    isError: boolean
    isSuccess: boolean
    isLoading: boolean
    message: string
  }
}
export interface IReviews {
  count: number
  reviews: IReview[]
}

export interface IProduct {
  active_in_menu: boolean
  order: number
  categories: any[]
  ingredients: any[]
  allergens: any
  image: string
  id: string
  has_modifier: boolean
  ikpu: string
  package_code: string
  product_type: string
  barcode: string
  out_price: number
  type: string
  description: any
  title: any
  discounts: any[]
  weight: number
  fats: number
  proteins: number
  carbohydrates: number
  energy: number
  slug: string
  tags_obj: ITags[]
  rating: number
}

export interface IChildCategory {
  id: string
  title: {
    uz: string
    ru: string
    en: string
  }
  products: IProduct[]
}

export interface ICategory {
  id: string
  slug: string
  child_categories: IChildCategory[]
  products: IProduct[]
  title: {
    uz: string
    ru: string
    en: string
  }
}

export interface CartState {
  cart: CartItem[]
}

export interface CartItem {
  review?: any
  min_qty?: number
  max_qty?: number
  is_optional?: boolean
  price_with_discount: number
  in_stop: boolean
  default_product: boolean
  product_id: string
  key: string
  quantity: number
  price: number
  variants: any[]
  order_modifiers: any
  product_name: string
  category_name: string
  type: 'simple' | 'origin' | 'combo'
}

export interface IDiscount {
  id?: string
  name?: { uz: string; ru: string; en: string }
  type?: 'promo_code' | 'discount' | 'surcharge'
  discount_mode: string
  promo_code: string
  bonus_product: {
    count: number
    out_price: number
    id: string
    type: string
  }
  discount_price_for_order: number
  discount_type: 'promo_code' | 'discount' | 'surcharge'
  discount_id: string
  discount_title: { ru: string; uz: string; en: string }
}

export interface IDiscounts {
  discounts: IDiscount[]
  all_discount_price: number
  is_delivery_free: boolean
}

export interface Modifier {
  id: string
  name?: string
  title?: string
  price: number
  parent_id: string
  max_amount: number
  min_amount: number
  modifier_id: string
  is_compulsory: boolean
  modifier_price: number
  modifier_quantity: number
}

export interface IOrderSteps {
  id?: string
  address: string
  branch_id: string
  branch_name: string
  description: string
  destination_address: string
  location: {
    lat: number | null
    long: number | null
  }
  phone_number: string
  products: any[]
}

export interface IOrder {
  apartment: string
  building: string
  description: string
  accommodation: string
  aggregator_id: string | null
  client_id: string
  co_delivery_price: number
  created_at?: string
  delivery_type: string
  extra_phone_number: string
  delivery_price?: number
  external_order_id?: string
  order_amount?: number
  id?: string
  floor: string
  is_operator_call: boolean
  is_courier_call: boolean
  fare_id: string
  future_time: string | null
  is_preorder: boolean
  payment_type: string
  is_cancel_old_order: boolean
  is_reissued: boolean
  paid?: boolean
  payment: {
    [key: string]: number
  }
  payment_link?: string
  payment_type_id: string
  source: string
  steps: IOrderSteps[]
  should_card_save: boolean
  discounts?: any[]
  status_id?: string
  crm_table_id?: string
  crm_table_number?: number
  to_address: string
  to_location: { lat: number; long: number }
  client_name?: string
  courier_id?: string
  courier?: { first_name: string; last_name: string }
  client_phone_number?: string
  delivery_time?: string
  shipper_user?: { id: string; name: string }
}

export interface IReview {
  id: string
  rating: number
  review_message: string
  created_at: string
}
export interface IMenuProduct {
  externalName: string
  hallPrice: number
  id: string
  isActive: true
  menuId: string
  price: number
  productId: string
}
export interface IOrderStepsProduct {
  type: 'simple' | 'origin' | 'combo'
  order_modifiers: any[]
  variants: any[]
  quantity: number
  product_id: string
  total_amount?: number
  total_modifier_amount?: number
  review?: IReview
  image?: string
  name?: string
  id?: string
}

export interface IOrderCreateResponse {
  payment_link: string
  external_order_id: string
  order_id: string
}
export interface ITag {
  color: string
  created_at: string
  icon: string
  id: string
  slug: string
  title: {
    en: string
    ru: string
    uz: string
  }
}
export interface IWorkingHour {
  all_day: boolean
  created_at: string
  from_time: string
  id: string
  is_work: boolean
  object_id: string
  object_type: 'branch_delivery_time'
  shipper_id: string
  to_time: string
  week_day: number
}
export interface IBranch {
  address: string
  close_time: string
  created_at: string
  crm: string
  delivery_time: number
  description: { uz: string; ru: string; en: string }
  destination: string
  fare: string | null
  fare_id: string
  future_delivery_order_time: string
  future_self_pickup_order_time: string
  geozone: {
    id: string
    shipper_id: string
    name: string
    points: any[]
    created_at: string
  }
  geozone_id: string
  has_parking: boolean
  id: string
  iiko_hall_terminal_id: string
  iiko_id: string | null
  iiko_terminal_id: string | null
  images: string[]
  is_active: boolean
  jowi_id: string | null
  location: { long: number; lat: number }
  menu_id: string | null
  menu_title: string | null
  name: string
  open_time: string
  orders_limit: string
  phone: string
  phones: string[]
  radius_without_delivery_price: number
  real_time_orders_amount: number
  seats_count: number
  seo_text: { en: string; ru: string; uz: string }
  shipper_id: string
  slug: string
  tg_chat_id: string
  updated_at: string
  virtual_tour: string
  week_day: string
  work_hour_end: string
  work_hour_start: string
}

export interface IPoint {
  id: string
  address: string
  isActive: boolean
  location?: number[]
}

export interface ICartProductHook {
  isOrdered: boolean
  productInCart: any
}

export interface CategoryListResponse {
  count: number
  categories: any[]
}

export interface IModifier {
  modifier_id: string
  modifier_price: number
  modifier_quantity: number
}

export interface ISingleModifier {
  id: string
  name: string
  price: number
}

export interface IGroupModifier {
  variants: IGroupModifierVariant[]
}
export interface IGroupModifierVariant {
  id: string
  title: string
  out_price: number
}

export interface ISavedModifier {
  modifier_id: string
  modifier_price: number
  modifier_quantity: number
}
export interface IProductVariant {
  id: string
  ikpu: string
  barcode: string
  active_in_menu: boolean
  package_code: string
  product_type: string
  out_price: number
  discounts: any[]
  modifiers: {
    single_modifiers: ISingleModifier[]
    group_modifiers: IGroupModifier[]
  }
  product_property: { option_id: string }[]
  title: {
    uz: string
    ru: string
    en: string
  }
}
export interface IComBoGroup {
  id: string
  variants: IComBoVariant[]
}

export interface IComBoVariant {
  id: string
  variants: string
}

export interface IShipper {
  minimal_order_price: number
  phone: string[]
  call_center_tg: string
  address: string
  future_order_time: string
}

export interface ISourceSettings {
  sources: {
    payment_types: { label: string; value: string; is_used?: boolean }[]
    source: string
  }[]
}

export interface ILang {
  uz: string
  ru: string
  en: string
  kz: string
}

export interface ITags {
  color: string
  icon: string
  id: string
  shipper_id: string
  slug: string
  title: ILang
}

export interface IStocks {
  id: string
  description: ILang
  title: ILang
  is_active: boolean
  image: string
  shipper_id: string
  start_time: string
  end_time: string
  created_at: string
  updated_at: string
  deleted_at: string
  slug: string
}

export interface INews {
  id: string
  title: ILang
  description: ILang
  images: string[]
  from_date: string
  to_date: string
  is_active: boolean
  updated_at: string
  created_at: string
  type: string
  shipper_id: string
  slug: string
  rate: number
}

export interface IDeliveryZone {
  id: string
  points: number[]
  rgb_code: string
  min_order_amount: number
  free_delivery_order_amount: number
}
export interface ISource {
  ask_operator_call: boolean
  payment_types: any[]
  source: string
}
export interface ISavedBranch {
  id: string
  slug: string
  menu_id: string
  address: string
  name: string
  location: {
    long: number
    lat: number
  }
  future_delivery_order_time?: string
  future_self_pickup_order_time?: string
  work_hour_end: string
  work_hour_start: string
}

export interface IRedux {
  checkout: {
    payment_type: string
    card: { id: string; mask: string }
    payment_type_id: string
    payment_integration: string
    accommodation: string
    apartment: string
    building: string
    floor: string
    description: string
    destination: string
    future_time: string | null
    is_courier_call: boolean
    is_operator_call: boolean
    is_preorder: boolean
    // not in this context but doesnt worth for another slice
    city: string
  }
  auth: {
    user: IUser
    isError: boolean
    isSuccess: boolean
    isLoading: boolean
    message: string
    activeWindow: string
  }
  common: {
    points: IPoint[]
    isMapModalLg: boolean
    isMapModal: boolean
    deliveryType: string
    location: [number, number] | null
    filter_by_tags: string[]
    filter_by: string
    branch: ISavedBranch
    categoryRef: any
    orderIds: any
    deliveryZoneId: string | null
    searchedProduct: string
    editingPoint: IPoint | null
    creatingPoint: boolean
  }
  cart: {
    cart: CartItem[]
  }
  settings: {
    country: { iso_code: 'UZ' | 'KZ'; currency: string }
  }
  session: {
    mobileAd: boolean
    caniuseCookies: boolean
  }
}

export interface IGallery {
  id: string
  title: ILang
  description: ILang
  images: string[]
  from_date: string
  to_date: string
  is_active: boolean
  updated_at: string
  created_at: string
  type: string
  shipper_id: string
  slug: string
}

export interface IVacancy {
  id: string
  title: ILang
  description: ILang
  is_active: boolean
  updated_at: string
  created_at: string
  shipper_id: string
  slug: string
}
