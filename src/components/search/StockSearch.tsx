'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchResult {
  symbol: string;
  shortname: string;
  exchange: string;
  sector?: string;
}

interface StockSearchProps {
  onSelect: (symbol: string) => void;
}

export const StockSearch: React.FC<StockSearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // ✅ ENHANCED: Search function that calls your Next.js API
  const searchStocks = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    try {
      console.log(`Searching for: "${searchQuery}"`);
      
      // Call your Next.js API route (which calls Python backend)
      const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(searchQuery)}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Search results:', data);
        
        setResults(data.stocks || []);
        setShowResults(true);
        
        if (data.stocks?.length === 0) {
          console.log('No results found');
        }
      } else {
        console.error('Search API error:', response.status, response.statusText);
        setResults([]);
        setShowResults(false);
      }
    } catch (error) {
      console.error('Search request failed:', error);
      setResults([]);
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchStocks(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

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

  const handleSelect = (symbol: string) => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    onSelect(symbol);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  // ✅ FIXED: Use proper event type instead of 'any'
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (query.length >= 2) {
      setShowResults(true);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      {/* ✅ FIXED: Use native HTML input instead of missing Input component */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search stocks (e.g., RELIANCE, HDFC, Tata)..."
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* ✅ ENHANCED: Search Results Dropdown */}
      {showResults && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <>
              {/* Results header */}
              <div className="px-4 py-2 text-xs text-gray-500 border-b bg-gray-50">
                Found {results.length} stocks
              </div>
              
              {/* Results list */}
              {results.map((stock, index) => (
                <div
                  key={`${stock.symbol}-${index}`}
                  onClick={() => handleSelect(stock.symbol)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{stock.symbol}</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          {stock.exchange}
                        </span>
                        {stock.sector && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {stock.sector}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {stock.shortname}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="px-4 py-6 text-center text-gray-500">
              {query.length >= 2 ? (
                <>
                  <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No stocks found for "{query}"</p>
                  <p className="text-xs mt-1">Try searching by symbol (RELIANCE) or company name (Tata)</p>
                </>
              ) : (
                <p>Type at least 2 characters to search</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
