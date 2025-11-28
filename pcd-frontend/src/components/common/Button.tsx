import React from 'react';

export type ButtonVariant =
  | 'primary' | 'secondary' | 'neutral'
  | 'danger' | 'warning' | 'success'
  | 'blue' | 'indigo' | 'purple' | 'yellow' | 'red' | 'green';

export function buttonClasses(variant: ButtonVariant = 'neutral') {
  const base = 'inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors';
  const map: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-900 text-white hover:bg-black',
    neutral: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
    danger: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    warning: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    success: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    yellow: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    red: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    green: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  };
  return `${base} ${map[variant]}`;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  full?: boolean;
}

export default function Button({ variant = 'neutral', full, className, children, ...rest }: ButtonProps) {
  return (
    <button type="button" {...rest} className={`${buttonClasses(variant)} ${full ? 'w-full' : ''} ${className ?? ''}`.trim()}>
      {children}
    </button>
  );
}
