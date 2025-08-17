'use client';

import React from 'react';

interface QuoteData {
  stock: {
    symbol: string;
    name: string;
    currentPrice: number;
    change: number;
    changePercent: number;
    exchange: string;
    sector: string;
    marketCap: number;
    pe: number;
    volume: number;
    dayHigh: number;
    dayLow: number;
    high52Week: number;
    low52Week: number;
    dividendYield: number;
    open: number;
  };
  source: string;
  timestamp: string;
}

interface StockInfo {
  symbol: string;
  company_name: string;
  exchange: string;
  sector?: string;
  industry?: string;
  isin?: string;
  market_cap?: number;
  stock_type: string;
  lot_size: number;
  is_active: boolean;
}

interface StockHeaderProps {
  symbol: string;
  quoteData: QuoteData | null;
  stockInfo: StockInfo | null;
}

const StockHeader: React.FC<StockHeaderProps> = ({ symbol, quoteData, stockInfo }) => {
  const formatNumber = (value: number, decimals: number = 2) => {
    return value.toFixed(decimals);
  };

  const formatCurrency = (value: number) => {
    return `₹${formatNumber(value)}`;
  };

  return (
    <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-4">
          {/* Main Stock Info */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  {symbol}
                </h1>
                {quoteData && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">
                      {formatCurrency(quoteData.stock.currentPrice)}
                    </span>
                    <div className="flex flex-col items-start">
                      <span className={`text-sm font-medium ${
                        quoteData.stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {quoteData.stock.change >= 0 ? '+' : ''}{formatCurrency(quoteData.stock.change)}
                      </span>
                      <span className={`text-sm font-medium ${
                        quoteData.stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        ({quoteData.stock.changePercent >= 0 ? '+' : ''}{formatNumber(quoteData.stock.changePercent)}%)
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {quoteData && (
                <p className="text-lg text-gray-300 max-w-2xl">
                  {quoteData.stock.name}
                </p>
              )}
              
              {/* Sector and Industry Info */}
              {quoteData && (
                <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                  <span>Sector: <span className="text-gray-300">{quoteData.stock.sector}</span></span>
                  {stockInfo?.industry && (
                    <>
                      <span>|</span>
                      <span>Industry: <span className="text-gray-300">{stockInfo.industry}</span></span>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Exchange and Stock Type Tags */}
            {quoteData && (
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {quoteData.stock.exchange}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                  {quoteData.stock.sector}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {stockInfo?.stock_type || 'EQUITY'}
                </span>
              </div>
            )}
          </div>

          {/* Additional Price Info */}
          {quoteData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Open: </span>
                <span className="text-white">{formatCurrency(quoteData.stock.open)}</span>
              </div>
              <div>
                <span className="text-gray-400">High: </span>
                <span className="text-white">{formatCurrency(quoteData.stock.dayHigh)}</span>
              </div>
              <div>
                <span className="text-gray-400">Low: </span>
                <span className="text-white">{formatCurrency(quoteData.stock.dayLow)}</span>
              </div>
              <div>
                <span className="text-gray-400">Volume: </span>
                <span className="text-white">{quoteData.stock.volume.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockHeader;
