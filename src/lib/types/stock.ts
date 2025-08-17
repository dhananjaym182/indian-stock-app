export interface Stock {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  pe?: number;
  sector?: string;
  high52Week?: number;
  low52Week?: number;
  dividendYield?: number;
}

export interface ChartData {
  timestamp: string | Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// ✅ FIXED: Add technical indicators type
export interface TechnicalIndicators {
  rsi: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
  movingAverages: {
    sma20: number;
    sma50: number;
  };
}

// ✅ FIXED: Add proper Prediction interface
export interface Prediction {
  predictedPrice: number;
  confidence: number;
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  timeframe: string;
  reasoning: string;
  targetPrice?: number;
  stopLoss?: number;
  supportLevel?: number;
  resistanceLevel?: number;
  technicalIndicators?: {
    rsi: number;
    macd: number;
    signals: string[];
  };
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  priceRange: {
    min: number;
    max: number;
  };
}

export interface ChartPattern {
  pattern: string;
  confidence: number;
  description: string;
  implications: string;
}

export interface FundamentalData {
  marketCap: number;
  peRatio: number;
  pbRatio: number;
  debtToEquity: number;
  roe: number;
  revenue: number;
  netIncome: number;
  eps: number;
  bookValue: number;
  dividendYield: number;
}
