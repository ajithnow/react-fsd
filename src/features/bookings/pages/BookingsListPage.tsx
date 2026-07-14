import { useTranslation } from 'react-i18next';

/** Scaffold list page — replace with real bookings UI later. */
export const BookingsListPage = () => {
  const { t } = useTranslation('bookings');

  return (
    <div className="p-6 space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">
        {t('list.title')}
      </h1>
      <p className="text-muted-foreground">{t('list.subtitle')}</p>
      <p className="pt-4 text-sm text-muted-foreground">{t('list.empty')}</p>
    </div>
  );
};
