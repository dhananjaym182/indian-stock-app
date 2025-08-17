// ✅ FIXED: Add proper type definition with index signature
export interface StockData {
  name: string;
  sector: string;
  basePrice: number;
}

export const INDIAN_STOCKS: { [key: string]: StockData } = {
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

// Helper functions for consistent price generation
export function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
