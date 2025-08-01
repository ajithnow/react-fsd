import React from 'react';
import { ActionsDropdown } from './ActionsDropdown';
import { IconEdit, IconEye, IconCopy, IconDownload } from '@tabler/icons-react';
import { ActionItem } from './actionDropdown.model';

export const ActionsDropdownDemo: React.FC = () => {
  const basicActions: ActionItem[] = [
    {
      id: 'view',
      label: 'View Details',
      icon: <IconEye size={16} />,
      onClick: () => alert('View clicked'),
    },
    {
      id: 'copy',
      label: 'Copy Link',
      icon: <IconCopy size={16} />,
      onClick: () => alert('Copy clicked'),
    },
    {
      id: 'download',
      label: 'Download',
      icon: <IconDownload size={16} />,
      separator: true,
      onClick: () => alert('Download clicked'),
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">ActionsDropdown Component Demo</h1>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Basic Actions</h2>
        <div className="flex items-center gap-4">
          <span>Basic dropdown:</span>
          <ActionsDropdown actions={basicActions} />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Different Variants</h2>
        <div className="flex items-center gap-4">
          <span>Ghost (default):</span>
          <ActionsDropdown actions={basicActions} buttonVariant="ghost" />

          <span>Outline:</span>
          <ActionsDropdown actions={basicActions} buttonVariant="outline" />

          <span>Default:</span>
          <ActionsDropdown actions={basicActions} buttonVariant="default" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Different Sizes</h2>
        <div className="flex items-center gap-4">
          <span>Small:</span>
          <ActionsDropdown actions={basicActions} buttonSize="sm" />

          <span>Default:</span>
          <ActionsDropdown actions={basicActions} buttonSize="default" />

          <span>Large:</span>
          <ActionsDropdown actions={basicActions} buttonSize="lg" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Disabled State</h2>
        <div className="flex items-center gap-4">
          <span>Disabled:</span>
          <ActionsDropdown actions={basicActions} disabled />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Custom Trigger Icon</h2>
        <div className="flex items-center gap-4">
          <span>Custom icon:</span>
          <ActionsDropdown
            actions={basicActions}
            triggerIcon={<IconEdit className="h-4 w-4" />}
            aria-label="Edit actions menu"
          />
        </div>
      </div>
    </div>
  );
};

export default ActionsDropdownDemo;
