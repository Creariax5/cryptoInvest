import React from 'react';

const Card = ({ children, className = '' }) => (
  <div className={`bg-gray-800 rounded-lg border border-gray-700 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`p-4 border-b border-gray-700 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-white ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-4 text-gray-300 ${className}`}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardContent };