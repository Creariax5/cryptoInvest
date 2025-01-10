import React from 'react';

const TimeframeSelector = ({ days, setDays }) => {
    const maxDays = 1000;
    return (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="space-y-2">
            <div className="flex justify-between items-center">
            <label className="text-sm text-gray-400">Timeframe (Days)</label>
            <span className="text-sm text-gray-400">{days} days</span>
            </div>
            <input
                type="number"
                value={days}
                onChange={(e) => setDays(Math.max(1, Math.min(maxDays, Number(e.target.value))))}
                className="w-full bg-gray-700 rounded p-2 mb-2"
                min="1"
                max={maxDays}
            />
            <input
                type="range"
                min="1"
                max={maxDays}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full accent-green-500 bg-gray-700"
            />
        </div>
        </div>
    );
};

export default TimeframeSelector;