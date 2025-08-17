// components/charts/hooks/useChartData.ts
import { useState, useEffect } from 'react';

interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export const useChartData = (symbol: string, period: string) => {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateSampleData = (symbol: string, period: string): ChartData[] => {
      const now = new Date();
      const dataPoints = 200; // Generate 200 data points
      const data: ChartData[] = [];
      
      let basePrice = 100; // Starting price
      
      for (let i = dataPoints - 1; i >= 0; i--) {
        const date = new Date(now);
        
        // Adjust date based on period
        switch (period) {
          case '1D':
            date.setMinutes(date.getMinutes() - i * 5); // 5-minute intervals
            break;
          case '1W':
            date.setHours(date.getHours() - i); // Hourly intervals
            break;
          case '1M':
            date.setDate(date.getDate() - i); // Daily intervals
            break;
          case '6M':
            date.setDate(date.getDate() - i * 3); // 3-day intervals
            break;
          case '1Y':
            date.setDate(date.getDate() - i * 7); // Weekly intervals
            break;
          default:
            date.setDate(date.getDate() - i); // Daily intervals
        }

        // Generate realistic OHLC data
        const volatility = 0.02; // 2% volatility
        const change = (Math.random() - 0.5) * basePrice * volatility;
        const open = basePrice;
        const close = basePrice + change;
        
        const high = Math.max(open, close) + Math.random() * basePrice * volatility * 0.5;
        const low = Math.min(open, close) - Math.random() * basePrice * volatility * 0.5;
        
        const volume = Math.floor(Math.random() * 1000000) + 100000;

        data.push({
          time: date.toISOString().split('T')[0], // YYYY-MM-DD format
          open: Number(open.toFixed(2)),
          high: Number(high.toFixed(2)),
          low: Number(low.toFixed(2)),
          close: Number(close.toFixed(2)),
          volume: volume,
        });

        basePrice = close; // Use close as next open
      }

      return data.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    };

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      setTimeout(() => {
        const sampleData = generateSampleData(symbol, period);
        setData(sampleData);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to load chart data');
      setIsLoading(false);
    }
  }, [symbol, period]);

  return { data, isLoading, error };
};