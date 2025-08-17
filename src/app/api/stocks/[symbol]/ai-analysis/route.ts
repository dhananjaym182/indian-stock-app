import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ symbol: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { symbol } = await params;
    const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:5001';
    
    const response = await fetch(`${PYTHON_BACKEND_URL}/api/ai-analysis/${symbol}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { 
          technical: { analysis: 'AI analysis temporarily unavailable' },
          fundamental: { analysis: 'AI analysis temporarily unavailable' },
          sentiment: 'Neutral',
          recommendation: 'Analysis unavailable'
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('AI Analysis API error:', error);
    return NextResponse.json(
      { 
        technical: { analysis: 'AI analysis temporarily unavailable' },
        fundamental: { analysis: 'AI analysis temporarily unavailable' },
        sentiment: 'Neutral',
        recommendation: 'Analysis unavailable'
      },
      { status: 200 }
    );
  }
}
