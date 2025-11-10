
import { useTranslation } from 'react-i18next';

export const  TotalUsageDisplay = ({
    mode,
    usageResp,
  }: Readonly<{
    mode: 'day' | 'month' | 'year';
    usageResp: {
      points?: Array<{ x: string; y: number | null }> | null;
      totalDayUsage?: number | null;
      totalMonthlyUsage?: number | null;
      totalYearUsage?: number | null;
    } | null;
  }>) =>{
    
    const { t } = useTranslation('customers');
    let total: number | null | undefined = null;
    if (mode === 'day') total = usageResp?.totalDayUsage ?? null;
    else if (mode === 'month') total = usageResp?.totalMonthlyUsage ?? null;
    else total = usageResp?.totalYearUsage ?? null;
  
    return (
      <div>
        <div className="text-xs text-muted-foreground">
          {t('detail.total', 'Total')}
        </div>
        <div className="text-lg font-semibold">
          {typeof total === 'number'
            ? new Intl.NumberFormat('en-CH').format(total)
            : '-'}{' '}
          kWh
        </div>
      </div>
    );
  }