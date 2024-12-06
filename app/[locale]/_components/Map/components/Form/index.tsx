import { useI18n } from '@/_locales/client'
import { checkoutActions } from '@/_store/checkout/checkout.slice'
import { IBranch, IRedux } from '@/_types'
import { FormControl, FormLabel, Input, SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ZoneAlert from '../ZoneAlert'
import NearestBranch from '../NearestBranch'

function Form({
  errorZone,
  nearestBranch,
}: {
  errorZone: boolean
  nearestBranch: IBranch | null
}) {
  const t = useI18n()
  const dispatch = useDispatch()

  const checkoutState = useSelector((state: IRedux) => state.checkout)

  return (
    <>
      <SimpleGrid columns={2} spacing={3} my={3}>
        <FormControl>
          <FormLabel>{t('accommodation')}</FormLabel>
          <Input
            variant='outline'
            value={checkoutState?.accommodation}
            placeholder={t('number_accommodation')}
            onChange={(e) =>
              dispatch(checkoutActions.changeAccommodation(e.target.value))
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>{t('floor')}</FormLabel>
          <Input
            variant='outline'
            value={checkoutState?.floor}
            placeholder='1'
            onChange={(e) =>
              dispatch(checkoutActions.changeFloor(e.target.value))
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>{t('apartment')}</FormLabel>
          <Input
            variant='outline'
            value={checkoutState?.apartment}
            placeholder={t('apartment_number')}
            onChange={(e) =>
              dispatch(checkoutActions.changeApartment(e.target.value))
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>{t('building')}</FormLabel>
          <Input
            variant='outline'
            value={checkoutState?.building}
            placeholder='1'
            onChange={(e) =>
              dispatch(checkoutActions.changeBuilding(e.target.value))
            }
          />
        </FormControl>
      </SimpleGrid>
      <FormControl>
        <FormLabel>{t('destination')}</FormLabel>
        <Input
          variant='outline'
          value={checkoutState?.destination}
          onChange={(e) =>
            dispatch(checkoutActions.changeDestination(e.target.value))
          }
        />
      </FormControl>
      {/* {errorZone ? <ZoneAlert /> : <NearestBranch data={nearestBranch} />} */}
    </>
  )
}

export default Form
