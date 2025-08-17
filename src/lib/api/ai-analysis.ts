import { Prediction } from '../types/stock';

export class AIAnalysisService {
  static async generatePrediction(
    symbol: string,
    currentPrice: number,
    historicalData: any[]
  ): Promise<Prediction | null> {
    try {
      // Enhanced mock prediction with more realistic data
      const basePrice = currentPrice;
      const volatility = 0.15; // 15% volatility
      const trendDirection = Math.random() > 0.5 ? 1 : -1;
      
      // Calculate predicted price with trend
      const predictedPriceChange = (Math.random() * volatility * 2 - volatility) * basePrice;
      const predictedPrice = basePrice + (predictedPriceChange * trendDirection);
      
      // Calculate support and resistance levels
      const supportLevel = basePrice * (0.95 - Math.random() * 0.05);
      const resistanceLevel = basePrice * (1.05 + Math.random() * 0.05);
      
      // Generate confidence based on market conditions
      const confidence = Math.floor(65 + Math.random() * 30); // 65-95%
      
      // Determine recommendation
      let recommendation: 'BUY' | 'SELL' | 'HOLD';
      const priceChangePercent = (predictedPrice - basePrice) / basePrice * 100;
      
      if (priceChangePercent > 3 && confidence > 75) {
        recommendation = 'BUY';
      } else if (priceChangePercent < -3 && confidence > 75) {
        recommendation = 'SELL';
      } else {
        recommendation = 'HOLD';
      }

      const prediction: Prediction = {
        predictedPrice: parseFloat(predictedPrice.toFixed(2)),
        confidence,
        recommendation,
        timeframe: '1 week',
        reasoning: `Based on technical analysis and market sentiment for ${symbol}, the AI model predicts a ${priceChangePercent > 0 ? 'bullish' : 'bearish'} trend. Key factors include recent price momentum, volume patterns, and sector performance. The model shows ${confidence}% confidence in this prediction based on ${historicalData.length} days of historical data analysis.`,
        targetPrice: recommendation === 'BUY' ? parseFloat((predictedPrice * 1.08).toFixed(2)) : undefined,
        stopLoss: recommendation === 'BUY' ? parseFloat((basePrice * 0.95).toFixed(2)) : undefined,
        supportLevel: parseFloat(supportLevel.toFixed(2)),
        resistanceLevel: parseFloat(resistanceLevel.toFixed(2)),
        technicalIndicators: {
          rsi: 45 + Math.random() * 20, // 45-65 range
          macd: (Math.random() - 0.5) * 2,
          signals: ['Moving Average Crossover', 'Volume Increase', 'Support Level Hold']
        },
        riskLevel: confidence > 80 ? 'LOW' : confidence > 60 ? 'MEDIUM' : 'HIGH',
        priceRange: {
          min: parseFloat((predictedPrice * 0.95).toFixed(2)),
          max: parseFloat((predictedPrice * 1.05).toFixed(2))
        }
      };

      return prediction;
    } catch (error) {
      console.error('Error generating AI prediction:', error);
      return null;
    }
  }
}
