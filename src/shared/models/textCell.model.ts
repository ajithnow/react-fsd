export type TextCellProps = {
  value?: React.ReactNode;
  className?: string;
  truncate?: boolean; // if true, apply text truncation
  tooltip?: boolean; // if true, render title attribute for full text
  copyable?: boolean; // if true, show a small copy button (optional)
};
