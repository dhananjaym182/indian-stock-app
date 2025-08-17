'use client';

import React from 'react';

interface RecommendationData {
  rating: string;
  targetPrice: number;
  currentPrice: number;
  upside: number;
  analystCount: number;
  buyCount: number;
  holdCount: number;
  sellCount: number;
  averageRating: number;
  summary: string;
  keyPoints: string[];
  indicators?: {
    rsi: number;
    ma20: number;
    ma50: number;
    ma200: number;
    macd: number;
    signal: number;
  };
}

interface RecommendationsTabProps {
  recommendations: RecommendationData | null;
  loading: boolean;
}

const RecommendationsTab: React.FC<RecommendationsTabProps> = ({ recommendations, loading }) => {
  const formatNumber = (value: any, decimals: number = 2) => {
    if (value === undefined || value === null || isNaN(value)) {
      return 'N/A';
    }
    return Number(value).toFixed(decimals);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-400">Loading recommendations...</span>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-2">No recommendation data available</p>
        <p className="text-sm text-gray-500">Check if your Python backend has the recommendations endpoint</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-center">
            <div className={`text-2xl font-bold mb-1 ${
              recommendations.rating.toLowerCase().includes('buy') ? 'text-green-400' :
              recommendations.rating.toLowerCase().includes('sell') ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {recommendations.rating}
            </div>
            <div className="text-sm text-gray-400">Overall Rating</div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              ₹{formatNumber(recommendations.targetPrice)}
            </div>
            <div className="text-sm text-gray-400">Target Price</div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-center">
            <div className={`text-2xl font-bold mb-1 ${
              recommendations.upside > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {recommendations.upside > 0 ? '+' : ''}{formatNumber(recommendations.upside)}%
            </div>
            <div className="text-sm text-gray-400">Upside Potential</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-white mb-3">Analyst Breakdown</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-green-400">{recommendations.buyCount || 0}</div>
            <div className="text-xs text-gray-400">Buy</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-400">{recommendations.holdCount || 0}</div>
            <div className="text-xs text-gray-400">Hold</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-red-400">{recommendations.sellCount || 0}</div>
            <div className="text-xs text-gray-400">Sell</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-400">{recommendations.analystCount || 1}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
        </div>
      </div>

      {recommendations.indicators && (
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-3">Technical Indicators</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-lg font-bold ${
                recommendations.indicators.rsi > 70 ? 'text-red-400' :
                recommendations.indicators.rsi < 30 ? 'text-green-400' : 'text-orange-400'
              }`}>
                {formatNumber(recommendations.indicators.rsi)}
              </div>
              <div className="text-xs text-gray-400">RSI</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-cyan-400">
                ₹{formatNumber(recommendations.indicators.ma20)}
              </div>
              <div className="text-xs text-gray-400">MA20</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-indigo-400">
                ₹{formatNumber(recommendations.indicators.ma50)}
              </div>
              <div className="text-xs text-gray-400">MA50</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-pink-400">
                ₹{formatNumber(recommendations.indicators.ma200)}
              </div>
              <div className="text-xs text-gray-400">MA200</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-teal-400">
                {formatNumber(recommendations.indicators.macd, 4)}
              </div>
              <div className="text-xs text-gray-400">MACD</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-lime-400">
                {formatNumber(recommendations.indicators.signal, 4)}
              </div>
              <div className="text-xs text-gray-400">Signal</div>
            </div>
          </div>
        </div>
      )}

      {recommendations.keyPoints && recommendations.keyPoints.length > 0 && (
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-3">Key Points</h3>
          <ul className="space-y-2">
            {recommendations.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-green-400 mt-1">•</span>
                <span className="text-gray-300 text-sm">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recommendations.summary && (
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-3">Summary</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{recommendations.summary}</p>
        </div>
      )}
    </div>
  );
};

export default RecommendationsTab;
