import { useState, useEffect } from 'react';

export type Mode = 'day' | 'month' | 'year';

export const  useUsageControls = ()  =>{
  const [usageMode, setUsageMode] = useState<Mode>('day');
  const [usageYear, setUsageYear] = useState<number>(new Date().getFullYear());
  const [usageMonth, setUsageMonth] = useState<number>(new Date().getMonth());
  const [usageDate, setUsageDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  // When user changes month/year, keep the derived `usageDate` in sync so
  // the daily usage query key updates when `usageMode === 'day'`.
useEffect(() => {
    // Do not override the user's selected daily date. Keep the initial
    // `usageDate` (today) and let the date picker / onDateChange control
    // updates. This prevents silently changing the day to the 1st of the
    // month when mode is 'day'.
    // If you want behavior where changing month/year should update the
    // daily date, we can add that explicitly later.
  }, [usageYear, usageMonth, usageMode]);

  return {
    usageMode,
    usageYear,
    usageMonth,
    usageDate,
    setUsageMode,
    setUsageYear,
    setUsageMonth,
    setUsageDate,
  };
}
