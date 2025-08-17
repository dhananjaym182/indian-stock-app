'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { StockCard } from './StockCard';
import { Button } from '@/components/ui/button';
import { Stock } from '@/lib/types/stock';
import { YahooFinanceAPI } from '@/lib/api/yahoo-finance';
import { RefreshCw, Filter, Grid, List } from 'lucide-react';

interface StockListProps {
  onStockSelect: (symbol: string) => void;
}

// ✅ UPDATED: Consistent stock data display
const fetcher = async (symbols: string[]) => {
  const promises = symbols.map(symbol => 
    fetch(`/api/stocks/${symbol}`).then(res => res.json())
  );
  const results = await Promise.allSettled(promises);
  return results
    .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
    .map(result => result.value.stock)
    .filter(Boolean);
};


export const StockList: React.FC<StockListProps> = ({ onStockSelect }) => {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'change'>('symbol');
  const [filterSector, setFilterSector] = useState<string>('all');

  // Get popular Indian stocks
  const [popularStocks, setPopularStocks] = useState<string[]>([]);

  useEffect(() => {
    const loadPopularStocks = async () => {
      const stocks = await YahooFinanceAPI.getPopularIndianStocks();
      setPopularStocks(stocks.map(s => s.replace(/\.(NS|BO)$/, '')));
    };
    loadPopularStocks();

    // Load watchlist from localStorage
    const savedWatchlist = localStorage.getItem('stockWatchlist');
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
  }, []);

  const { data: stocks, error, mutate, isLoading } = useSWR(
    popularStocks.length > 0 ? popularStocks : null,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  const addToWatchlist = (symbol: string) => {
    const newWatchlist = watchlist.includes(symbol)
      ? watchlist.filter(s => s !== symbol)
      : [...watchlist, symbol];
    
    setWatchlist(newWatchlist);
    localStorage.setItem('stockWatchlist', JSON.stringify(newWatchlist));
  };

  const handleRefresh = () => {
    mutate();
  };

  const sortedAndFilteredStocks = React.useMemo(() => {
    if (!stocks) return [];

    let filtered = [...stocks];

    // Filter by sector
    if (filterSector !== 'all') {
      filtered = filtered.filter(stock => stock.sector === filterSector);
    }

    // Sort stocks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.currentPrice - a.currentPrice;
        case 'change':
          return b.changePercent - a.changePercent;
        default:
          return a.symbol.localeCompare(b.symbol);
      }
    });

    return filtered;
  }, [stocks, sortBy, filterSector]);

  // Get unique sectors
  const sectors = React.useMemo(() => {
    if (!stocks) return [];
    const sectorSet = new Set(stocks.map(stock => stock.sector).filter(Boolean));
    return Array.from(sectorSet);
  }, [stocks]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load stocks</p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="symbol">Sort by Symbol</option>
              <option value="price">Sort by Price</option>
              <option value="change">Sort by Change</option>
            </select>
          </div>

          <select
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="all">All Sectors</option>
            {sectors.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stock Grid/List */}
      <div className={
        viewMode === 'grid'
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6'
    : 'space-y-4'
      }>
        {sortedAndFilteredStocks.map((stock) => (
          <StockCard
            key={stock.symbol}
            stock={stock}
            onSelect={onStockSelect}
            onAddToWatchlist={addToWatchlist}
            isInWatchlist={watchlist.includes(stock.symbol)}
          />
        ))}
      </div>

      {sortedAndFilteredStocks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No stocks found matching your criteria
        </div>
      )}
    </div>
  );
};
