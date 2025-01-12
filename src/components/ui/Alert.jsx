import React from 'react';
import { AlertCircle as LucideAlertCircle } from 'lucide-react';

const Alert = ({ 
  variant = 'info', 
  children,
  className = ''
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'error':
        return 'bg-red-100 border-red-400 text-red-700';
      case 'success':
        return 'bg-green-100 border-green-400 text-green-700';
      case 'warning':
        return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      default:
        return 'bg-blue-100 border-blue-400 text-blue-700';
    }
  };

  return (
    <div className={`border-l-4 p-4 rounded ${getVariantStyles()} ${className}`} role="alert">
      {children}
    </div>
  );
};

const AlertCircle = ({ className = '', ...props }) => (
  <LucideAlertCircle className={`h-4 w-4 ${className}`} {...props} />
);

const AlertDescription = ({ children, className = '' }) => (
  <div className={`text-sm ${className}`}>
    {children}
  </div>
);

export { Alert, AlertCircle, AlertDescription };