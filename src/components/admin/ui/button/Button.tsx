'use client';
import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: 'sm' | 'md'; // Button size
  variant?: 'primary' | 'outline'; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Disabled state
  buttonAction?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = 'md',
  variant = 'primary',
  startIcon,
  endIcon,
  onClick,
  className = '',
  disabled = false,
  buttonAction = '/admin',
}) => {
  const router = useRouter();

  // Size Classes
  const sizeClasses = {
    sm: 'px-4 py-3 text-sm',
    md: 'px-5 py-3.5 text-sm',
  };

  // Variant Classes
  const variantClasses = {
    primary: 'bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300',
    outline:
      'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300',
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // Call the provided onClick handler if it exists
    if (onClick) {
      onClick(e);
    }

    // Handle navigation
    if (buttonAction) {
      router.push(buttonAction);
    }
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-medium gap-2 rounded-lg transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
