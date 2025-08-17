import { NextRequest, NextResponse } from 'next/server';
import { AIAnalysisService } from '@/lib/api/ai-analysis';

export async function POST(request: NextRequest) {
  try {
    const { symbol, currentPrice, historicalData } = await request.json();

    if (!symbol) {
      return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    // Generate comprehensive AI prediction
    const prediction = await AIAnalysisService.generatePrediction(
      symbol,
      currentPrice || 1000,
      historicalData || []
    );

    if (!prediction) {
      return NextResponse.json({ error: 'Failed to generate prediction' }, { status: 500 });
    }

    return NextResponse.json({ 
      prediction,
      generatedAt: new Date().toISOString(),
      dataFreshness: 'Real-time (within 15-20 minutes of market data)'
    });
  } catch (error) {
    console.error('Prediction generation error:', error);
    return NextResponse.json({ error: 'Failed to generate prediction' }, { status: 500 });
  }
}
