import { useQuery } from '@tanstack/react-query'
import styles from './style.module.scss'
import { useEffect, useState } from 'react'
import { getComboById } from '@/_services/products'
import { Radio, RadioGroup, Stack } from '@chakra-ui/react'
import { IProduct } from '@/_types'
import { useCurrentLocale } from '@/_locales/client'

function ComboOptions({
  product,
  currentVariant,
  setCurrentVariant,
}: {
  product: IProduct
  currentVariant: any
  setCurrentVariant: any
}) {
  const [comboGroups, setComboGroups] = useState([])

  const currentLocale = useCurrentLocale()

  const { data: comboData }: { data: any } = useQuery({
    queryKey: ['combo', product?.id],
    queryFn: () => getComboById(product?.id).then((res) => res.data),
    enabled: Boolean(product?.type === 'combo' && product?.id),
  })

  useEffect(() => {
    if (comboData) {
      setComboGroups(comboData.groups)
      if (!currentVariant.length) {
        const variantsMap: any[] = []
        comboData?.groups?.map((group: any) => {
          variantsMap.push({
            group_id: group.id,
            quantity: group.quantity,
            variant_id: group.variants[0].id,
          })
        })
        setCurrentVariant(variantsMap)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comboData, currentVariant.length])

  const onRadioChange = (group_id: string, variant_id: string) => {
    setCurrentVariant((prevState: any[]) =>
      prevState.map((el) =>
        el.group_id === group_id ? { ...el, variant_id } : el
      )
    )
  }

  return (
    comboGroups.length > 0 &&
    currentVariant.length > 0 && (
      <div className={styles.originProps}>
        {comboGroups.map((group: any, idx: number) => (
          <div key={group.id} className={styles.option_group}>
            <h4>
              {group.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
            </h4>
            <RadioGroup
              name={group.title?.['en']}
              value={currentVariant[idx].variant_id}
              onChange={(e) => onRadioChange(group.id, e)}
            >
              <Stack direction='row'>
                {group?.variants?.map((variant: any) => (
                  <Radio
                    key={variant.id}
                    value={variant.title['en']}
                    checked={true}
                    className={styles.option}
                  >
                    {
                      variant.title?.[
                        currentLocale === 'kz' ? 'uz' : currentLocale
                      ]
                    }
                    <span>x {group.quantity}</span>
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </div>
        ))}
      </div>
    )
  )
}

export default ComboOptions
