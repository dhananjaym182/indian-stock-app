import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ symbol: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { symbol } = await params;
    const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:5001';
    
    const response = await fetch(`${PYTHON_BACKEND_URL}/api/quote/${symbol}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Stock data not found' },
        { status: 404 }
      );
    }

    const data = await response.json();
    
    // Transform to match your frontend expectations
    const stockInfo = {
      symbol: data.stock.symbol,
      company_name: data.stock.name,
      exchange: data.stock.exchange,
      sector: data.stock.sector,
      market_cap: data.stock.marketCap,
      stock_type: 'EQUITY',
      lot_size: 1,
      is_active: true
    };

    return NextResponse.json(stockInfo);
  } catch (error) {
    console.error('Stock info API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
