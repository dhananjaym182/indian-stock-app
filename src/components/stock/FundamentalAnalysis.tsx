'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Stock } from '@/lib/types/stock';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart } from 'lucide-react';

interface FundamentalAnalysisProps {
  symbol: string;
  stock: Stock;
}

export const FundamentalAnalysis: React.FC<FundamentalAnalysisProps> = ({
  symbol,
  stock
}) => {
  // Mock fundamental data - in real app, this would come from API
  const fundamentals = {
    marketCap: stock.marketCap || 0,
    peRatio: stock.pe || 0,
    pbRatio: 2.45,
    debtToEquity: 0.65,
    roe: 15.8,
    revenue: 125000000000, // 125B
    netIncome: 25000000000, // 25B
    eps: 125.50,
    bookValue: 890.25,
    dividendYield: (stock.dividendYield || 0) * 100,
    priceToSales: 3.2,
    currentRatio: 1.8,
    quickRatio: 1.4,
    grossMargin: 42.5,
    operatingMargin: 18.7,
    netMargin: 12.3
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Calculate fundamental score (simplified)
  const calculateScore = () => {
    let score = 50; // Base score
    
    if (fundamentals.peRatio > 0 && fundamentals.peRatio < 25) score += 10;
    if (fundamentals.roe > 15) score += 15;
    if (fundamentals.debtToEquity < 1) score += 10;
    if (fundamentals.currentRatio > 1.5) score += 10;
    if (fundamentals.netMargin > 10) score += 5;
    
    return Math.min(100, score);
  };

  const fundamentalScore = calculateScore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Overall Score */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Fundamental Analysis Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Rating</span>
                <span className={`text-lg font-bold ${getScoreColor(fundamentalScore)}`}>
                  {fundamentalScore}/100
                </span>
              </div>
              <Progress value={fundamentalScore} className="h-3" />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Investment Grade</p>
              <p className={`font-semibold ${getScoreColor(fundamentalScore)}`}>
                {fundamentalScore >= 80 ? 'Excellent' : fundamentalScore >= 60 ? 'Good' : 'Fair'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Valuation Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Valuation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Market Cap</span>
            <span className="font-medium">{formatNumber(fundamentals.marketCap)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">P/E Ratio</span>
            <span className="font-medium">{fundamentals.peRatio.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">P/B Ratio</span>
            <span className="font-medium">{fundamentals.pbRatio.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Dividend Yield</span>
            <span className="font-medium">{fundamentals.dividendYield.toFixed(2)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Profitability Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Profitability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">ROE</span>
            <span className="font-medium">{fundamentals.roe.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Net Margin</span>
            <span className="font-medium">{fundamentals.netMargin.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Operating Margin</span>
            <span className="font-medium">{fundamentals.operatingMargin.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Gross Margin</span>
            <span className="font-medium">{fundamentals.grossMargin.toFixed(2)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Financial Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Financial Health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Debt/Equity</span>
            <span className="font-medium">{fundamentals.debtToEquity.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Current Ratio</span>
            <span className="font-medium">{fundamentals.currentRatio.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Quick Ratio</span>
            <span className="font-medium">{fundamentals.quickRatio.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Book Value</span>
            <span className="font-medium">{formatCurrency(fundamentals.bookValue)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
