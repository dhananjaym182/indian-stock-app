'use client';

import React, { useState, useEffect } from 'react';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

const MarketsPage: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate market data loading
    setTimeout(() => {
      setMarketData([
        { symbol: 'RELIANCE', price: 2456.75, change: 34.25, changePercent: 1.42, volume: 2345678 },
        { symbol: 'TCS', price: 3876.50, change: -12.25, changePercent: -0.31, volume: 1234567 },
        { symbol: 'HDFCBANK', price: 1678.90, change: 23.15, changePercent: 1.40, volume: 3456789 },
        { symbol: 'INFY', price: 1543.25, change: 15.75, changePercent: 1.03, volume: 2567890 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Markets</h1>
          <p className="text-gray-400">Real-time market data and analysis</p>
        </header>

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">NIFTY 50</h3>
            <div className="text-2xl font-bold text-white">24,653.90</div>
            <div className="text-green-400 text-sm">+34.55 (+0.14%)</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">SENSEX</h3>
            <div className="text-2xl font-bold text-white">80,617.48</div>
            <div className="text-green-400 text-sm">+77.57 (+0.10%)</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">NIFTY BANK</h3>
            <div className="text-2xl font-bold text-white">50,238.15</div>
            <div className="text-red-400 text-sm">-156.78 (-0.31%)</div>
          </div>
        </div>

        {/* Top Movers */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Top Movers</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 text-gray-300 font-medium">Symbol</th>
                  <th className="text-right py-3 text-gray-300 font-medium">Price</th>
                  <th className="text-right py-3 text-gray-300 font-medium">Change</th>
                  <th className="text-right py-3 text-gray-300 font-medium">Volume</th>
                </tr>
              </thead>
              <tbody>
                {marketData.map((stock) => (
                  <tr key={stock.symbol} className="border-b border-gray-800/50">
                    <td className="py-3 text-white font-medium">{stock.symbol}</td>
                    <td className="py-3 text-right text-white">₹{stock.price.toFixed(2)}</td>
                    <td className={`py-3 text-right font-medium ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </td>
                    <td className="py-3 text-right text-gray-400">{stock.volume.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketsPage;
