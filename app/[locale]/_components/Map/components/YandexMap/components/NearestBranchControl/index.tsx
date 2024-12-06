import React, { useState } from 'react'
import styles from './styles.module.scss'
import MarkerPinIcon from '@/_assets/icons/MarkerPinIcon'
import { getNearestBranch } from '@/_services/branches'
import { IBranch, IRedux } from '@/_types'
import { useSelector } from 'react-redux'
import { useI18n } from '@/_locales/client'
import { Box } from '@chakra-ui/react'

function NearestBranchControl({
  onSelectBranch,
}: {
  onSelectBranch: (val: IBranch | null) => void
}) {
  const [isLoading, setLoading] = useState(false)
  const commonState = useSelector((state: IRedux) => state.common)

  const t = useI18n()

  const findNearestBranch = async (lat: any, long: any) => {
    setLoading(true)
    getNearestBranch(lat, long)
      .then((res) => {
        if (res?.data?.branches) {
          for (let branch of res?.data?.branches) {
            if (branch.is_active) {
              onSelectBranch(branch)
              return
            }
          }
        }

        onSelectBranch(null)
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }
  return (
    <Box
      className={styles.control}
      onClick={() =>
        findNearestBranch(
          commonState?.location?.[0],
          commonState?.location?.[1]
        )
      }
    >
      <MarkerPinIcon />
      {t('find_the_nearest_branch')}
    </Box>
  )
}

export default NearestBranchControl
