'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChartData } from '@/lib/types/stock';
import { TechnicalIndicators as TechCalc } from '@/lib/utils/technical-indicators';
import { TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';

interface TechnicalIndicatorsProps {
  symbol: string;
  chartData: ChartData[];
}

export const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({
  symbol,
  chartData
}) => {
  const indicators = useMemo(() => {
    if (chartData.length < 50) return null;

    const rsi = TechCalc.calculateRSI(chartData);
    const macd = TechCalc.calculateMACD(chartData);
    const bb = TechCalc.calculateBollingerBands(chartData);
    const sma20 = TechCalc.calculateSMA(chartData, 20);
    const sma50 = TechCalc.calculateSMA(chartData, 50);

    return {
      rsi: rsi[rsi.length - 1] || 50,
      macd: {
        macd: macd.macd[macd.macd.length - 1] || 0,
        signal: macd.signal[macd.signal.length - 1] || 0,
        histogram: macd.histogram[macd.histogram.length - 1] || 0
      },
      bollingerBands: {
        upper: bb.upper[bb.upper.length - 1] || 0,
        middle: bb.middle[bb.middle.length - 1] || 0,
        lower: bb.lower[bb.lower.length - 1] || 0
      },
      sma20: sma20[sma20.length - 1] || 0,
      sma50: sma50[sma50.length - 1] || 0,
      currentPrice: chartData[chartData.length - 1]?.close || 0
    };
  }, [chartData]);

  if (!indicators) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            Insufficient data for technical analysis. Need at least 50 data points.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getRSISignal = (rsi: number) => {
    if (rsi > 70) return { signal: 'Overbought', color: 'text-red-600', action: 'SELL' };
    if (rsi < 30) return { signal: 'Oversold', color: 'text-green-600', action: 'BUY' };
    return { signal: 'Neutral', color: 'text-gray-600', action: 'HOLD' };
  };

  const getMACDSignal = (macd: number, signal: number) => {
    if (macd > signal) return { signal: 'Bullish', color: 'text-green-600', action: 'BUY' };
    return { signal: 'Bearish', color: 'text-red-600', action: 'SELL' };
  };

  const getBBSignal = (price: number, upper: number, lower: number) => {
    if (price > upper) return { signal: 'Overbought', color: 'text-red-600', action: 'SELL' };
    if (price < lower) return { signal: 'Oversold', color: 'text-green-600', action: 'BUY' };
    return { signal: 'Normal Range', color: 'text-gray-600', action: 'HOLD' };
  };

  const getSMASignal = (price: number, sma20: number, sma50: number) => {
    if (price > sma20 && sma20 > sma50) return { signal: 'Strong Uptrend', color: 'text-green-600', action: 'BUY' };
    if (price < sma20 && sma20 < sma50) return { signal: 'Strong Downtrend', color: 'text-red-600', action: 'SELL' };
    return { signal: 'Sideways', color: 'text-gray-600', action: 'HOLD' };
  };

  const rsiSignal = getRSISignal(indicators.rsi);
  const macdSignal = getMACDSignal(indicators.macd.macd, indicators.macd.signal);
  const bbSignal = getBBSignal(indicators.currentPrice, indicators.bollingerBands.upper, indicators.bollingerBands.lower);
  const smaSignal = getSMASignal(indicators.currentPrice, indicators.sma20, indicators.sma50);

  // Overall technical score
  const signals = [rsiSignal, macdSignal, bbSignal, smaSignal];
  const buySignals = signals.filter(s => s.action === 'BUY').length;
  const sellSignals = signals.filter(s => s.action === 'SELL').length;
  const overallSignal = buySignals > sellSignals ? 'BUY' : sellSignals > buySignals ? 'SELL' : 'HOLD';

  return (
    <div className="space-y-6">
      {/* Overall Technical Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Technical Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${
                overallSignal === 'BUY' ? 'text-green-600' : 
                overallSignal === 'SELL' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {overallSignal}
              </div>
              <p className="text-sm text-gray-500">Overall Signal</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2 text-green-600">{buySignals}</div>
              <p className="text-sm text-gray-500">Buy Signals</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2 text-red-600">{sellSignals}</div>
              <p className="text-sm text-gray-500">Sell Signals</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RSI */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">RSI (14)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{indicators.rsi.toFixed(1)}</span>
                <span className={`font-medium ${rsiSignal.color}`}>{rsiSignal.signal}</span>
              </div>
              <Progress value={indicators.rsi} className="h-3" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Oversold (30)</span>
                <span>Neutral (50)</span>
                <span>Overbought (70)</span>
              </div>
              <div className={`text-sm font-medium ${rsiSignal.color}`}>
                Signal: {rsiSignal.action}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MACD */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">MACD</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">MACD Line</p>
                  <p className="font-semibold">{indicators.macd.macd.toFixed(3)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Signal Line</p>
                  <p className="font-semibold">{indicators.macd.signal.toFixed(3)}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Histogram</p>
                <p className={`font-semibold ${indicators.macd.histogram >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {indicators.macd.histogram.toFixed(3)}
                </p>
              </div>
              <div className={`text-sm font-medium ${macdSignal.color}`}>
                Signal: {macdSignal.action} ({macdSignal.signal})
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bollinger Bands - ✅ FIXED with safe access */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bollinger Bands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <p className="text-gray-500">Upper</p>
                  <p className="font-semibold">₹{indicators.bollingerBands.upper?.toFixed(2) ?? 'N/A'}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">Middle</p>
                  <p className="font-semibold">₹{indicators.bollingerBands.middle?.toFixed(2) ?? 'N/A'}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">Lower</p>
                  <p className="font-semibold">₹{indicators.bollingerBands.lower?.toFixed(2) ?? 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Current Price</p>
                <p className="font-semibold text-lg">₹{indicators.currentPrice.toFixed(2)}</p>
              </div>
              <div className={`text-sm font-medium ${bbSignal.color}`}>
                Signal: {bbSignal.action} ({bbSignal.signal})
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Moving Averages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Moving Averages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">SMA 20</p>
                  <p className="font-semibold">₹{indicators.sma20.toFixed(2)}</p>
                  <p className={`text-xs ${indicators.currentPrice > indicators.sma20 ? 'text-green-600' : 'text-red-600'}`}>
                    {indicators.currentPrice > indicators.sma20 ? 'Above' : 'Below'} current price
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">SMA 50</p>
                  <p className="font-semibold">₹{indicators.sma50.toFixed(2)}</p>
                  <p className={`text-xs ${indicators.currentPrice > indicators.sma50 ? 'text-green-600' : 'text-red-600'}`}>
                    {indicators.currentPrice > indicators.sma50 ? 'Above' : 'Below'} current price
                  </p>
                </div>
              </div>
              <div className={`text-sm font-medium ${smaSignal.color}`}>
                Trend: {smaSignal.signal}
              </div>
              <div className={`text-sm font-medium ${smaSignal.color}`}>
                Signal: {smaSignal.action}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trading Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Technical Trading Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className={`p-3 rounded-lg ${rsiSignal.action === 'BUY' ? 'bg-green-50 border border-green-200' : 
                rsiSignal.action === 'SELL' ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
                <p className="text-sm text-gray-600">RSI</p>
                <p className={`font-semibold ${rsiSignal.color}`}>{rsiSignal.action}</p>
              </div>
              <div className={`p-3 rounded-lg ${macdSignal.action === 'BUY' ? 'bg-green-50 border border-green-200' : 
                macdSignal.action === 'SELL' ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
                <p className="text-sm text-gray-600">MACD</p>
                <p className={`font-semibold ${macdSignal.color}`}>{macdSignal.action}</p>
              </div>
              <div className={`p-3 rounded-lg ${bbSignal.action === 'BUY' ? 'bg-green-50 border border-green-200' : 
                bbSignal.action === 'SELL' ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
                <p className="text-sm text-gray-600">Bollinger</p>
                <p className={`font-semibold ${bbSignal.color}`}>{bbSignal.action}</p>
              </div>
              <div className={`p-3 rounded-lg ${smaSignal.action === 'BUY' ? 'bg-green-50 border border-green-200' : 
                smaSignal.action === 'SELL' ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
                <p className="text-sm text-gray-600">SMA</p>
                <p className={`font-semibold ${smaSignal.color}`}>{smaSignal.action}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                <strong>Analysis:</strong> The technical indicators show {buySignals} bullish signals and {sellSignals} bearish signals. 
                The overall recommendation is to <strong>{overallSignal}</strong> based on current technical conditions.
                Consider combining this with fundamental analysis and market sentiment for comprehensive decision making.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
