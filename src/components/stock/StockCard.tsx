'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stock } from '@/lib/types/stock';
import { formatCurrency, formatPercentage, getChangeColor } from '@/lib/utils';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';

interface StockCardProps {
  stock: Stock;
  onSelect: (symbol: string) => void;
  onAddToWatchlist: (symbol: string) => void;
  isInWatchlist: boolean;
}

export const StockCard: React.FC<StockCardProps> = ({
  stock,
  onSelect,
  onAddToWatchlist,
  isInWatchlist
}) => {
  const changeColor = getChangeColor(stock.change);
  const isPositive = stock.change >= 0;

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 
                  className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 truncate"
                  onClick={() => onSelect(stock.symbol)}
                >
                  {stock.symbol}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {stock.exchange}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {stock.name}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onAddToWatchlist(stock.symbol);
              }}
              className="flex-shrink-0"
            >
              <Star className={`h-4 w-4 ${isInWatchlist ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
            </Button>
          </div>

          {/* Price Information */}
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(stock.currentPrice)}
            </div>
            
            <div className={`flex items-center gap-1 ${changeColor}`}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="font-semibold">
                {isPositive ? '+' : ''}{formatCurrency(stock.change)}
              </span>
              <span className="font-semibold">
                ({formatPercentage(stock.changePercent)})
              </span>
            </div>
          </div>

          {/* Additional Info - Hidden on small screens, shown on larger screens */}
          <div className="hidden sm:block pt-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Volume</span>
                <div className="font-medium">
                  {stock.volume ? (stock.volume / 1000000).toFixed(2) + 'M' : 'N/A'}
                </div>
              </div>
              <div>
                <span className="text-gray-500">P/E</span>
                <div className="font-medium">{stock.pe ? stock.pe.toFixed(2) : 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Mobile Action Button */}
          <div className="sm:hidden pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => onSelect(stock.symbol)}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
