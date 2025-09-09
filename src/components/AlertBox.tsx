// src/components/AlertBox.tsx
import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

type Variant = 'info' | 'success' | 'error' | 'warning';

interface AlertBoxProps {
    visible?: boolean;
    message: string;
    variant?: Variant;
    onClose: () => void;
    autoClose?: number; // Opcional: tempo em ms para fechar automaticamente
}

const variantStyles: Record<Variant, { bg: string; border: string; text: string; btn: string }> = {
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', btn: 'text-blue-600 hover:bg-blue-100' },
    success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', btn: 'text-green-600 hover:bg-green-100' },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', btn: 'text-red-600 hover:bg-red-100' },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', btn: 'text-yellow-600 hover:bg-yellow-100' },
};

const hasHTML = (str: string): boolean => {
    if (!str) return false;
    return /<[a-z][\s\S]*>/i.test(str);
};

const AlertBox: React.FC<AlertBoxProps> = ({
    visible = true,
    message,
    variant = 'info',
    onClose,
    autoClose
}) => {
    const styles = variantStyles[variant];
    const [isVisible, setIsVisible] = useState(visible);

    const sanitizedMessage = () => {
        return { __html: DOMPurify.sanitize(message) };
    };

    const containsHTML = hasHTML(message);

    // Fechar automaticamente após um tempo
    useEffect(() => {
        if (visible && autoClose) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                onClose();
            }, autoClose);

            return () => clearTimeout(timer);
        }
    }, [visible, autoClose, onClose]);

    // Sincronizar com a prop visible
    useEffect(() => {
        setIsVisible(visible);
    }, [visible]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
            <div
                role="alert"
                aria-live="polite"
                className={`w-full max-w-4xl ${styles.bg} border ${styles.border} rounded-lg p-4 shadow-lg transform transition-all duration-300`}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 overflow-auto max-h-96 pr-2">
                        {containsHTML ? (
                            <div className="[&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-blue-700 [&_h4]:mb-3 
                                            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3 [&_ul]:text-yellow-600
                                            [&_li]:my-1 [&_li]:text-gray-800
                                            [&_.list-group-item]:border-b [&_.list-group-item]:border-gray-200 [&_.list-group-item]:py-2
                                            [&_strong]:font-semibold [&_strong]:text-gray-900
                                            [&_p]:my-2 [&_p]:font-bold">
                                <div dangerouslySetInnerHTML={sanitizedMessage()} />
                            </div>
                        ) : (
                            <p className={`text-lg font-semibold ${styles.text}`}>{message}</p>
                        )}
                    </div>

                    <div className="flex-shrink-0">
                        <button
                            onClick={onClose}
                            aria-label="Fechar aviso"
                            className={`inline-flex items-center justify-center rounded-md p-2 ${styles.btn} focus:outline-none focus:ring-2 focus:ring-offset-1`}
                            type="button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertBox;