import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PdfPreview } from '../PdfPreview';

// Mock react-pdf
jest.mock('react-pdf', () => ({
  Document: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="document">{children}</div>
  ),
  Page: () => <div data-testid="page">Page 1</div>,
  pdfjs: { GlobalWorkerOptions: { workerSrc: '' } },
}));

// Mock Button
// eslint-disable-next-line @typescript-eslint/no-explicit-any
jest.mock('@/shared/components/Button', () => ({ children, onClick }: any) => (
  <button onClick={onClick}>{children}</button>
));

// Mock pdf worker import
jest.mock('pdfjs-dist/build/pdf.worker.min?url', () => '', { virtual: true });

// Mock fetch
const mockBlob = new Blob(['dummy pdf content'], { type: 'application/pdf' });
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    blob: () => Promise.resolve(mockBlob),
  })
) as jest.Mock;

describe('PdfPreview', () => {
  const mockUrl = 'https://example.com/test.pdf';
  const onCloseMock = jest.fn();
  const translateMock = (key: string) => key;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading initially', () => {
    (global.fetch as jest.Mock) = jest.fn(() => new Promise(() => {}));
    render(<PdfPreview url={mockUrl} onClose={onCloseMock} translate={translateMock} />);
    expect(screen.getByText('notification.label.loadPdf')).toBeInTheDocument();
  });

  it('renders PDF after successful fetch', async () => {
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({ ok: true, blob: () => Promise.resolve(mockBlob) })
    );

    render(<PdfPreview url={mockUrl} onClose={onCloseMock} translate={translateMock} />);

    await waitFor(() => expect(screen.getByTestId('document')).toBeInTheDocument());
    expect(screen.getByTestId('page')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({ ok: true, blob: () => Promise.resolve(mockBlob) })
    );

    render(<PdfPreview url={mockUrl} onClose={onCloseMock} translate={translateMock} />);

    await waitFor(() => screen.getByText('notification.label.closePreview'));
    fireEvent.click(screen.getByText('notification.label.closePreview'));

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
