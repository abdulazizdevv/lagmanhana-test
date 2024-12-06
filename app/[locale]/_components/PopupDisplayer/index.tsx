'use client'
import { useState, useEffect } from 'react'
import PopupAlert from '../Popup'

interface Popup {
  id: string
  show_after: number
  duration: number
  [key: string]: any
}

interface PopupDisplayerProps {
  popups: Popup[]
}

const PopupDisplayer: React.FC<PopupDisplayerProps> = ({ popups }) => {
  const [activePopup, setActivePopup] = useState<Popup | null>(null)
  const [notifications, setNotifications] = useState<Popup[]>([])
  const [closedPopups, setClosedPopups] = useState<Popup[]>([])
  const [showAfter, setShowAfter] = useState(false)
  const [duration, setDuration] = useState(true)

  useEffect(() => {
    const closed = JSON.parse(window.sessionStorage.getItem('closed') || '[]')

    setClosedPopups(closed)
  }, [])

  useEffect(() => {
    if (popups) {
      const filteredNotifications = popups.filter(
        (notification) =>
          !closedPopups.some((item) => item.id === notification.id)
      )

      setNotifications(filteredNotifications)
    }
  }, [closedPopups, popups])

  useEffect(() => {
    if (notifications.length > 0) {
      setActivePopup(notifications[0])
    }
  }, [notifications])

  useEffect(() => {
    if (activePopup) {
      const timeoutShow = setTimeout(() => {
        setShowAfter(true)
      }, activePopup.show_after * 1000)

      return () => clearTimeout(timeoutShow)
    }
  }, [activePopup])

  useEffect(() => {
    if (activePopup && showAfter && activePopup.duration > 0) {
      const timeoutDuration = setTimeout(() => {
        setDuration(false)
        const updatedClosedPopups = [...closedPopups, activePopup]
        window.sessionStorage.setItem(
          'closed',
          JSON.stringify(updatedClosedPopups)
        )
        setClosedPopups(updatedClosedPopups)
        setShowAfter(false)
        setDuration(true)
      }, activePopup.duration * 1000)

      return () => clearTimeout(timeoutDuration)
    }
  }, [showAfter, activePopup, closedPopups])

  const onClosePopup = () => {
    const updatedClosedPopups = [...closedPopups, activePopup!]
    window.sessionStorage.setItem('closed', JSON.stringify(updatedClosedPopups))
    setClosedPopups(updatedClosedPopups)
    setShowAfter(false)
    setDuration(true)
  }

  return (
    <>
      {activePopup && notifications.length > 0 && showAfter && duration && (
        <PopupAlert
          open={notifications.some((obj) => obj.id === activePopup.id)}
          data={activePopup}
          handleClose={onClosePopup}
        />
      )}
    </>
  )
}

export default PopupDisplayer
