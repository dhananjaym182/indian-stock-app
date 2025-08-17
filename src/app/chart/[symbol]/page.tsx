'use client';

import React, { useEffect, useState } from 'react';
import TradingViewChart from '@/components/charts/TradingViewChart';

interface OHLCVData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface ChartPageProps {
  params: Promise<{ symbol: string }>;
}

const ChartPage: React.FC<ChartPageProps> = ({ params }) => {
  const [symbol, setSymbol] = useState<string>('');
  const [data, setData] = useState<OHLCVData[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState<string>('6M');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeParams = async () => {
      try {
        const resolvedParams = await params;
        setSymbol(resolvedParams.symbol);
      } catch (error) {
        console.error('Error resolving params:', error);
      }
    };

    initializeParams();
  }, [params]);

  useEffect(() => {
    if (!symbol) return;
    fetchChartData('6M');
  }, [symbol]);

  const fetchChartData = async (period: string) => {
    setLoading(true);
    try {
      const chartResponse = await fetch(`/api/stocks/${symbol}/chart?period=${period}`);
      
      if (chartResponse.ok) {
        const chartData = await chartResponse.json();
        
        if (Array.isArray(chartData) && chartData.length > 0) {
          const formattedData: OHLCVData[] = chartData.map((item: any) => ({
            time: item.date || item.time?.split('T')?.[0] || new Date().toISOString().split('T'),
            open: parseFloat(item.open) || 0,
            high: parseFloat(item.high) || 0,
            low: parseFloat(item.low) || 0,
            close: parseFloat(item.close) || 0,
            volume: item.volume ? parseInt(item.volume) : undefined
          }));
          
          setData(formattedData);
          setCurrentPeriod(period);
        }
      }
    } catch (error) {
      console.error('Chart data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (period: string) => {
    fetchChartData(period);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-full mx-auto">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold text-white">{symbol} - Full Screen Chart</h1>
            <div className="flex flex-wrap gap-2">
              {['1D', '1W', '1M', '3M', '6M', '1Y'].map((period) => (
                <button
                  key={period}
                  onClick={() => handlePeriodChange(period)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                    period === currentPeriod
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  {period}
                </button>
              ))}
              <button
                onClick={() => window.close()}
                className="px-3 py-1 text-sm font-medium rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800 border border-gray-600"
              >
                ✕ Close
              </button>
            </div>
          </div>
          
          <div className="w-full overflow-hidden rounded-lg">
            {loading ? (
              <div className="flex items-center justify-center h-96 bg-gray-800 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading {symbol} chart...</p>
                </div>
              </div>
            ) : data.length > 0 ? (
              <TradingViewChart 
                data={data} 
                symbol={symbol}
                width={window.innerWidth - 100}
                height={window.innerHeight - 200}
                theme="dark"
                period={currentPeriod}
              />
            ) : (
              <div className="flex items-center justify-center h-96 bg-gray-800 rounded-lg">
                <div className="text-center">
                  <p className="text-gray-400">No chart data available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartPage;
