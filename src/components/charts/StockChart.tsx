'use client';

import React, { useState, useEffect } from 'react';
import CandleStickChart from './CandleStickChart';

interface StockChartProps {
  symbol: string;
}

const StockChart: React.FC<StockChartProps> = ({ symbol }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Sample data for testing (replace with your API call)
        const sampleData = [
          { time: '2023-01-01', open: 100, high: 105, low: 95, close: 102, volume: 1000000 },
          { time: '2023-01-02', open: 102, high: 108, low: 101, close: 106, volume: 1200000 },
          { time: '2023-01-03', open: 106, high: 110, low: 104, close: 109, volume: 900000 },
          { time: '2023-01-04', open: 109, high: 112, low: 107, close: 111, volume: 1100000 },
          { time: '2023-01-05', open: 111, high: 115, low: 110, close: 114, volume: 1300000 },
        ];
        
        // Uncomment when you have API ready
        // const response = await fetch(`/api/stocks/${symbol}/chart`);
        // if (!response.ok) {
        //   throw new Error('Failed to fetch chart data');
        // }
        // const data = await response.json();
        // const formattedData = data.map((item: any) => ({
        //   time: item.date,
        //   open: parseFloat(item.open),
        //   high: parseFloat(item.high),
        //   low: parseFloat(item.low),
        //   close: parseFloat(item.close),
        //   volume: parseInt(item.volume)
        // }));
        
        setChartData(sampleData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchStockData();
    }
  }, [symbol]);

  if (loading) {
    return <div className="chart-loading">Loading {symbol} chart...</div>;
  }

  if (error) {
    return <div className="chart-error">Error: {error}</div>;
  }

  return (
    <div className="stock-chart-container">
      <CandleStickChart
        data={chartData}
        symbol={symbol}
        width={1000}
        height={600}
        theme="dark"
      />
      
      <style jsx>{`
        .stock-chart-container {
          padding: 20px;
        }
        
        .chart-loading, .chart-error {
          text-align: center;
          padding: 40px;
          color: #d1d4dc;
        }
        
        .chart-error {
          color: #ef5350;
        }
      `}</style>
    </div>
  );
};

export default StockChart;
