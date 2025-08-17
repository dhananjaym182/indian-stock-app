export interface DhanSearchResult {
  symbol: string;
  securityId?: number;
  tradingSymbol?: string;
  exchange: string;
  name?: string;
}

export interface DhanQuoteData {
  securityId: number;
  tradingSymbol: string;
  ltp: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
  marketCap?: number;
  pe?: number;
}

export interface DhanHistoricalData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
