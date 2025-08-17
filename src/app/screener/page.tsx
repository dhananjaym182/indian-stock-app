'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface StockResult {
  symbol: string;
  company_name: string;
  marketCap: number;
  peRatio: number;
  sector: string;
  exchange: string;
}

const ScreenerPage: React.FC = () => {
  const [filters, setFilters] = useState({
    marketCap: '',
    peRatio: '',
    sector: '',
    exchange: ''
  });

  const [results, setResults] = useState<StockResult[]>([
    { symbol: 'RELIANCE', company_name: 'Reliance Industries Limited', marketCap: 1876543, peRatio: 12.5, sector: 'Oil & Gas', exchange: 'NSE' },
    { symbol: 'TCS', company_name: 'Tata Consultancy Services Limited', marketCap: 1234567, peRatio: 28.3, sector: 'IT Services', exchange: 'NSE' },
    { symbol: 'HDFCBANK', company_name: 'HDFC Bank Limited', marketCap: 987654, peRatio: 18.7, sector: 'Banking', exchange: 'NSE' },
  ]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const applyFilters = () => {
    // Filter logic would go here
    console.log('Applying filters:', filters);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Stock Screener</h1>
          <p className="text-gray-400">Find stocks based on your criteria</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Filters</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Market Cap</label>
                  <select 
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.marketCap}
                    onChange={(e) => handleFilterChange('marketCap', e.target.value)}
                  >
                    <option value="">Any</option>
                    <option value="large">Large Cap (₹20,000+ Cr)</option>
                    <option value="mid">Mid Cap (₹5,000-20,000 Cr)</option>
                    <option value="small">Small Cap (₹5,000- Cr)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">P/E Ratio</label>
                  <select 
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.peRatio}
                    onChange={(e) => handleFilterChange('peRatio', e.target.value)}
                  >
                    <option value="">Any</option>
                    <option value="low">Low (15-)</option>
                    <option value="medium">Medium (15-25)</option>
                    <option value="high">High (25+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sector</label>
                  <select 
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.sector}
                    onChange={(e) => handleFilterChange('sector', e.target.value)}
                  >
                    <option value="">Any</option>
                    <option value="IT Services">IT Services</option>
                    <option value="Banking">Banking</option>
                    <option value="Oil & Gas">Oil & Gas</option>
                    <option value="Pharmaceuticals">Pharmaceuticals</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Telecom">Telecom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Exchange</label>
                  <select 
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.exchange}
                    onChange={(e) => handleFilterChange('exchange', e.target.value)}
                  >
                    <option value="">Any</option>
                    <option value="NSE">NSE</option>
                    <option value="BSE">BSE</option>
                  </select>
                </div>

                <button 
                  onClick={applyFilters}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Apply Filters
                </button>

                <button 
                  onClick={() => setFilters({ marketCap: '', peRatio: '', sector: '', exchange: '' })}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Results ({results.length} stocks)</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Sort by:</span>
                  <select className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="marketCap">Market Cap</option>
                    <option value="peRatio">P/E Ratio</option>
                    <option value="symbol">Symbol</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                {results.map((stock) => (
                  <div key={stock.symbol} className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800/70 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Link 
                            href={`/stocks/${stock.symbol}`} 
                            className="font-semibold text-white hover:text-blue-400 transition-colors text-lg"
                          >
                            {stock.symbol}
                          </Link>
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30">
                            {stock.exchange}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 truncate max-w-md">{stock.company_name}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                            {stock.sector}
                          </span>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-sm text-gray-300">
                          <span className="text-gray-400">Market Cap:</span> ₹{(stock.marketCap / 10000).toFixed(0)}K Cr
                        </div>
                        <div className="text-sm text-gray-300">
                          <span className="text-gray-400">P/E:</span> {stock.peRatio}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {results.length === 0 && (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-xl text-gray-300 mb-2">No stocks found</h3>
                  <p className="text-gray-500">Try adjusting your filters to see more results</p>
                </div>
              )}
            </div>

            {/* Quick Filters */}
            <div className="mt-6 bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Filters</h3>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Top Gainers
                </button>
                <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                  Top Losers
                </button>
                <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  High Volume
                </button>
                <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                  Low P/E
                </button>
                <button className="px-3 py-1 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors">
                  High Dividend
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenerPage;
