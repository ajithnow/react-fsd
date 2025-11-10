import { useEffect } from 'react';

export const useDocumentTitle = (titleKey?: string, fallback?: string) => {

  useEffect(() => {
    const title = titleKey ?? 'STRO Admin';
    document.title = title;
  }, [titleKey, fallback]);
};