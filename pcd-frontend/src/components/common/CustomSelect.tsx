import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  disabled = false,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div ref={ref} className={`relative w-full max-w-xs ${className}`} tabIndex={-1}>
      <button
        type="button"
        className={`flex justify-between items-center w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${open ? 'ring-2 ring-blue-400' : ''}`}
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? '' : 'text-gray-400'}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto transition-all duration-200 ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
        style={{ minWidth: '100%' }}
        role="listbox"
      >
        {options.length === 0 && (
          <div className="px-4 py-2 text-gray-400">Sem opções</div>
        )}
        {options.map((opt) => (
          <button
            key={opt.value}
            className={`w-full text-left px-4 py-2 hover:bg-blue-50 focus:bg-blue-100 transition rounded ${value === opt.value ? 'bg-blue-100 text-blue-700' : ''}`}
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
            }}
            role="option"
            aria-selected={value === opt.value}
            tabIndex={0}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;
