'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Prediction } from '@/lib/types/stock';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingUp, TrendingDown, Target, Shield, Brain, AlertTriangle } from 'lucide-react';

interface PredictionCardProps {
  prediction: Prediction;
  currentPrice: number;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  currentPrice
}) => {
  const priceDiff = prediction.predictedPrice - currentPrice;
  const priceChangePercent = (priceDiff / currentPrice) * 100;
  
  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'BUY': return 'text-green-600 bg-green-50 border-green-200';
      case 'SELL': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 80) return { label: 'High', color: 'text-green-600' };
    if (confidence >= 60) return { label: 'Medium', color: 'text-yellow-600' };
    return { label: 'Low', color: 'text-red-600' };
  };

  const confidenceLevel = getConfidenceLevel(prediction.confidence);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          AI Prediction - {prediction.timeframe.toUpperCase()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recommendation Badge */}
        <div className="flex items-center justify-between">
          <div className={`px-4 py-2 rounded-lg border font-semibold ${getRecommendationColor(prediction.recommendation)}`}>
            {prediction.recommendation}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Confidence</p>
            <p className={`font-semibold ${confidenceLevel.color}`}>
              {prediction.confidence}% ({confidenceLevel.label})
            </p>
          </div>
        </div>

        {/* Price Prediction */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Current Price</p>
            <p className="text-2xl font-bold">{formatCurrency(currentPrice)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Predicted Price</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{formatCurrency(prediction.predictedPrice)}</p>
              {priceDiff > 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
            </div>
            <p className={`text-sm font-medium ${priceDiff > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(priceChangePercent)} ({priceDiff > 0 ? '+' : ''}{formatCurrency(priceDiff)})
            </p>
          </div>
        </div>

        {/* Support and Resistance */}
        {(prediction.supportLevel || prediction.resistanceLevel) && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            {prediction.supportLevel && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-500">Support</span>
                </div>
                <p className="font-semibold text-green-600">
                  {formatCurrency(prediction.supportLevel)}
                </p>
              </div>
            )}
            {prediction.resistanceLevel && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-gray-500">Resistance</span>
                </div>
                <p className="font-semibold text-red-600">
                  {formatCurrency(prediction.resistanceLevel)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Target and Stop Loss */}
        {(prediction.targetPrice || prediction.stopLoss) && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            {prediction.targetPrice && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-500">Target</span>
                </div>
                <p className="font-semibold text-blue-600">
                  {formatCurrency(prediction.targetPrice)}
                </p>
              </div>
            )}
            {prediction.stopLoss && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-gray-500">Stop Loss</span>
                </div>
                <p className="font-semibold text-orange-600">
                  {formatCurrency(prediction.stopLoss)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* AI Reasoning */}
        <div className="pt-4 border-t">
          <h4 className="font-medium text-gray-900 mb-2">AI Analysis</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {prediction.reasoning}
          </p>
        </div>

        {/* Disclaimer */}
        <div className="pt-4 border-t">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-500">
              This prediction is generated by AI and should not be considered as financial advice. 
              Please conduct your own research before making investment decisions.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
