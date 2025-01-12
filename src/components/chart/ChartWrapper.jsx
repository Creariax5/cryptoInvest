import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { ResponsiveContainer } from 'recharts';

const ChartWrapper = ({ children }) => {
  return (
    <Card className="mt-0 mb-0 bg-gray-800">
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer>
            {children}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartWrapper;