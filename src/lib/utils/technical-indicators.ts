import { ChartData } from '../types/stock';

export class TechnicalIndicators {
  static calculateSMA(data: ChartData[], period: number): number[] {
    const sma: number[] = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, item) => acc + item.close, 0);
      sma.push(sum / period);
    }
    return sma;
  }

  static calculateEMA(data: ChartData[], period: number): number[] {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    
    // Start with SMA for first value
    let previousEMA = data.slice(0, period).reduce((acc, item) => acc + item.close, 0) / period;
    ema.push(previousEMA);
    
    for (let i = period; i < data.length; i++) {
      const currentEMA = (data[i].close * multiplier) + (previousEMA * (1 - multiplier));
      ema.push(currentEMA);
      previousEMA = currentEMA;
    }
    
    return ema;
  }

  static calculateRSI(data: ChartData[], period: number = 14): number[] {
    const rsi: number[] = [];
    const changes: number[] = [];
    
    // Calculate price changes
    for (let i = 1; i < data.length; i++) {
      changes.push(data[i].close - data[i - 1].close);
    }
    
    for (let i = period; i <= changes.length; i++) {
      const recentChanges = changes.slice(i - period, i);
      const gains = recentChanges.filter(change => change > 0);
      const losses = recentChanges.filter(change => change < 0).map(loss => Math.abs(loss));
      
      const avgGain = gains.length > 0 ? gains.reduce((acc, gain) => acc + gain, 0) / period : 0;
      const avgLoss = losses.length > 0 ? losses.reduce((acc, loss) => acc + loss, 0) / period : 0;
      
      if (avgLoss === 0) {
        rsi.push(100);
      } else {
        const rs = avgGain / avgLoss;
        rsi.push(100 - (100 / (1 + rs)));
      }
    }
    
    return rsi;
  }

  // ✅ FIXED: Properly typed bands object
  static calculateBollingerBands(data: ChartData[], period: number = 20, stdDev: number = 2) {
    const sma = this.calculateSMA(data, period);
    const bands: { upper: number[], middle: number[], lower: number[] } = { 
      upper: [], 
      middle: [], 
      lower: [] 
    };
    
    for (let i = period - 1; i < data.length; i++) {
      const relevantData = data.slice(i - period + 1, i + 1);
      const mean = sma[i - period + 1];
      const variance = relevantData.reduce((acc, item) => acc + Math.pow(item.close - mean, 2), 0) / period;
      const standardDeviation = Math.sqrt(variance);
      
      bands.upper.push(mean + (stdDev * standardDeviation));
      bands.middle.push(mean);
      bands.lower.push(mean - (stdDev * standardDeviation));
    }
    
    return bands;
  }

  static calculateMACD(data: ChartData[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9) {
    const fastEMA = this.calculateEMA(data, fastPeriod);
    const slowEMA = this.calculateEMA(data, slowPeriod);
    
    const macdLine: number[] = [];
    const startIndex = slowPeriod - fastPeriod;
    
    for (let i = 0; i < slowEMA.length; i++) {
      macdLine.push(fastEMA[i + startIndex] - slowEMA[i]);
    }
    
    // Calculate signal line (EMA of MACD line)
    const signalData = macdLine.map((value, index) => ({
      close: value,
      timestamp: data[index + slowPeriod - 1].timestamp,
      open: value,
      high: value,
      low: value,
      volume: 0
    }));
    
    const signalLine = this.calculateEMA(signalData, signalPeriod);
    const histogram: number[] = [];
    
    for (let i = 0; i < signalLine.length; i++) {
      histogram.push(macdLine[i + signalPeriod - 1] - signalLine[i]);
    }
    
    return { macd: macdLine, signal: signalLine, histogram };
  }
}
