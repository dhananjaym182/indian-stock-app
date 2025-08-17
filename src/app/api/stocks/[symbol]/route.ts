import { NextRequest, NextResponse } from 'next/server';

const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:5001';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    const cleanSymbol = symbol.replace(/\.(NS|BO)$/, '');
    
    // Fetch from Python backend using yfinance
    const response = await fetch(`${PYTHON_BACKEND_URL}/api/quote/${cleanSymbol}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      console.log(`yfinance backend failed for ${cleanSymbol}, using fallback`);
      // Fallback to your existing mock data logic here if needed
      return NextResponse.json({ error: 'Stock data unavailable' }, { status: 404 });
    }

  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
}
