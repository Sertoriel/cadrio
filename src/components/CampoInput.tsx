import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface CampoInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  maxLength?: number;
  visible?: boolean;
  inputMode?: 'text' | 'numeric';
}

const CampoInput: React.FC<CampoInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  maxLength,
  visible = true,
  inputMode = 'text'
}) => {
  if (!visible) return null;

  const isValid = value && !error && value.length > 0;
  const hasError = error && error.length > 0;
  // const isEmpty = !value || value.trim().length === 0;

  return (
    <div className="space-y-2 animate-fadeIn">
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`
            w-full p-4 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-20 text-gray-800 font-medium
            ${hasError 
              ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500' 
              : isValid 
                ? 'border-green-400 bg-green-50 focus:border-green-500 focus:ring-green-500' 
                : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400'
            }
          `}
        />
        {isValid && (
          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
        )}
        {hasError && (
          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
        )}
      </div>
      {hasError && (
        <div className="flex items-center gap-2 text-red-600 text-sm font-medium animate-slideDown">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
      {isValid && (
        <div className="flex items-center gap-2 text-green-600 text-sm font-medium animate-slideDown">
          <CheckCircle className="h-4 w-4" />
          Válido!
        </div>
      )}
    </div>
  );
};

export default CampoInput;