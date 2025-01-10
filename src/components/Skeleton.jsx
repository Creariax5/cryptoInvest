import React from 'react';

const Skeleton = ({ className = '' }) => (
  <div 
    className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
    aria-hidden="true"
  />
);

export { Skeleton };