// src/components/AlertBox.tsx
import React from 'react';

type Variant = 'info' | 'success' | 'error';

interface AlertBoxProps {
    visible?: boolean;
    message: string;
    variant?: Variant;
    onClose: () => void;
}

const variantStyles: Record<Variant, { bg: string; border: string; text: string; btn: string }> = {
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', btn: 'text-blue-600 hover:bg-blue-100' },
    success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', btn: 'text-green-600 hover:bg-green-100' },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', btn: 'text-red-600 hover:bg-red-100' },
};

const AlertBox: React.FC<AlertBoxProps> = ({ visible = true, message, variant = 'info', onClose }) => {
    const styles = variantStyles[variant];

    if (!visible) return null;

    return (
        <div
            role="alert"
            aria-live="polite"
            className={`w-full max-w-3xl mx-auto ${styles.bg} border ${styles.border} rounded-lg p-4 shadow-sm`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <p className={`text-sm font-medium ${styles.text}`}>{message}</p>
                </div>

                <div className="flex-shrink-0">
                    <button
                        onClick={onClose}
                        aria-label="Fechar aviso"
                        className={`inline-flex items-center justify-center rounded-md p-2 ${styles.btn} focus:outline-none focus:ring-2 focus:ring-offset-1`}
                        type="button"
                    >
                        {/* ícone simples 'x' */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertBox;
