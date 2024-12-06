'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import {
  CartItem,
  IBranch,
  IDiscounts,
  IOrder,
  IOrderStepsProduct,
  IOrderSteps,
  IShipper,
  IRedux,
} from '@/_types'
import { useI18n } from '@/_locales/client'
import useDebounce from '@/_hooks/useDebounce'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import {
  getBranchById,
  getBranchDeliveryHours,
  getNearestBranch,
} from '@/_services/branches'
import orderService from '@/_services/orderService'
import { useRouter, useSearchParams } from 'next/navigation'
import { getProductFavourites } from '@/_services/products'
import {
  discountWithProductsRequest,
  getDiscountWithOrderPrice,
} from '@/_services/discountService'
import { CLEAR, UPDATE_PRICES } from '@/_store/cart/cart.slice'
import { getComputedPrice } from '@/_services/fareService'
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react'
import { checkoutActions } from '@/_store/checkout/checkout.slice'
import { onOpenMap, setOrderIds } from '@/_store/common/common.slice'
import DeliveryDetails from './components/Delivery'
import TimeDetails from './components/Time'
import Products from './components/Products'
import Payment from './components/Payment'
import Recommended from './components/Recommended'
import Bill from './components/Bill'
import Promocode from './components/Promocode'
import MoreDetails from './components/MoreDetails'
import Cashback from './components/Cashback'
import UserData from './components/UserData'
import BackIcon from '@/_assets/icons/BackIcon'
import RedirectLoading from './components/RedirectLoading'
import { getSettings } from '@/_services/settings'
import ConfirmModal from '@/_components/ConfirmModal'
import OrderTimePicker from '@/_components/OrderTimePicker'
import dayjs from 'dayjs'

interface IProps {
  shipper: IShipper
  settingsV3: any
}

export default function Checkout({ shipper, settingsV3 }: IProps) {
  const { user } = useSelector((state: IRedux) => state.auth)
  const cartState = useSelector((state: IRedux) => state.cart)
  const commonState = useSelector((state: IRedux) => state.common)
  const checkoutState = useSelector((state: IRedux) => state.checkout)

  const [totalPrice, setTotalPrice] = useState(0)
  const [isPreorder, setPreorder] = useState(false)
  const [isTimePicker, setTimePicker] = useState(false)
  const [isCreateLoading, setCreateLoading] = useState(false)
  const [discounts, setDiscounts] = useState<IDiscounts | null>(null)
  const [reProducts, setReProducts] = useState<CartItem[] | null>(null)
  const [nearestBranch, setNearestBranch] = useState<IBranch | null>(null)
  const [stepsData, setStepsData] = useState<IOrderSteps>({
    address: '',
    branch_id: '',
    branch_name: '',
    description: '',
    destination_address: '',
    location: {
      lat: null,
      long: null,
    },
    phone_number: '',
    products: [],
  })
  const [orderData, setOrderData] = useState<IOrder>({
    aggregator_id: null,
    accommodation: '',
    apartment: '',
    building: '',
    description: '',
    client_id: user?.id,
    co_delivery_price: 0,
    delivery_type: 'delivery',
    extra_phone_number: '',
    floor: '',
    fare_id: '',
    is_courier_call: true,
    is_operator_call: false,
    is_cancel_old_order: false,
    is_reissued: false,
    paid: false,
    payment: {
      cash: 0,
    },
    should_card_save: false,
    future_time: null,
    is_preorder: false,
    payment_type: '',
    payment_type_id: '',
    source: 'website',
    steps: [],
    to_address: '',
    to_location: { lat: 41.26935630336735, long: 69.23841858451905 },
  })

  const { co_delivery_price } = orderData

  const t = useI18n()
  const toast = useToast()
  const router = useRouter()
  const dispatch = useDispatch()
  const productsId = useRef('')
  const searchParams = useSearchParams()

  const repeat = searchParams?.get('repeat')
  const oid = searchParams?.get('oid')

  const debouncedPrice = useDebounce(totalPrice, 300)

  const productIdsCounts = useMemo(() => {
    let myObj: { [key: string]: number } = {}
    for (const product of cartState?.cart) {
      myObj[product?.product_id] = product?.quantity
    }
    return myObj
  }, [cartState?.cart])

  const sourceV3: any = useMemo(
    () => settingsV3?.sources?.find((item: any) => item.source === 'website'),
    [settingsV3?.sources]
  )

  const {
    data: branchData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['branch-by-id', commonState?.branch?.id],
    queryFn: () =>
      getBranchById(commonState?.branch?.id).then((res) => res.data),
    enabled: Boolean(
      commonState?.deliveryType == 'self-pickup' && commonState?.branch?.id
    ),
  })

  const { data: reorderData } = useQuery({
    queryKey: ['re-order', oid],
    queryFn: () => orderService.getById(oid || '').then((res) => res.data),
    enabled: Boolean(repeat == 'true' && oid),
  })

  const { data: favourites }: UseQueryResult<{ favourites: any[] }, Error> =
    useQuery({
      queryKey: ['product-favourites', productsId],
      queryFn: () =>
        getProductFavourites({
          product_ids: productsId.current,
          menu_id: commonState?.branch?.menu_id
            ? commonState?.branch?.menu_id
            : '',
          fields:
            'image,discounts,description,barcode,product_type,tags,type,slug,has_modifier',
        }).then((res) => res.data),
    })

  const discountParams = useMemo(
    () => ({
      order_sources: 'website',
      branch_ids: commonState?.branch?.id,
      // payment_types: checkoutState?.payment_type,
      payment_type_id: checkoutState?.payment_type_id,
      only_delivery: commonState?.deliveryType === 'delivery',
      only_self_pickup: commonState?.deliveryType === 'self-pickup',
      for_order_amount: debouncedPrice,
      delivery_price: co_delivery_price,
      client_id: user?.id,
      product_ids_counts: JSON.stringify(productIdsCounts),
      lat: commonState?.branch?.location?.lat,
      long: commonState?.branch?.location?.long,
    }),
    [
      commonState?.branch?.id,
      commonState?.branch?.location?.lat,
      commonState?.branch?.location?.long,
      co_delivery_price,
      debouncedPrice,
      commonState?.deliveryType,
      checkoutState?.payment_type_id,
      productIdsCounts,
      user?.id,
    ]
  )

  const debouncedParams = useDebounce(discountParams, 300)

  // Get order discount
  const { data: discountWithOrderPrice } = useQuery({
    queryKey: ['DISCOUNT_WITH_ORDER_PRICE', debouncedParams],
    queryFn: () => getDiscountWithOrderPrice(debouncedParams),
    enabled: Boolean(debouncedPrice && !orderData?.payment?.['cashback']),
  })

  useEffect(() => {
    if (discountWithOrderPrice) {
      const currentPromo = discounts?.discounts?.find(
        (item) => item.discount_type === 'promo_code'
      )
      if (currentPromo) {
        if (discountWithOrderPrice?.discounts?.length > 0) {
          setDiscounts({
            ...discountWithOrderPrice,
            all_discount_price:
              (discountWithOrderPrice?.all_discount_price || 0) +
              currentPromo?.discount_price_for_order,
            discounts: [...discountWithOrderPrice?.discounts, currentPromo],
          })
        } else {
          setDiscounts({
            all_discount_price: currentPromo?.discount_price_for_order,
            is_delivery_free: false,
            discounts: [currentPromo],
          })
        }
      } else {
        setDiscounts(discountWithOrderPrice)
      }
    }
  }, [discountWithOrderPrice])

  const discountWithProductsParams = {
    order_source: 'website',
    branch_id: commonState?.branch?.id,
    product_ids: String(
      cartState?.cart?.map((product: CartItem) => product.product_id)
    ),
    only_delivery: commonState?.deliveryType === 'delivery',
    only_self_pickup: commonState?.deliveryType === 'self-pickup',
    client_id: user?.id,
  }

  const { data: discountWithProducts } = useQuery({
    queryKey: ['DISCOUNT_WITH_PRODUCTS', discountWithProductsParams],
    queryFn: () => discountWithProductsRequest(discountWithProductsParams),
    enabled: totalPrice && cartState?.cart?.length > 0 ? true : false,
  })

  const { data: settingsData } = useQuery({
    queryKey: ['get-settings-list'],
    queryFn: () =>
      getSettings({ fields: 'time_distance_priority' }).then(
        (res) => res?.data
      ),
  })

  useEffect(() => {
    if (discountWithProducts) {
      dispatch(
        UPDATE_PRICES(discountWithProducts?.data?.products_with_discounts)
      )
    }
  }, [discountWithProducts])

  const onChangePaymentData = (data: any) => {
    setOrderData((prevState) => ({
      ...prevState,
      payment_type_id: data,
    }))
  }

  const findBranchToPreorder = (
    lat: number,
    long: number,
    date_time?: string
  ) => {
    getBranchDeliveryHours({ lat, long, date_time })
      .then((res) => {
        if (res?.data?.branches) {
          setNearestBranch(res?.data?.branches[0])
          return
        }
        setNearestBranch(null)
      })
      .catch((err) => console.log(err))
  }

  const findNearestBranch = useCallback(
    async (lat: number, long: number) => {
      getNearestBranch(lat, long)
        .then((res) => {
          if (res?.data?.branches?.length > 0) {
            for (let branch of res?.data?.branches) {
              if (branch.is_active) {
                setNearestBranch(branch)
                return
              }
            }
          }

          if (settingsData?.settings?.[0]?.value?.value) {
            setNearestBranch(null)
            setPreorder(true)
          } else {
            findBranchToPreorder(lat, long)
          }
        })
        .catch((err) => console.log(err))
    },
    [settingsData]
  )

  const onFutureTimeChange = (val: string) => {
    dispatch(checkoutActions.changeFutureTime(val))
    findBranchToPreorder(
      orderData.to_location.lat,
      orderData.to_location.long,
      val
    )
    setTimePicker(false)
  }

  useEffect(() => {
    if (nearestBranch?.id && commonState?.location?.[0]) {
      setStepsData((prevState) => ({
        ...prevState,
        address: nearestBranch?.address,
        branch_id: nearestBranch?.id,
        branch_name: nearestBranch?.name,
        destination_address: nearestBranch?.destination,
        phone_number: nearestBranch?.phone,
        location: {
          lat: nearestBranch?.location.lat,
          long: nearestBranch?.location.long,
        },
      }))
      getComputedPrice({
        branch_id: nearestBranch?.id,
        lat: commonState?.location[0],
        long: commonState?.location[1],
        order_price: debouncedPrice,
        delivery_zone_id: commonState?.deliveryZoneId,
      })
        .then((res) => {
          setOrderData((prevState) => ({
            ...prevState,
            co_delivery_price: res.price ? res.price : 0,
          }))
        })
        .catch((err) => console.log(err))
    }
  }, [
    debouncedPrice,
    nearestBranch?.id,
    commonState?.location,
    commonState?.deliveryZoneId,
    nearestBranch,
  ])

  const isCourierCallValidate = () => {
    if (commonState?.deliveryType == 'delivery') {
      if (
        !checkoutState?.is_courier_call &&
        checkoutState?.accommodation &&
        checkoutState?.floor &&
        checkoutState?.apartment &&
        checkoutState?.building
      ) {
        return true
      } else if (checkoutState?.is_courier_call) {
        return true
      } else {
        if (
          !checkoutState?.accommodation ||
          !checkoutState?.floor ||
          !checkoutState?.apartment ||
          !checkoutState?.building
        ) {
          toast({
            title: '',
            description:
              'Введите номер вашего дома или позвольте курьеру позвонить вам',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
          return false
        }
        return true
      }
    } else {
      return true
    }
  }

  const onAccumulate = useCallback(
    (amount: number) => {
      let payment = { ...orderData?.payment }
      payment['cashback'] = amount
      payment[checkoutState?.payment_type] = totalPrice - amount

      setOrderData((prevState) => ({
        ...prevState,
        payment,
      }))
      setDiscounts({
        all_discount_price: 0,
        discounts: [],
        is_delivery_free: false,
      })
    },
    [checkoutState?.payment_type, orderData?.payment, totalPrice]
  )
  const onSubmit = () => {
    if (isError) {
      return toast({
        title: 'Проблема с филиалом!',
        description: 'Пожалуйста, выберите другой филиал ресторана',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
    if (totalPrice > shipper?.minimal_order_price) {
      setCreateLoading(true)
      // Filtering Reordering products data
      const steps = repeat && {
        ...stepsData,
        products: reProducts?.map((product) => ({
          price: product.price,
          product_id: product.product_id,
          type: product.type,
          variants: product.variants,
          quantity: product.quantity,
          order_modifiers: product.order_modifiers,
        })),
      }
      let bonusProducts = []

      if (discounts?.discounts && discounts?.discounts?.length > 0) {
        for (const item of discounts?.discounts) {
          if (item?.discount_mode === 'bonus_product') {
            bonusProducts.push({
              price: item?.bonus_product?.out_price,
              product_id: item?.bonus_product?.id,
              type: item?.bonus_product?.type,
              quantity: item?.bonus_product?.count,
              client_id: user?.id,
              order_modifiers: [],
              variants: [],
            })
          }
        }
      }

      const promocode: any =
        discounts?.discounts &&
        discounts?.discounts?.length > 0 &&
        discounts?.discounts?.find(
          (item) => item.discount_type === 'promo_code'
        )

      let payment = []
      if (Object.keys(orderData?.payment)?.length > 1) {
        for (const key in orderData?.payment) {
          if (Object.hasOwnProperty?.call(orderData?.payment, key)) {
            const element = orderData?.payment[key]

            if (element > 0) {
              let payment_type_id = ''
              if (key === 'cashback') {
                payment_type_id = ''
              } else {
                payment_type_id =
                  checkoutState.payment_type !== 'cashback'
                    ? checkoutState.payment_type_id
                    : ''
              }

              payment.push({
                paid_amount: element,
                payment_type: key,
                payment_type_id: payment_type_id,
              })
            }
          }
        }
      } else {
        payment = [
          {
            paid_amount: totalPrice,
            payment_type: checkoutState?.payment_type,
            payment_type_id:
              checkoutState?.payment_type !== 'cashback'
                ? checkoutState.payment_type_id
                : '',
          },
        ]
      }
      const data = {
        ...orderData,
        accommodation: checkoutState?.accommodation,
        apartment: checkoutState?.apartment,
        description: checkoutState?.description,
        building: checkoutState?.building,
        floor: checkoutState?.floor,
        payment,
        card_mask:
          checkoutState?.payment_integration === 'epay'
            ? checkoutState?.card?.mask
            : '',
        card_id:
          checkoutState?.payment_integration === 'epay'
            ? checkoutState?.card?.id
            : '',
        payment_type: checkoutState?.payment_type,
        payment_type_id: checkoutState.payment_type_id,
        discounts: promocode ? [{ id: promocode.discount_id }] : undefined,
        delivery_type: commonState?.deliveryType,
        future_time: checkoutState?.future_time
          ? checkoutState?.future_time
          : null,
        is_preorder: checkoutState?.is_preorder,
        is_courier_call: checkoutState?.is_courier_call,
        is_operator_call: 'false',
        steps: repeat
          ? [steps]
          : [
              {
                ...stepsData,
                products: [...stepsData.products, ...bonusProducts],
              },
            ],
      }

      orderService
        .create(data)
        .then((res) => {
          // googleAnalytics({
          //   bonusProducts: bonusProducts,
          //   promocode: promocode?.promo_code,
          //   external_order_id: res.data?.external_order_id,
          // })
          // sendGTM(bonusProducts, promocode?.promo_code)
          dispatch(
            setOrderIds({
              external_order_id: res.data.external_order_id,
              order_id: res.data.order_id,
              payment_link: res.data.payment_link,
            })
          )
          dispatch(CLEAR())
          dispatch(checkoutActions.clear())

          if (
            checkoutState?.payment_type_id ===
            '753b3df0-ce35-4edb-9f26-8f03c65379e0'
          ) {
            router.push('/checkout/kaspi?id=' + res.data.order_id)
          } else {
            router.push('/orders?id=' + res.data.order_id)
          }
        })
        .catch((error) => {
          // toast({
          //   title: (
          //     <>
          //       {(error?.data?.Error?.message ?? error?.data?.Error) ||
          //         error?.data?.message ||
          //         error?.response?.data?.Error ||
          //         error?.Error}
          //     </>
          //   ),

          //   status: 'error',
          //   duration: 3000,
          //   isClosable: true,
          // })
          toast({
            title: (
              <>
                {(typeof error?.data?.Error?.message === 'string'
                  ? error?.data?.Error?.message
                  : '') ||
                  (typeof error?.data?.Error === 'string'
                    ? error?.data?.Error
                    : '') ||
                  (typeof error?.data?.message === 'string'
                    ? error?.data?.message
                    : '') ||
                  (typeof error?.response?.data?.Error === 'string'
                    ? error?.response?.data?.Error
                    : '') ||
                  (typeof error?.Error === 'string'
                    ? error?.Error
                    : 'Произошла ошибка')}
              </>
            ),
            status: 'error',
            duration: 3000,
            isClosable: true,
          })

          setCreateLoading(false)
        })
    }
  }

  // Set delivery details & Get delivery price
  useEffect(() => {
    if (commonState?.deliveryType == 'delivery') {
      if (commonState?.points.length > 0) {
        for (const point of commonState?.points) {
          if (point.isActive) {
            setOrderData((prevState) => ({
              ...prevState,
              to_address: point.address,
              to_location: {
                lat: point?.location?.[0] || 0,
                long: point?.location?.[1] || 0,
              },
            }))
            findNearestBranch(
              point?.location?.[0] || 0,
              point?.location?.[1] || 0
            )
            break
          }
        }
      } else if (!oid) {
        dispatch(onOpenMap())
      }
    } else if (commonState?.deliveryType == 'self-pickup') {
      if (commonState?.branch) {
        setOrderData((prevState) => ({
          ...prevState,
          co_delivery_price: 0,
          to_address: '',
          to_location: { lat: 41.26935630336735, long: 69.23841858451905 },
        }))
      } else if (!oid) {
        dispatch(onOpenMap())
      }
    } else if (!oid) {
      dispatch(onOpenMap())
    }
  }, [commonState?.points, commonState?.deliveryType, findNearestBranch])

  // Set branch details to state
  useEffect(() => {
    if (branchData) {
      setStepsData((prevState) => ({
        ...prevState,
        address: branchData.address,
        branch_id: branchData.id,
        branch_name: branchData.name,
        destination_address: branchData.destination,
        phone_number: branchData.phone,
        location: {
          lat: branchData?.location?.lat,
          long: branchData?.location?.long,
        },
      }))
    }
  }, [branchData])

  // Add Products to steps
  useEffect(() => {
    if (!repeat && cartState?.cart.length > 0) {
      const productArr: any[] = []
      for (const item of cartState?.cart) {
        const mockProduct: IOrderStepsProduct = {
          type: item.type,
          order_modifiers: [],
          variants: item.variants,
          quantity: item.quantity,
          product_id: item.product_id,
        }
        if (item.order_modifiers.length > 0) {
          for (const modifier of item.order_modifiers) {
            mockProduct.order_modifiers.push({
              ...modifier,
              modifier_quantity:
                item.quantity > 1
                  ? modifier.modifier_quantity * item.quantity
                  : modifier.modifier_quantity,
            })
          }
        }
        productArr.push(mockProduct)
      }
      setStepsData((prevState: IOrderSteps) => ({
        ...prevState,
        products: productArr,
      }))
    } else if (repeat == 'true' && oid && reorderData) {
      setOrderData({
        aggregator_id: null,
        accommodation: reorderData?.accommodation ?? '',
        apartment: reorderData?.apartment ?? '',
        building: reorderData?.building ?? '',
        client_id: user?.id,
        co_delivery_price: 0,
        delivery_type: reorderData?.delivery_type,
        description: reorderData?.description ?? '',
        floor: reorderData?.floor ?? '',
        is_courier_call: reorderData?.is_courier_call,
        is_operator_call: reorderData?.is_operator_call,
        extra_phone_number: '',
        future_time: null,
        id: '',
        fare_id: '',
        is_cancel_old_order: false,
        is_preorder: false,
        is_reissued: false,
        paid: false,
        payment: {
          [reorderData?.payment_type ?? 'cash']: 0,
          payment_type_id: reorderData?.payment_type_id,
        },
        payment_type: reorderData?.payment_type,
        payment_type_id: reorderData?.payment_type_id,
        should_card_save: false,
        source: 'website',
        steps: [],
        to_address: reorderData?.to_address ?? '',
        to_location: reorderData?.to_location ?? {},
      })
      setStepsData({
        address: reorderData?.steps[0].address ?? '',
        branch_id: reorderData?.steps[0].branch_id ?? '',
        branch_name: reorderData?.steps[0].branch_name ?? '',
        description: reorderData?.steps[0].description ?? '',
        destination_address: reorderData?.steps[0].destination_address ?? '',
        location: reorderData?.steps[0].location ?? '',
        phone_number: reorderData?.steps[0].phone_number ?? '',
        products: [],
      })
      // Products in steps
      if (!reProducts) {
        const reorderingProducts = []
        for (const item of reorderData?.steps[0].products) {
          const mockProduct: CartItem = {
            key: uuidv4(),
            price: item.price,
            product_id: item.product_id,
            type: item.type,
            variants: item.variants,
            quantity: item.quantity,
            order_modifiers: [],
            in_stop: false,
            price_with_discount: item.total_amount,
            default_product: item.default_product,
            product_name: item.name,
            category_name: item.category_name,
          }
          if (item.order_modifiers.length > 0) {
            for (const modifier of item.order_modifiers) {
              mockProduct.order_modifiers.push({
                ...modifier,
                modifier_quantity:
                  item.quantity > 1
                    ? modifier.modifier_quantity * item.quantity
                    : modifier.modifier_quantity,
              })
            }
          }
          reorderingProducts.push(mockProduct)
        }
        setReProducts(reorderingProducts)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartState?.cart, user, repeat, oid, reorderData])
  useEffect(() => {
    if (
      sourceV3?.payment_types_obj?.length > 0 &&
      !checkoutState.payment_type_id
    ) {
      dispatch(
        checkoutActions.changePaymentId(sourceV3?.payment_types_obj[0]?.id)
      )
      dispatch(
        checkoutActions.changePaymentType(sourceV3?.payment_types_obj[0]?.type)
      )
      dispatch(
        checkoutActions.changePaymentIntegration(
          sourceV3?.payment_types_obj[0]?.integration
        )
      )
      setOrderData((prevState) => ({
        ...prevState,
        payment_type_id: sourceV3?.payment_types_obj[0]?.id,
      }))
    }
  }, [sourceV3?.payment_types_obj])

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user, router])

  useEffect(() => {
    // Get products and modifiers total price
    const productIdsArr = []
    if (!repeat && cartState?.cart.length > 0) {
      let total = 0
      for (const product of cartState?.cart) {
        productIdsArr.push(product.product_id)
        total += product?.price_with_discount * product.quantity
        if (product?.order_modifiers?.length > 0) {
          for (const modifier of product.order_modifiers) {
            total +=
              +modifier.modifier_price *
              +(modifier?.modifier_quantity * product.quantity)
          }
        }
      }
      productsId.current = productIdsArr.join(',')
      setTotalPrice(total)
    } else if (repeat == 'true' && reProducts) {
      let total = 0
      for (const product of reProducts) {
        productIdsArr.push(product.product_id)
        total += product.price * product.quantity
        if (product?.order_modifiers?.length > 0) {
          for (const modifier of product.order_modifiers) {
            total +=
              +modifier.modifier_price *
              +(modifier?.modifier_quantity * product.quantity)
          }
        }
      }
      productsId.current = productIdsArr.join(',')
      setTotalPrice(total)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartState?.cart, reProducts, repeat])

  const isWorkingHour = (start: string, end: string) => {
    const format = 'HH:mm'
    const currentTime = dayjs()

    if (start && end) {
      const workHourStart = dayjs(start, format, true)
      const workHourEnd = dayjs(end, format, true)

      if (start === '00:00' && end === '23:59') {
        return false
      }

      if (workHourEnd.isBefore(workHourStart)) {
        // Handle crossing midnight
        if (
          currentTime.isAfter(workHourStart) ||
          currentTime.isBefore(workHourEnd)
        ) {
          return false
        }
      } else {
        if (
          currentTime.isBefore(workHourStart) ||
          currentTime.isAfter(workHourEnd)
        ) {
          return false
        }
      }

      return true
    }

    return null
  }

  useEffect(() => {
    if (branchData?.work_hour_start && branchData?.work_hour_end) {
      if (
        !isWorkingHour(branchData?.work_hour_start, branchData?.work_hour_end)
      ) {
        setPreorder(true)
      }
    }
  }, [branchData])

  // const beginCheckoutGTM = () => {
  //   const items = cartState?.cart?.map((item: CartItem, idx: number) => ({
  //     item_name: item?.product_name,
  //     item_id: item?.product_id,
  //     price: item?.price_with_discount,
  //     item_category: item?.category_name,
  //     item_list_name: 'checkout',
  //     item_list_id: 'CH123',
  //     index: idx,
  //     quantity: item?.quantity,
  //   }))

  //   dataLayerComponent({
  //     event: 'begin_checkout',
  //     ecommerce: { items },
  //   })
  // }

  // const sendGTM = (bonusProducts: any, promocode: string) => {
  //   let allData = [...cartState.cart, ...bonusProducts]
  //   let dataShipping = {
  //     currency: 'UZS',
  //     value: totalPrice,
  //     coupon: promocode,
  //     shipping_tier: 'Ground',
  //     items: allData.map((el: any, idx: number) => ({
  //       affiliation: 'Delever',
  //       item_brand: 'Chicago',
  //       item_name:
  //         el.product_name ||
  //         el?.bonus_product?.title?.[
  //           currentLocale === 'kz' ? 'uz' : currentLocale
  //         ],
  //       item_id: el.product_id || el?.bonus_product?.id,
  //       price: el.price || el?.bonus_product?.out_price,
  //       discount: (el.price || 0) - (el.price_with_discount || 0),
  //       item_category: el.category_name,
  //       item_list_name: 'Cart',
  //       item_list_id: 'CH1234',
  //       index: idx,
  //       quantity: el.quantity || el?.bonus_product?.count,
  //     })),
  //   }
  //   let dataPayment = {
  //     currency: 'UZS',
  //     payment_type: checkoutState?.payment_type,
  //     value: totalPrice,
  //     coupon: promocode,
  //     items: allData.map((el, idx) => ({
  //       affiliation: 'Delever',
  //       item_brand: 'Chicago',
  //       item_name:
  //         el.product_name ||
  //         el?.bonus_product?.title?.[
  //           currentLocale === 'kz' ? 'uz' : currentLocale
  //         ],
  //       item_id: el.product_id || el?.bonus_product?.id,
  //       price: el.price || el?.bonus_product?.out_price,
  //       discount: (el.price || 0) - (el.price_with_discount || 0),
  //       item_category: el.category_name,
  //       item_list_name: 'Cart',
  //       item_list_id: 'CH12345',
  //       index: idx,
  //       quantity: el.quantity || el?.bonus_product?.count,
  //     })),
  //   }

  //   dataLayerComponent({
  //     event: 'add_shipping_info',
  //     ecommerce: dataShipping,
  //   })

  //   dataLayerComponent({
  //     event: 'add_payment_info',
  //     ecommerce: dataPayment,
  //   })
  // }

  // const googleAnalytics = ({
  //   bonusProducts,
  //   promocode,
  //   external_order_id,
  // }: any) => {
  //   let allData = [...cartState.cart, ...bonusProducts]

  //   const calculatedPrice =
  //     totalPrice +
  //     (!discounts?.is_delivery_free ? co_delivery_price : 0) +
  //     (discounts?.all_discount_price || 0)

  //   dataLayerComponent({
  //     event: 'purchase_ads',
  //     value: calculatedPrice,
  //     item: allData?.map((el) => ({
  //       id: el.product_id || el?.bonus_product?.id,
  //       google_business_vertical: 'retail',
  //     })),
  //   })
  //   dataLayerComponent({
  //     event: 'purchase_fb',
  //     value: calculatedPrice,
  //     content_ids: allData?.map((el) => el.product_id || el?.bonus_product?.id),
  //     content_type: 'product',
  //     currency: 'UZS',
  //   })

  //   let dataPurchase = {
  //     currency: 'UZS',
  //     affiliation: 'Online Store',
  //     value: calculatedPrice,
  //     coupon: promocode,
  //     tax: '0.00',
  //     transaction_id: external_order_id,
  //     shipping: co_delivery_price,
  //     items: allData?.map((el) => ({
  //       item_name:
  //         el.product_name ||
  //         el?.bonus_product?.title?.[
  //           currentLocale === 'kz' ? 'uz' : currentLocale
  //         ],
  //       item_id: el.product_id || el?.bonus_product?.id,
  //       price: el.price || el?.bonus_product?.out_price,
  //       quantity: el.quantity,
  //     })),
  //   }

  //   dataLayerComponent({
  //     event: 'purchase',
  //     ecommerce: dataPurchase,
  //   })
  // }

  // useEffect(() => beginCheckoutGTM(), [])

  return (
    <>
      <div>
        <Flex gap={'10px'}>
          <IconButton
            display={{ base: 'flex', lg: 'none' }}
            aria-label='back'
            justifyContent={'center'}
            alignItems={'center'}
            variant={'ghost'}
            onClick={() => router.back()}
            icon={<BackIcon color='#101828' />}
          />
          <Heading size='lg' mb={5}>
            {t('checkout')}
          </Heading>
        </Flex>
        <Flex
          align='flex-start'
          justify='space-between'
          gap={{ base: 4, lg: 6 }}
          flexDir={{ base: 'row', lg: 'row' }}
          flexWrap={{ base: 'wrap', lg: 'nowrap' }}
        >
          <Stack spacing={{ base: 4, lg: 4 }} flex={1} width='100%'>
            <Card shadow={'none'} borderRadius='2xl' overflow='hidden'>
              <CardBody p={{ base: 3, md: 4 }}>
                <Stack spacing={6}>
                  <UserData />
                </Stack>
              </CardBody>
            </Card>
            <Card shadow={'none'} borderRadius='2xl'>
              <CardBody p={{ base: 3, md: 4 }}>
                <Stack spacing={'16px'}>
                  <DeliveryDetails
                    orderData={orderData}
                    stepsData={stepsData}
                    branchError={isError}
                  />
                  <TimeDetails
                    isLoading={isLoading}
                    shipper={shipper}
                    branchWorkHours={{
                      work_hour_end:
                        nearestBranch?.work_hour_end ||
                        branchData?.work_hour_end,
                      work_hour_start:
                        nearestBranch?.work_hour_start ||
                        branchData?.work_hour_start,
                    }}
                  />
                  <MoreDetails source={sourceV3} />
                </Stack>
              </CardBody>
            </Card>
            {repeat ? (
              <Card shadow={'none'} borderRadius='2xl' overflow='hidden'>
                <CardHeader p={3}>
                  <Text fontSize={{ base: 18, md: 'xl' }} fontWeight={700}>
                    {t('your_product')}
                  </Text>
                </CardHeader>
                <Products
                  discounts={discounts}
                  reProducts={reProducts}
                  setReProducts={setReProducts}
                />
              </Card>
            ) : (
              cartState?.cart?.length > 0 && (
                <Card shadow={'none'} borderRadius='2xl' overflow='hidden'>
                  <CardHeader p={3}>
                    <Text fontSize={{ base: 18, md: 'xl' }} fontWeight={700}>
                      {t('your_product')}
                    </Text>
                  </CardHeader>
                  <Products
                    discounts={discounts}
                    reProducts={reProducts}
                    setReProducts={setReProducts}
                  />
                </Card>
              )
            )}
          </Stack>
          <Card
            shadow={'none'}
            w='100%'
            top='72px'
            overflow='auto'
            position={{ lg: 'sticky' }}
            borderRadius='2xl'
            maxW={{ lg: 416 }}
          >
            <CardBody p={{ base: 3, md: 4 }}>
              <Payment
                isShouldCardSave={orderData?.should_card_save}
                paymentData={orderData?.payment_type_id}
                onChange={onChangePaymentData}
                onShouldSaveCard={(val: boolean) =>
                  setOrderData((prev) => ({ ...prev, should_card_save: val }))
                }
                usedTypes={sourceV3?.payment_types_obj}
              />
              {sourceV3?.is_promocode && (
                <Promocode
                  discounts={discounts}
                  totalPrice={
                    totalPrice +
                    (!discounts?.is_delivery_free ? co_delivery_price : 0) +
                    (discounts?.all_discount_price || 0)
                  }
                  coDeliveryPrice={co_delivery_price}
                  setDiscounts={setDiscounts}
                />
              )}
              <Divider my={2} />
              {sourceV3?.payment_types_obj?.some(
                (value: any) => value?.type === 'cashback'
              ) && (
                <>
                  <Cashback
                    onAccumulate={onAccumulate}
                    totalPrice={totalPrice}
                  />
                  <Divider my={2} />
                </>
              )}
              <Bill
                onSubmit={onSubmit}
                discounts={discounts}
                totalPrice={totalPrice}
                validate={isCourierCallValidate}
                paymentData={orderData?.payment}
                deliveryPrice={co_delivery_price}
                isCreateLoading={isCreateLoading}
                sourceV3={sourceV3?.payment_types_obj}
                minPrice={+shipper?.minimal_order_price}
              />
            </CardBody>
          </Card>
        </Flex>
        <RedirectLoading isOpen={isCreateLoading} />

        {favourites?.favourites && favourites?.favourites?.length > 0 && (
          <Recommended favourites={favourites?.favourites} />
        )}
      </div>
      <ConfirmModal
        isOpen={isPreorder}
        onConfirm={() => setTimePicker(true)}
        title={t('attention')}
        onClose={() => setPreorder(false)}
        description={t('would_u_like_to_preorder')}
      />
      <OrderTimePicker
        isOpen={isTimePicker}
        onClose={() => setTimePicker(false)}
        onChange={onFutureTimeChange}
        value={checkoutState?.future_time ? checkoutState?.future_time : null}
        title={t('delivery_time')}
        interval={0}
        branchWorkHours={{
          work_hour_start: branchData?.work_hour_start || '00:00',
          work_hour_end: branchData?.work_hour_end || '23:59',
        }}
      />
    </>
  )
}
