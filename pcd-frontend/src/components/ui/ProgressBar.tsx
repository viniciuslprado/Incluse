import React from 'react';

export default function ProgressBar({ value = 0 }: { value?: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
      <div className="h-3 bg-blue-600 transition-width duration-300" style={{ width: `${v}%` }} />
    </div>
  );
}
