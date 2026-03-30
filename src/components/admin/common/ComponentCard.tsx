import React from 'react';
import Button from '@/components/ui/button/Button';
import UserDropdown from '@/components/common/UserDropdown';
import Icon from '@/components/ui/AppIcon';

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  hasButton?: boolean;
  buttonText?: string;
  buttonAction?: string;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = '',
  desc = '',
  hasButton = false,
  buttonText = 'Add',
  buttonAction = '/admin/product/add',
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="rounded-t-2xl bg-gray-50/70 px-6 py-5 border-b border-gray-100 dark:border-gray-800/70 dark:bg-white/[0.02]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">{title}</h3>
            {desc && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>}
          </div>
          {hasButton ? (
            <Button
              size="sm"
              variant="outline"
              buttonAction={buttonAction}
              className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03] dark:hover:text-gray-100"
            >
              {buttonText}
            </Button>
          ) : null}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
