import axios from 'axios';
import { Stock, ChartData } from '../types/stock';

// Static stock data for consistency
const INDIAN_STOCKS: { [key: string]: any } = {
  'RELIANCE': { name: 'Reliance Industries Limited', sector: 'Oil & Gas', basePrice: 2450.50 },
  'TCS': { name: 'Tata Consultancy Services Limited', sector: 'Information Technology', basePrice: 3850.75 },
  'HDFCBANK': { name: 'HDFC Bank Limited', sector: 'Banking', basePrice: 1650.20 },
  'INFY': { name: 'Infosys Limited', sector: 'Information Technology', basePrice: 1480.90 },
  'ICICIBANK': { name: 'ICICI Bank Limited', sector: 'Banking', basePrice: 950.60 },
  'HINDUNILVR': { name: 'Hindustan Unilever Limited', sector: 'FMCG', basePrice: 2650.30 },
  'ITC': { name: 'ITC Limited', sector: 'FMCG', basePrice: 415.25 },
  'SBIN': { name: 'State Bank of India', sector: 'Banking', basePrice: 780.40 },
  'BHARTIARTL': { name: 'Bharti Airtel Limited', sector: 'Telecom', basePrice: 1550.80 },
  'ASIANPAINT': { name: 'Asian Paints Limited', sector: 'Paints', basePrice: 3200.15 },
  'MARUTI': { name: 'Maruti Suzuki India Limited', sector: 'Auto', basePrice: 11500.90 },
  'AXISBANK': { name: 'Axis Bank Limited', sector: 'Banking', basePrice: 1120.35 },
  'LT': { name: 'Larsen & Toubro Limited', sector: 'Construction', basePrice: 3450.70 },
  'SUNPHARMA': { name: 'Sun Pharmaceutical Industries Limited', sector: 'Pharma', basePrice: 1180.25 },
  'WIPRO': { name: 'Wipro Limited', sector: 'Information Technology', basePrice: 550.60 },
  'ULTRACEMCO': { name: 'UltraTech Cement Limited', sector: 'Cement', basePrice: 10800.45 },
  'TITAN': { name: 'Titan Company Limited', sector: 'Jewellery', basePrice: 3250.80 },
  'NESTLEIND': { name: 'Nestle India Limited', sector: 'FMCG', basePrice: 2400.50 },
  'POWERGRID': { name: 'Power Grid Corporation of India Limited', sector: 'Power', basePrice: 320.75 },
  'NTPC': { name: 'NTPC Limited', sector: 'Power', basePrice: 355.90 }
};

export class YahooFinanceAPI {
  // Generate consistent price with small daily variation
  private static getConsistentPrice(symbol: string, basePrice: number): { price: number, change: number } {
    // Use symbol and date to generate consistent but varying prices
    const today = new Date().toDateString();
    const seed = this.hashCode(symbol + today);
    const random = this.seededRandom(seed);
    
    // Generate price variation between -5% to +5%
    const variation = (random - 0.5) * 0.1; // -5% to +5%
    const currentPrice = basePrice * (1 + variation);
    const change = currentPrice - basePrice;
    
    return { price: currentPrice, change };
  }

  // Hash function for consistent randomization
  private static hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  // Seeded random function
  private static seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  static async searchStocks(query: string): Promise<any[]> {
    try {
      // ✅ FIXED: Only return results for valid Indian stock symbols
      const results = [];
      const queryUpper = query.toUpperCase();
      
      for (const [symbol, data] of Object.entries(INDIAN_STOCKS)) {
        if (symbol.includes(queryUpper) || data.name.toUpperCase().includes(queryUpper)) {
          results.push({
            symbol: `${symbol}.NS`,
            shortname: data.name,
            exchange: 'NSE'
          });
          
          // Also add BSE version if it's a major stock
          if (['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'].includes(symbol)) {
            results.push({
              symbol: `${symbol}.BO`,
              shortname: data.name,
              exchange: 'BSE'
            });
          }
        }
      }
      
      return results.slice(0, 10); // Limit to 10 results
    } catch (error) {
      console.error('Error searching stocks:', error);
      return [];
    }
  }

  static async getStockQuote(symbol: string): Promise<Stock | null> {
    try {
      // Remove exchange suffix for lookup
      const cleanSymbol = symbol.replace(/\.(NS|BO)$/, '');
      const stockData = INDIAN_STOCKS[cleanSymbol];
      
      if (!stockData) {
        return null;
      }

      // ✅ FIXED: Consistent pricing with real company names
      const { price, change } = this.getConsistentPrice(cleanSymbol, stockData.basePrice);
      const changePercent = (change / stockData.basePrice) * 100;
      
      return {
        symbol: cleanSymbol,
        name: stockData.name, // ✅ Real company name
        exchange: symbol.endsWith('.BO') ? 'BSE' : 'NSE',
        currentPrice: parseFloat(price.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        volume: Math.floor(1000000 + (Math.random() * 5000000)),
        marketCap: Math.floor(price * (100000000 + Math.random() * 900000000)),
        pe: parseFloat((15 + Math.random() * 20).toFixed(2)),
        sector: stockData.sector,
        high52Week: parseFloat((stockData.basePrice * 1.3).toFixed(2)),
        low52Week: parseFloat((stockData.basePrice * 0.7).toFixed(2)),
        dividendYield: parseFloat((Math.random() * 0.05).toFixed(4))
      };
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      return null;
    }
  }

  static async getHistoricalData(
    symbol: string, 
    period: string = '1mo',
    interval: string = '1d'
  ): Promise<ChartData[]> {
    try {
      const cleanSymbol = symbol.replace(/\.(NS|BO)$/, '');
      const stockData = INDIAN_STOCKS[cleanSymbol];
      
      if (!stockData) {
        return [];
      }

      // Generate consistent historical data
      const data: ChartData[] = [];
      const daysCount = period === '1mo' ? 30 : period === '3mo' ? 90 : 180;
      const basePrice = stockData.basePrice;
      
      for (let i = daysCount; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Generate consistent daily variation
        const seed = this.hashCode(cleanSymbol + date.toDateString());
        const random = this.seededRandom(seed);
        const dailyVariation = (random - 0.5) * 0.06; // ±3% daily variation
        const price = basePrice * (1 + dailyVariation);
        
        data.push({
          timestamp: date.toISOString(),
          open: parseFloat((price * 0.99).toFixed(2)),
          high: parseFloat((price * 1.02).toFixed(2)),
          low: parseFloat((price * 0.98).toFixed(2)),
          close: parseFloat(price.toFixed(2)),
          volume: Math.floor(500000 + (random * 2000000))
        });
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      return [];
    }
  }

  static async getPopularIndianStocks(): Promise<string[]> {
    return Object.keys(INDIAN_STOCKS);
  }
}
