export interface UsageSlot {
  label?: number | string;
  value?: number | null;
  x?: string;
  y?: number | null;
}

export const formatUsageLabelsByMode = (
  usageData?: UsageSlot[] | null,
  mode?: 'day' | 'month' | 'year'
): UsageSlot[] => {
  if (!usageData || !Array.isArray(usageData)) return [];

  return usageData.map(slot => {
    const getLabel = Number(slot.label) || 0;
    //Filter by day
    if (mode === 'day') {
      const totalMinutes = getLabel * 15;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const label = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      return { ...slot, label };
    }
    //Filter by month
    if (mode === 'month') {
      return { ...slot, label: String(getLabel) };
    }

    //Filter by year
    if (mode === 'year') {
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      const monthLabel = months[getLabel - 1] || String(getLabel);
      return { ...slot, label: monthLabel };
    }

    return slot;
  });
};

