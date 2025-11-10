import { useEffect, useState, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfWorkerImport from 'pdfjs-dist/build/pdf.worker.min?url'; // Vite/Webpack style import

import Button from '@/shared/components/Button';
import { PdfPreviewProps } from '@/shared/models';

const pdfWorker: string =
  typeof window !== 'undefined' ? (pdfWorkerImport ?? '') : '';
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export const PdfPreview = ({ url, onClose, translate }: PdfPreviewProps) => {
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const workerOptions = useMemo(() => ({}), []);

  useEffect(() => {
    let objectUrl: string | null = null;
    let active = true;

    const loadPdf = async () => {
      setLoading(true);
      setPdfFile(null);

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch PDF');
        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        if (active) setPdfFile(objectUrl);
      } catch {
        if (active) setPdfFile(url);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPdf();

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setPdfFile(null);
    };
  }, [url]);

  if (loading) return <div>{translate('notification.label.loadPdf')}</div>;
  if (!pdfFile) return <div>{translate('notification.label.pdfFail')}</div>;

  return (
    <div className="mt-4 border rounded-lg overflow-auto h-[600px] relative">
      {onClose && (
        <div className="absolute top-2 right-2 z-10 p-2 bg-white">
          <Button variant="outline" onClick={onClose}>
            {translate('notification.label.closePreview')}
          </Button>
        </div>
      )}

      {pdfFile && (
        <Document
          file={pdfFile}
          loading={translate('notification.label.loadPdf')}
          options={workerOptions}
          renderMode="canvas"
        >
          <Page
            pageNumber={1}
            width={800}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      )}
    </div>
  );
};
