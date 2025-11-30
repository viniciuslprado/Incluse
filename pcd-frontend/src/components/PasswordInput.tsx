import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface PasswordInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  label?: string;
  autoComplete?: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export default function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder = "••••••••",
  required = false,
  className = "",
  label,
  autoComplete = "current-password",
  showPassword: externalShowPassword,
  onTogglePassword
}: PasswordInputProps) {
  const [internalShowPassword, setInternalShowPassword] = useState(false);

  const showPassword = externalShowPassword !== undefined ? externalShowPassword : internalShowPassword;

  const togglePasswordVisibility = () => {
    if (onTogglePassword) {
      onTogglePassword();
    } else {
      setInternalShowPassword(!internalShowPassword);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`w-full pr-12 pl-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150 ${className}`}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 focus:outline-none focus:ring-0 bg-transparent border-0"
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          tabIndex={-1}
        >
          {showPassword ? (
            <FiEyeOff className="w-5 h-5" />
          ) : (
            <FiEye className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
