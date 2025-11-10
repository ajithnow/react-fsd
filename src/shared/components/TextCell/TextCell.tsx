import React from 'react';
import type { TextCellProps } from './textCell.model';
import { Link } from '@tanstack/react-router';
export const TextCell: React.FC<TextCellProps> = ({
  value,
  className,
  truncate = false,
  tooltip = false,
  copyable = false,
  link,
}) => {
  const text = value == null ? '' : String(value);

  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`}>
      {link ? (
        <Link to={link}>{text}</Link>
      ) : (
        <div
          className={`font-medium ${truncate ? 'truncate max-w-[200px]' : ''}`}
          {...(tooltip ? { title: text } : {})}
        >
          {text}
        </div>
      )}
      {copyable && (
        <button
          aria-label="copy-value"
          type="button"
          onClick={() => navigator.clipboard?.writeText(text)}
          className="text-muted-foreground hover:text-foreground size-4"
        >
          {/* simple unicode copy icon to avoid adding dependencies */}⧉
        </button>
      )}
    </div>
  );
};
