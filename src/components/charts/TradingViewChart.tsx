'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

// Define interfaces for chart data and component props
interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface TradingViewChartProps {
  data: ChartData[];
  symbol: string;
  width?: number;
  height?: number;
  theme?: 'light' | 'dark';
  period?: string;
}

// Declare global LightweightCharts
declare global {
  interface Window {
    LightweightCharts: any;
  }
}

// Available indicators configuration
const AVAILABLE_INDICATORS = {
  SMA: { name: 'Simple Moving Average', periods: [20, 50, 100, 200], color: '#3b82f6' },
  EMA: { name: 'Exponential Moving Average', periods: [12, 26, 50], color: '#f59e0b' },
  BB: { name: 'Bollinger Bands', period: 20, color: '#8e44ad' },
  RSI: { name: 'Relative Strength Index', period: 14, color: '#e74c3c' },
  MACD: { name: 'MACD', periods: [12, 26, 9], color: '#2ecc71' },
  Volume: { name: 'Volume', color: '#26a69a' }
};

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  data,
  symbol,
  width = 1200,
  height = 700,
  theme = 'dark',
  period = '6M',
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [LightweightCharts, setLightweightCharts] = useState<any>(null);
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['Volume']);
  const [showIndicatorPanel, setShowIndicatorPanel] = useState(false);
  const [showDrawingTools, setShowDrawingTools] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const seriesRefs = useRef<Map<string, any>>(new Map());

  // Dynamic import for standalone version
  const loadLightweightCharts = useCallback(() => {
    return new Promise((resolve) => {
      if (window.LightweightCharts) {
        resolve(window.LightweightCharts);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/lightweight-charts@5.0.8/dist/lightweight-charts.standalone.production.js';
      script.onload = () => {
        resolve(window.LightweightCharts);
      };
      script.onerror = () => {
        console.error('Failed to load Lightweight Charts');
        resolve(null);
      };
      document.head.appendChild(script);
    });
  }, []);

  // Initialize Lightweight Charts
  useEffect(() => {
    setIsLoading(true);
    loadLightweightCharts().then((charts) => {
      setLightweightCharts(charts);
      setIsLoading(false);
    });
  }, [loadLightweightCharts]);

  // Technical Indicator Calculations
  const calculateSMA = useCallback((data: ChartData[], period: number) => {
    const sma: any[] = [];
    if (data.length < period) return [];
    
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, item) => acc + item.close, 0);
      sma.push({
        time: data[i].time,
        value: sum / period,
      });
    }
    return sma;
  }, []);

  const calculateEMA = useCallback((data: ChartData[], period: number) => {
    const ema: any[] = [];
    if (data.length < period) return [];
    
    const multiplier = 2 / (period + 1);
    let prevEMA = data.slice(0, period).reduce((acc, item) => acc + item.close, 0) / period;
    ema.push({ time: data[period - 1].time, value: prevEMA });
    
    for (let i = period; i < data.length; i++) {
      const currentEMA = (data[i].close * multiplier) + (prevEMA * (1 - multiplier));
      ema.push({ time: data[i].time, value: currentEMA });
      prevEMA = currentEMA;
    }
    return ema;
  }, []);

  const calculateBollingerBands = useCallback((data: ChartData[], period: number = 20, stdDev: number = 2) => {
    const bbUpper: any[] = [];
    const bbLower: any[] = [];
    if (data.length < period) return { bbUpper: [], bbLower: [] };

    for (let i = period - 1; i < data.length; i++) {
      const slice = data.slice(i - period + 1, i + 1);
      const closes = slice.map(item => item.close);
      const sum = closes.reduce((acc, val) => acc + val, 0);
      const middle = sum / period;
      const variance = closes.reduce((acc, val) => acc + Math.pow(val - middle, 2), 0) / period;
      const standardDeviation = Math.sqrt(variance);
      const upper = middle + (standardDeviation * stdDev);
      const lower = middle - (standardDeviation * stdDev);

      bbUpper.push({ time: data[i].time, value: upper });
      bbLower.push({ time: data[i].time, value: lower });
    }
    return { bbUpper, bbLower };
  }, []);

  // Add indicators to chart
  const addIndicators = useCallback((chart: any, data: ChartData[]) => {
    // Clear existing indicator series (except candlestick)
    seriesRefs.current.forEach((series, key) => {
      if (key !== 'candlestick') {
        try {
          chart.removeSeries(series);
        } catch (error) {
          console.warn('Failed to remove series:', key, error);
        }
      }
    });

    // Clear refs except candlestick
    const candlestickSeries = seriesRefs.current.get('candlestick');
    seriesRefs.current.clear();
    if (candlestickSeries) {
      seriesRefs.current.set('candlestick', candlestickSeries);
    }

    activeIndicators.forEach(indicator => {
      try {
        switch (indicator) {
          case 'SMA20':
            const sma20Data = calculateSMA(data, 20);
            if (sma20Data.length > 0) {
              const sma20Series = chart.addSeries(LightweightCharts.LineSeries, {
                color: '#3b82f6',
                lineWidth: 2,
                title: 'SMA 20',
              });
              sma20Series.setData(sma20Data);
              seriesRefs.current.set('SMA20', sma20Series);
            }
            break;

          case 'SMA50':
            const sma50Data = calculateSMA(data, 50);
            if (sma50Data.length > 0) {
              const sma50Series = chart.addSeries(LightweightCharts.LineSeries, {
                color: '#f59e0b',
                lineWidth: 2,
                title: 'SMA 50',
              });
              sma50Series.setData(sma50Data);
              seriesRefs.current.set('SMA50', sma50Series);
            }
            break;

          case 'EMA50':
            const ema50Data = calculateEMA(data, 50);
            if (ema50Data.length > 0) {
              const ema50Series = chart.addSeries(LightweightCharts.LineSeries, {
                color: '#f59e0b',
                lineWidth: 2,
                title: 'EMA 50',
                lineStyle: LightweightCharts.LineStyle.Dotted,
              });
              ema50Series.setData(ema50Data);
              seriesRefs.current.set('EMA50', ema50Series);
            }
            break;

          case 'BB':
            const { bbUpper, bbLower } = calculateBollingerBands(data);
            if (bbUpper.length > 0) {
              const bbUpperSeries = chart.addSeries(LightweightCharts.LineSeries, {
                color: '#8e44ad',
                lineWidth: 1,
                lineStyle: LightweightCharts.LineStyle.Dashed,
                title: 'BB Upper',
              });
              const bbLowerSeries = chart.addSeries(LightweightCharts.LineSeries, {
                color: '#8e44ad',
                lineWidth: 1,
                lineStyle: LightweightCharts.LineStyle.Dashed,
                title: 'BB Lower',
              });
              bbUpperSeries.setData(bbUpper);
              bbLowerSeries.setData(bbLower);
              seriesRefs.current.set('BBUpper', bbUpperSeries);
              seriesRefs.current.set('BBLower', bbLowerSeries);
            }
            break;

          case 'Volume':
            if (data.some(d => d.volume && d.volume > 0)) {
              const volumeData = data.map(item => ({
                time: item.time,
                value: item.volume || 0,
                color: item.close >= item.open ? '#26a69a80' : '#ef535080',
              }));

              const volumeSeries = chart.addSeries(LightweightCharts.HistogramSeries, {
                color: '#26a69a',
                priceFormat: { type: 'volume' },
                priceScaleId: 'volume',
                title: 'Volume',
              });

              chart.priceScale('volume').applyOptions({
                scaleMargins: { top: 0.8, bottom: 0 },
                borderVisible: false,
              });

              volumeSeries.setData(volumeData);
              seriesRefs.current.set('Volume', volumeSeries);
            }
            break;
        }
      } catch (error) {
        console.error(`Failed to add indicator ${indicator}:`, error);
      }
    });
  }, [activeIndicators, calculateSMA, calculateEMA, calculateBollingerBands, LightweightCharts]);

  // Chart initialization and management
  useEffect(() => {
    if (!LightweightCharts || !chartContainerRef.current || !data || data.length === 0) {
      return;
    }

    // Clean up existing chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      seriesRefs.current.clear();
    }

    try {
      // Responsive chart dimensions
      const containerWidth = chartContainerRef.current.clientWidth;
      const responsiveWidth = Math.min(containerWidth, width);
      const responsiveHeight = Math.min(window.innerHeight * 0.7, height - 80);

      // Chart options
      const chartOptions = {
        layout: {
          background: {
            type: LightweightCharts.ColorType.Solid,
            color: theme === 'dark' ? '#0f0f0f' : '#ffffff'
          },
          textColor: theme === 'dark' ? '#d1d5db' : '#374151',
        },
        width: responsiveWidth,
        height: responsiveHeight,
        grid: {
          vertLines: { color: theme === 'dark' ? '#1f1f1f' : '#f0f0f0' },
          horzLines: { color: theme === 'dark' ? '#1f1f1f' : '#f0f0f0' },
        },
        crosshair: {
          mode: LightweightCharts.CrosshairMode.Normal,
        },
        rightPriceScale: {
          borderColor: theme === 'dark' ? '#333333' : '#d1d5db',
          scaleMargins: { top: 0.1, bottom: 0.2 },
        },
        timeScale: {
          borderColor: theme === 'dark' ? '#333333' : '#d1d5db',
          timeVisible: true,
          secondsVisible: false,
        },
      };

      const chart = LightweightCharts.createChart(chartContainerRef.current, chartOptions);
      chartRef.current = chart;

      const candlestickSeries = chart.addSeries(LightweightCharts.CandlestickSeries, {
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      const processedData = data
        .map(item => ({
          time: item.time,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        }))
        .filter(item => item.open > 0 && item.high > 0 && item.low > 0 && item.close > 0)
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

      candlestickSeries.setData(processedData);
      seriesRefs.current.set('candlestick', candlestickSeries);

      // Add active indicators
      addIndicators(chart, data);
      chart.timeScale().fitContent();

      // Handle resize
      const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
          const newWidth = Math.min(chartContainerRef.current.clientWidth, width);
          const newHeight = Math.min(window.innerHeight * 0.7, height - 80);
          
          chartRef.current.applyOptions({
            width: newWidth,
            height: newHeight,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
        }
        seriesRefs.current.clear();
      };

    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }, [LightweightCharts, data, theme, width, height, addIndicators]);

  const toggleIndicator = (indicator: string) => {
    setActiveIndicators(prev => {
      if (prev.includes(indicator)) {
        return prev.filter(i => i !== indicator);
      } else {
        return [...prev, indicator];
      }
    });
  };

  const drawingTools = [
    { id: 'trendline', icon: '📈', name: 'Trend Line' },
    { id: 'rectangle', icon: '⬜', name: 'Rectangle' },
    { id: 'circle', icon: '⭕', name: 'Circle' },
    { id: 'text', icon: '📝', name: 'Text' },
    { id: 'fibonacci', icon: '🌀', name: 'Fibonacci' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-900 text-white">
        <div className="text-lg">Loading Chart...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-900 text-white">
        <div className="text-xl mb-2">No chart data available</div>
        <div className="text-gray-400">Symbol: {symbol} | Period: {period}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full bg-gray-900 text-white overflow-hidden">
      {/* Responsive Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-3 bg-gray-800 border-b border-gray-700 gap-2">
        {/* Control Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Indicators Button */}
          <button
            onClick={() => setShowIndicatorPanel(!showIndicatorPanel)}
            className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all ${
              showIndicatorPanel
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            }`}
          >
            Indicators ({activeIndicators.length})
          </button>

          {/* Drawing Tools Button */}
          <button
            onClick={() => setShowDrawingTools(!showDrawingTools)}
            className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all ${
              showDrawingTools
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            }`}
          >
            Tools
          </button>
        </div>
      </div>

      {/* Main Chart Container */}
      <div className="relative w-full">
        {/* Drawing Tools Panel */}
        {showDrawingTools && (
          <div className="absolute top-0 left-0 z-10 bg-gray-800 border border-gray-600 rounded-lg p-3 m-3 shadow-lg">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {drawingTools.map((tool) => (
                <button
                  key={tool.id}
                  className="flex flex-col items-center p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all text-xs"
                >
                  <span className="text-lg mb-1">{tool.icon}</span>
                  <span className="text-gray-300">{tool.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chart Container */}
        <div 
          ref={chartContainerRef} 
          className="w-full bg-gray-900"
          style={{ minHeight: '400px' }}
        />

        {/* Indicator Panel */}
        {showIndicatorPanel && (
          <div className="absolute top-0 right-0 z-10 w-80 max-w-full bg-gray-800 border border-gray-600 rounded-lg p-4 m-3 shadow-lg max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Technical Indicators</h3>
              <button
                onClick={() => setShowIndicatorPanel(false)}
                className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg p-1 transition-all"
              >
                ✕
              </button>
            </div>

            {/* Indicator Categories */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Moving Averages</h4>
                <div className="space-y-2">
                  {[
                    { key: 'SMA20', name: 'Simple MA (20)', color: '#3b82f6' },
                    { key: 'SMA50', name: 'Simple MA (50)', color: '#f59e0b' },
                    { key: 'EMA50', name: 'Exponential MA (50)', color: '#10b981' }
                  ].map((indicator) => (
                    <label key={indicator.key} className="flex items-center text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={activeIndicators.includes(indicator.key)}
                        onChange={() => toggleIndicator(indicator.key)}
                        className="mr-3 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{indicator.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Volatility</h4>
                <label className="flex items-center text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={activeIndicators.includes('BB')}
                    onChange={() => toggleIndicator('BB')}
                    className="mr-3 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Bollinger Bands (20, 2)</span>
                </label>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Volume</h4>
                <label className="flex items-center text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={activeIndicators.includes('Volume')}
                    onChange={() => toggleIndicator('Volume')}
                    className="mr-3 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Volume Histogram</span>
                </label>
              </div>

              {/* Active Indicators Summary */}
              {activeIndicators.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Active Indicators</h4>
                  <div className="flex flex-wrap gap-1">
                    {activeIndicators.map((indicator) => (
                      <span
                        key={indicator}
                        className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full"
                      >
                        {indicator}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Responsive Bottom Status Bar */}
      <div className="flex flex-wrap items-center justify-between p-3 bg-gray-800 border-t border-gray-700 text-sm text-gray-300 gap-2">
        <div className="flex flex-wrap items-center gap-4">
          <span>📊 {data.length} data points</span>
          <span>🕒 Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
        {data.length > 0 && (
          <div className="flex flex-wrap items-center gap-4">
            <span>💰 Last: ₹{data[data.length - 1]?.close.toFixed(2)}</span>
            <span>📊 Vol: {data[data.length - 1]?.volume?.toLocaleString() || 'N/A'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingViewChart;
