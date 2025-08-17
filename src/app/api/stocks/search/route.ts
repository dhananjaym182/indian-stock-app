import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') || '').trim();
  
  if (query.length < 2) {
    return NextResponse.json({ error: 'Query must be at least 2 characters' }, { status: 400 });
  }

  try {
    const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:5001';
    
    const response = await fetch(`${PYTHON_BACKEND_URL}/api/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      // Ensure the response includes both symbol and company_name searchable
      const results = Array.isArray(data.stocks) ? data.stocks : (Array.isArray(data) ? data : []);
      
      // Filter results to match both symbol and company name
      const filteredResults = results.filter((stock: any) => 
        stock.symbol?.toLowerCase().includes(query.toLowerCase()) ||
        stock.company_name?.toLowerCase().includes(query.toLowerCase())
      );
      
      return NextResponse.json({ stocks: filteredResults.slice(0, 20) });
    } else {
      return NextResponse.json({ stocks: [], error: 'Search service unavailable' });
    }
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ 
      stocks: [], 
      error: 'Search temporarily unavailable' 
    });
  }
}
