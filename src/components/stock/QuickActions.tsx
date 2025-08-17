'use client';

import React from 'react';

interface QuickActionsProps {
  symbol: string;
  isInWatchlist: boolean;
  onAddToWatchlist: (symbol: string) => void;
  onRemoveFromWatchlist: (symbol: string) => void;
  onViewFinancials: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  symbol,
  isInWatchlist,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  onViewFinancials
}) => {
  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      onRemoveFromWatchlist(symbol);
    } else {
      onAddToWatchlist(symbol);
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-2xl">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <button 
          onClick={handleWatchlistToggle}
          className={`w-full font-medium py-2 px-4 rounded-md transition-colors ${
            isInWatchlist 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isInWatchlist ? '❤️ Remove from Watchlist' : '⭐ Add to Watchlist'}
        </button>
        
        <button 
          onClick={onViewFinancials}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          📊 View Financials
        </button>
        
        <button 
          disabled
          className="w-full bg-gray-700 text-gray-400 font-medium py-2 px-4 rounded-md cursor-not-allowed"
          title="Coming Soon"
        >
          🔔 Set Price Alert (Coming Soon)
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
