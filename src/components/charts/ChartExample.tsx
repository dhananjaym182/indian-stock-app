// Example usage component - ChartExample.tsx
'use client';

import React, { useState } from 'react';
import TradingViewChart from './TradingViewChart';
import { useChartData } from './hooks/useChartData';

const ChartExample: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  const { data, isLoading, error } = useChartData(selectedSymbol, selectedPeriod);

  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA'];
  const periods = ['1D', '1W', '1M', '3M', '6M', '1Y'];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">❌ Error Loading Chart</div>
          <div className="text-gray-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Controls */}
        <div className="mb-6 bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                📈 Professional Trading Chart
              </h1>
              <p className="text-gray-400">
                TradingView-style charting with technical indicators
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Symbol Selector */}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Symbol</label>
                <select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  {symbols.map((symbol) => (
                    <option key={symbol} value={symbol}>
                      {symbol}
                    </option>
                  ))}
                </select>
              </div>

              {/* Period Selector */}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Period</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  {periods.map((period) => (
                    <option key={period} value={period}>
                      {period}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Component */}
        <div className="bg-gray-800 rounded-lg p-2">
          <TradingViewChart
            data={data}
            symbol={selectedSymbol}
            width={1200}
            height={700}
            theme="dark"
            period={selectedPeriod}
          />
        </div>

        {/* Features Info */}
        <div className="mt-6 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">🚀 Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-blue-400 text-lg mb-2">📊 Technical Indicators</div>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Simple Moving Average (SMA)</li>
                <li>• Exponential Moving Average (EMA)</li>
                <li>• Bollinger Bands</li>
                <li>• Volume Histogram</li>
              </ul>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-green-400 text-lg mb-2">🛠 Drawing Tools</div>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Trend Lines</li>
                <li>• Shapes & Annotations</li>
                <li>• Fibonacci Retracements</li>
                <li>• Text Labels</li>
              </ul>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-purple-400 text-lg mb-2">⚡ Performance</div>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• CDN-based Lightweight Charts</li>
                <li>• Real-time Updates</li>
                <li>• Responsive Design</li>
                <li>• Professional UI</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartExample;