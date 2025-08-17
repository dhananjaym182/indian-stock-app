import { NextRequest, NextResponse } from 'next/server';

const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:5001';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '6M';

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    const cleanSymbol = symbol.replace(/\.(NS|BO)$/, '');
    
    // Fetch from Python backend using yfinance
    const response = await fetch(
      `${PYTHON_BACKEND_URL}/api/history/${cleanSymbol}?period=${period}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ data: [] });
    }

  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    return NextResponse.json({ error: 'Failed to fetch historical data' }, { status: 500 });
  }
}
