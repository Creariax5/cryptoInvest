import React from 'react';

const Card = ({ children, className = '', onClick = null, ...props }) => (
  <div 
    className={`bg-gray-800 rounded-lg border border-gray-700 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={onClick ? (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(e);
      }
    } : undefined}
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = '', ...props }) => (
  <div 
    className={`p-4 border-b border-gray-700 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }) => (
  <h3 
    className={`text-lg font-semibold text-white ${className}`}
    {...props}
  >
    {children}
  </h3>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div 
    className={`p-4 text-gray-300 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardContent };