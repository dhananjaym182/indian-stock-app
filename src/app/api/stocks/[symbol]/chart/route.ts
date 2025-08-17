import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ symbol: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { symbol } = await params;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '6M';
    
    const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:5001';
    
    console.log(`Fetching chart data for ${symbol} (${period}) from Python backend`);
    
    const response = await fetch(`${PYTHON_BACKEND_URL}/api/history/${symbol}?period=${period}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.error(`Python backend returned ${response.status} for history/${symbol}`);
      return NextResponse.json(
        { error: 'Chart data unavailable' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`Received ${data.data?.length || 0} data points for ${symbol} (${period})`);
    
    if (!data.data || !Array.isArray(data.data)) {
      console.error('Invalid data structure from Python backend:', data);
      return NextResponse.json([]);
    }

    const chartData = data.data.map((item: any) => ({
      date: item.timestamp ? item.timestamp.split('T')[0] : new Date().toISOString().split('T'),
      time: item.timestamp ? item.timestamp.split('T') : new Date().toISOString().split('T'),
      open: item.open || 0,
      high: item.high || 0,
      low: item.low || 0,
      close: item.close || 0,
      volume: item.volume || 0
    }));

    console.log(`Returning ${chartData.length} formatted data points for ${period}`);
    return NextResponse.json(chartData);
    
  } catch (error) {
    console.error('Chart API error:', error);
    
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
