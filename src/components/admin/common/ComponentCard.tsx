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
      <div className="px-6 py-5 grid grid-cols-2 items-center">
        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">{title}</h3>
        {desc && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>}
        {hasButton ? (
          <Button
            size="sm"
            variant="outline"
            buttonAction={buttonAction}
            className="flex w-full items-center justify-center gap-2 text-gray-800 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto justify-self-end"
          >
            {buttonText}
          </Button>
        ) : null}
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
