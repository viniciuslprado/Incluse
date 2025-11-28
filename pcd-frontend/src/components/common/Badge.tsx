import React from 'react';

export type BadgeColor = 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'purple';

export function badgeClasses(color: BadgeColor = 'gray') {
  const base = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';
  const map: Record<BadgeColor, string> = {
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    green: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    yellow: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    red: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  };
  return `${base} ${map[color]}`;
}

export interface BadgeProps {
  color?: BadgeColor;
  children: React.ReactNode;
}

export default function Badge({ color = 'gray', children }: BadgeProps) {
  return (
    <span className={badgeClasses(color)}>{children}</span>
  );
}
