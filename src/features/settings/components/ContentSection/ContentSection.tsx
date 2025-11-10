import React from 'react';

interface ContentSectionProps {
  title: string;
  desc?: string;
  children: React.ReactNode;
}

export const ContentSection: React.FC<ContentSectionProps> = ({ title, desc, children }) => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{title}</h3>
        {desc && (
          <p className="text-sm text-muted-foreground">
            {desc}
          </p>
        )}
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};
