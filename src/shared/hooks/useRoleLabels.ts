import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getUserTypeData, getUserStatusData } from '@/shared/utils/role.utils';

export function useRoleLabels() {
  const { t } = useTranslation('users');

  const typeData = useMemo(() => getUserTypeData(t), [t]);
  const statusData = useMemo(() => getUserStatusData(t), [t]);

  return { typeData, statusData };
}

export default useRoleLabels;
