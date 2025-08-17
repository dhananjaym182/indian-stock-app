'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface StockData {
  symbol: string;
  company_name: string;
  exchange: string;
  sector?: string;
}

const HeaderSearchBox: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        
        // ✅ FIXED: Handle different response structures from your Python backend
        let results = [];
        if (Array.isArray(data)) {
          results = data;
        } else if (data && typeof data === 'object') {
          if (Array.isArray(data.stocks)) {
            results = data.stocks;
          } else if (data.data && Array.isArray(data.data)) {
            results = data.data;
          } else {
            results = [];
          }
        }
        
        setSearchResults(Array.isArray(results) ? results.slice(0, 8) : []);
        setShowResults(results.length > 0);
      } else {
        console.warn('Search API returned:', response.status);
        setSearchResults([]);
        setShowResults(false);
      }
    } catch (error) {
      console.error('Header search error:', error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (symbol: string) => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    router.push(`/stocks/${symbol}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim().length > 0) {
      if (searchResults.length > 0) {
        handleResultClick(searchResults[0].symbol);
      } else {
        // If no results but user presses enter, go to stocks page with search
        router.push(`/stocks?search=${encodeURIComponent(searchQuery)}`);
      }
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="relative hidden sm:block" ref={searchRef}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search stocks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (searchResults.length > 0) setShowResults(true);
        }}
        className="block w-full pl-10 pr-10 py-2 border border-gray-700 rounded-md leading-5 bg-gray-800 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
      {isSearching && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-2xl max-h-80 overflow-y-auto">
          {searchResults.map((stock, index) => (
            <button
              key={`${stock.symbol}-${index}`}
              onClick={() => handleResultClick(stock.symbol)}
              className="w-full text-left px-3 py-2 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0 focus:outline-none focus:bg-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white text-sm">{stock.symbol}</div>
                  <div className="text-xs text-gray-400 truncate max-w-[200px]">
                    {stock.company_name}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <div className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded">
                    {stock.exchange}
                  </div>
                  {stock.sector && (
                    <div className="text-xs text-gray-500">
                      {stock.sector}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
          
          {/* Show "Search all stocks" option */}
          <button
            onClick={() => {
              setSearchQuery('');
              setShowResults(false);
              router.push(`/stocks?search=${encodeURIComponent(searchQuery)}`);
            }}
            className="w-full text-left px-3 py-2 hover:bg-gray-700 transition-colors border-t border-gray-600 bg-gray-800/50"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm text-gray-300">
                Search all stocks for "{searchQuery}"
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default HeaderSearchBox;
