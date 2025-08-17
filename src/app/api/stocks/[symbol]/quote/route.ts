import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ symbol: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { symbol } = await params;
    const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:5001';
    
    console.log(`Fetching quote data for ${symbol} from Python backend`);
    
    const response = await fetch(`${PYTHON_BACKEND_URL}/api/quote/${symbol}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error(`Python backend returned ${response.status} for quote/${symbol}`);
      return NextResponse.json(
        { error: 'Quote data unavailable' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`Received quote data for ${symbol}`);
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Quote API error:', error);
    
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'Request timeout - backend too slow' },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
