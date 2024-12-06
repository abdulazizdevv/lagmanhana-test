import React from 'react';
import dayjs from 'dayjs';

const ScheduleStatus = ({ branch, t }: any) => {
  const currentTime = dayjs().format('HH:mm');

  if (branch && branch?.work_hour_start && branch?.work_hour_end) {
    const isOpen =
      branch?.work_hour_start < currentTime &&
      currentTime < branch?.work_hour_end;
    const isOpenNextDay =
      branch?.work_hour_start < currentTime &&
      branch?.work_hour_end < currentTime &&
      branch?.work_hour_end < branch?.work_hour_start;
    const isOpenBeforeStart =
      branch?.work_hour_end > currentTime &&
      branch?.work_hour_start > currentTime &&
      branch?.work_hour_end < branch?.work_hour_start;
    const isAroundTheClock =
      branch?.work_hour_start === '00:00' && branch?.work_hour_end === '23:59';

    if (isOpen || isOpenNextDay || isOpenBeforeStart) {
      return (
        <p style={{ color: '#5AC53A' }}>
          {t('open_until', {
            work_hour_end: branch?.work_hour_end,
          })}
        </p>
      );
    } else if (isAroundTheClock) {
      return <p style={{ color: '#5AC53A' }}>{t('works_around_the_clock')}</p>;
    } else {
      return (
        <p style={{ color: '#f00' }}>
          {t('closed_until', {
            work_hour_start: branch?.work_hour_start,
          })}
        </p>
      );
    }
  }

  return null;
};

export default ScheduleStatus;
