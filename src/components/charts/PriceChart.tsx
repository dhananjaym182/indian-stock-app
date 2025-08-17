'use client';

import React, { useState, useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartData } from '@/lib/types/stock';
import { formatCurrency } from '@/lib/utils';

interface PriceChartProps {
  data: ChartData[];
  symbol: string;
  supportLevel?: number;
  resistanceLevel?: number;
}

type TimeFrame = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';

export const PriceChart: React.FC<PriceChartProps> = ({
  data,
  symbol,
  supportLevel,
  resistanceLevel
}) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1M');
  const [showVolume, setShowVolume] = useState(true);

  const chartData = useMemo(() => {
  return data.map((item, index) => {
    // ✅ FIXED: Properly handle string or Date timestamp
    let timestamp: Date;
    
    if (typeof item.timestamp === 'string') {
      timestamp = new Date(item.timestamp);
    } else if (item.timestamp instanceof Date) {
      timestamp = item.timestamp;
    } else {
      // Fallback
      timestamp = new Date();
    }

    // Validate the date
    if (isNaN(timestamp.getTime())) {
      timestamp = new Date(); // Fallback to current date if invalid
    }

    return {
      ...item,
      timestamp: timestamp,
      date: timestamp.toLocaleDateString('en-IN'),
      dateTime: timestamp.getTime(),
      volumeColor: item.close > item.open ? '#10b981' : '#ef4444'
    };
  });
}, [data]);


  const timeFrameButtons: TimeFrame[] = ['1D', '1W', '1M', '3M', '6M', '1Y'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 text-sm">
            <p>Open: <span className="font-medium">{formatCurrency(data.open)}</span></p>
            <p>High: <span className="font-medium text-green-600">{formatCurrency(data.high)}</span></p>
            <p>Low: <span className="font-medium text-red-600">{formatCurrency(data.low)}</span></p>
            <p>Close: <span className="font-medium">{formatCurrency(data.close)}</span></p>
            <p>Volume: <span className="font-medium">{(data.volume / 1000000).toFixed(2)}M</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500">No chart data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{symbol} Price Chart</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg">
              {timeFrameButtons.map((tf) => (
                <Button
                  key={tf}
                  variant={timeFrame === tf ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeFrame(tf)}
                  className="rounded-none first:rounded-l-lg last:rounded-r-lg"
                >
                  {tf}
                </Button>
              ))}
            </div>
            <Button
              variant={showVolume ? "default" : "outline"}
              size="sm"
              onClick={() => setShowVolume(!showVolume)}
            >
              Volume
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {/* Price Line */}
              <Line
                type="monotone"
                dataKey="close"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="Close Price"
              />

              {/* Volume Bars */}
              {showVolume && (
                <Bar
                  dataKey="volume"
                  fill="#e5e7eb"
                  opacity={0.3}
                  yAxisId="volume"
                  name="Volume"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
