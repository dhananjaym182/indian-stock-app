'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const WatchlistPage: React.FC = () => {
  const [watchlist, setWatchlist] = useState([
    { symbol: 'RELIANCE', company_name: 'Reliance Industries Limited', price: 2456.75, change: 34.25, changePercent: 1.42 },
    { symbol: 'TCS', company_name: 'Tata Consultancy Services Limited', price: 3876.50, change: -12.25, changePercent: -0.31 },
    { symbol: 'HDFCBANK', company_name: 'HDFC Bank Limited', price: 1678.90, change: 23.15, changePercent: 1.40 },
  ]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Watchlist</h1>
          <p className="text-gray-400">Track your favorite stocks</p>
        </header>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          {watchlist.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <h3 className="text-xl text-gray-300 mb-2">Your watchlist is empty</h3>
              <p className="text-gray-500 mb-4">Start adding stocks to track their performance</p>
              <Link href="/stocks" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Browse Stocks
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {watchlist.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                  <div>
                    <Link href={`/stocks/${stock.symbol}`} className="font-semibold text-white hover:text-blue-400 transition-colors">
                      {stock.symbol}
                    </Link>
                    <p className="text-sm text-gray-400 truncate max-w-xs">{stock.company_name}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">₹{stock.price.toFixed(2)}</div>
                    <div className={`text-sm ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchlistPage;
