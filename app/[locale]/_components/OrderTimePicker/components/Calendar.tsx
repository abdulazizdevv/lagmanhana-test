import { useEffect, useState } from 'react'
// Dayjs
import dayjs from 'dayjs'
import weekdayPlugin from 'dayjs/plugin/weekday'
import objectPlugin from 'dayjs/plugin/toObject'
import isSameOrBeforePlugin from 'dayjs/plugin/isSameOrBefore'
import isTodayPlugin from 'dayjs/plugin/isToday'
import('dayjs/locale/uz-latn')
import('dayjs/locale/ru')
import('dayjs/locale/en')
// Style
import styles from './styles.module.scss'
import { Center } from '@chakra-ui/react'

interface IDates {
  dates: { date: any; day: any; isPassedDay: boolean; isCurrentDay: any }[]
}

function Calendar({ onSelect }: { onSelect: (e: any) => void }) {
  const currentLocale: string = 'ru'

  const now = dayjs().locale(currentLocale == 'uz' ? 'uz-latn' : currentLocale)

  dayjs.extend(weekdayPlugin)
  dayjs.extend(objectPlugin)
  dayjs.extend(isTodayPlugin)
  dayjs.extend(isSameOrBeforePlugin)

  const [currentMonth] = useState(now)
  const [arrayOfDays, setArrayOfDays] = useState<IDates[]>([{ dates: [] }])

  const renderDays = () => {
    const dateFormat = 'dd'
    const days = []

    for (let i = 0; i < 7; i++) {
      days.push(<div key={i}>{now.weekday(i).format(dateFormat)}</div>)
    }
    return <div className={styles.weekdays}>{days}</div>
  }

  const getAllDays = () => {
    let currentDate = currentMonth.startOf('week').weekday(0)
    const firstDateAfterNextWeek = currentDate.add(2, 'week').toObject().date

    let allDates = []
    let weekDates = []

    let weekCounter = 1

    while (currentDate.weekday(0).toObject().date !== firstDateAfterNextWeek) {
      const formated = formateDateObject(currentDate)

      weekDates.push(formated)

      if (weekCounter === 7) {
        allDates.push({ dates: weekDates })
        weekDates = []
        weekCounter = 0
      }

      weekCounter++
      currentDate = currentDate.add(1, 'day')
    }

    setArrayOfDays(allDates)
  }

  useEffect(() => {
    getAllDays()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderCells = () => {
    const rows: any[] = []
    let days: any[] = []

    arrayOfDays.forEach((week, index) => {
      week.dates.forEach((d, i) => {
        days.push(
          <div
            className={`${styles.col} ${styles.cell} ${
              d.isCurrentDay
                ? styles.selected
                : !d.isPassedDay
                ? styles.disabled
                : ''
            }`}
            key={i}
          >
            <Center
              as="span"
              onClick={() => onSelect(d.date)}
              bgColor={d.isCurrentDay ? 'primary.300' : undefined}
              color={d.isCurrentDay ? 'white' : undefined}
              _dark={{
                color: d.isCurrentDay ? 'primary.800' : undefined,
              }}
              _hover={
                !d.isCurrentDay
                  ? {
                      bg: 'paper.light.300',
                      _dark: {
                        bg: 'paper.dark.200',
                        color: 'paper.dark.900',
                      },
                    }
                  : undefined
              }
            >
              {d.day}
            </Center>
          </div>
        )
      })
      rows.push(
        <div className={styles.row} key={index}>
          {days}
        </div>
      )
      days = []
    })

    return <div className={styles.body}>{rows}</div>
  }

  const formateDateObject = (date: any) => {
    const formatedObject = {
      date: date.format('YYYY-MM-DD'),
      day: date.date(),
      isPassedDay: currentMonth.isBefore(date, 'day'),
      isCurrentDay: date.isToday(),
    }

    return formatedObject
  }

  return (
    <div className={styles.calendar}>
      <h4 className={styles.month}>
        {currentMonth.format('MMMM')}{' '}
        {currentMonth.startOf('week').weekday(0).add(2, 'week').toObject()
          .months !== currentMonth.month() &&
          '- ' +
            currentMonth
              .startOf('week')
              .weekday(0)
              .add(2, 'week')
              .format('MMMM')}
      </h4>
      {renderDays()}
      {renderCells()}
    </div>
  )
}

export default Calendar
