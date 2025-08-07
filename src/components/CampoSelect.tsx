import React from 'react';
import { CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';

interface CampoSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  error?: string;
  required?: boolean;
  visible?: boolean;
}

const CampoSelect: React.FC<CampoSelectProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  visible = true
}) => {
  if (!visible) return null;

  const isValid = value && !error;
  const hasError = error && error.length > 0;

  return (
    <div className="space-y-2 animate-fadeIn">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full p-4 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-20 text-gray-800 font-medium appearance-none cursor-pointer
            ${hasError 
              ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500' 
              : isValid 
                ? 'border-green-400 bg-green-50 focus:border-green-500 focus:ring-green-500' 
                : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400'
            }
          `}
        >
          <option value="">Selecione uma opção...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 pointer-events-none">
          {isValid && <CheckCircle className="h-5 w-5 text-green-500" />}
          {hasError && <AlertCircle className="h-5 w-5 text-red-500" />}
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
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
          Selecionado!
        </div>
      )}
    </div>
  );
};

export default CampoSelect;