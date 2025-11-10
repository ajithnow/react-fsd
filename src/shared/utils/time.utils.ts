

export function getMsUntilNextQuarterHour() {
    const now = new Date();
    const minutes = now.getMinutes();
    const nextQuarter = Math.ceil((minutes + 1) / 15) * 15;
    const next = new Date(now);
    next.setMinutes(nextQuarter, 0, 0);
    return next.getTime() - now.getTime();
  }
  
  