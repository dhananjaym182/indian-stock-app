'use client';

import React, { useEffect, useState } from 'react';
import TradingViewChart from '@/components/charts/TradingViewChart';
import StockHeader from '@/components/stock/StockHeader';
import QuickActions from '@/components/stock/QuickActions';
import RecommendationsTab from '@/components/stock/RecommendationsTab';
import FinancialsTab from '@/components/stock/FinancialsTab';
import NewsTab from '@/components/stock/NewsTab';
import AIAnalysisTab from '@/components/stock/AIAnalysisTab';


interface OHLCVData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface StockPageProps {
  params: Promise<{ symbol: string }>;
}

interface StockInfo {
  symbol: string;
  company_name: string;
  exchange: string;
  sector?: string;
  industry?: string;
  isin?: string;
  market_cap?: number;
  stock_type: string;
  lot_size: number;
  is_active: boolean;
}

interface QuoteData {
  stock: {
    symbol: string;
    name: string;
    currentPrice: number;
    change: number;
    changePercent: number;
    exchange: string;
    sector: string;
    marketCap: number;
    pe: number;
    volume: number;
    dayHigh: number;
    dayLow: number;
    high52Week: number;
    low52Week: number;
    dividendYield: number;
    open: number;
  };
  source: string;
  timestamp: string;
}

interface NewsItem {
  title: string;
  url: string;
  published: string | number;
  summary: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  source?: string;
  thumbnail?: string;
}

interface FinancialData {
  marketCap: number;
  peRatio: number;
  volume: number;
  dividendYield: number;
  eps: number;
  bookValue: number;
  debtToEquity: number;
  roe: number;
  roa: number;
  currentRatio: number;
  quickRatio: number;
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  revenueGrowth: number;
  earningsGrowth: number;
  beta: number;
  sector?: string;
  industry?: string;
  fullTimeEmployees?: number;
  financialStatements?: any;
}

interface RecommendationData {
  rating: string;
  targetPrice: number;
  currentPrice: number;
  upside: number;
  analystCount: number;
  buyCount: number;
  holdCount: number;
  sellCount: number;
  averageRating: number;
  summary: string;
  keyPoints: string[];
  indicators?: {
    rsi: number;
    ma20: number;
    ma50: number;
    ma200: number;
    macd: number;
    signal: number;
  };
}

interface AIAnalysisData {
  technical: {
    analysis: string;
    signals?: string[];
    indicators?: any;
  };
  fundamental: {
    analysis: string;
    score?: number;
    strengths?: string[];
    weaknesses?: string[];
  };
  sentiment: string;
  recommendation: string;
  confidence?: number;
}

const StockPage: React.FC<StockPageProps> = ({ params }) => {
  const [symbol, setSymbol] = useState<string>('');
  const [data, setData] = useState<OHLCVData[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState<string>('6M');
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('chart');
  const [tabLoading, setTabLoading] = useState<{[key: string]: boolean}>({});
  const [watchlist, setWatchlist] = useState<string[]>([]);

  // Load watchlist from localStorage
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
  }, []);

  // Await params
  useEffect(() => {
    const initializeParams = async () => {
      try {
        const resolvedParams = await params;
        setSymbol(resolvedParams.symbol);
      } catch (error) {
        console.error('Error resolving params:', error);
        setError('Failed to load page parameters');
        setLoading(false);
      }
    };

    initializeParams();
  }, [params]);

  // Fetch basic stock info and quote data
  useEffect(() => {
    if (!symbol) return;

    const fetchBasicData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch stock information
        const stockResponse = await fetch(`/api/stocks/${symbol}`);
        if (stockResponse.ok) {
          const stockData = await stockResponse.json();
          setStockInfo(stockData);
        }

        // Fetch quote data (real-time price info)
        const quoteResponse = await fetch(`/api/stocks/${symbol}/quote`);
        if (quoteResponse.ok) {
          const quoteInfo = await quoteResponse.json();
          setQuoteData(quoteInfo);
        }

        // Fetch chart data for default period
        await fetchChartData('6M');
        
      } catch (e: any) {
        setError(e.message || 'Unknown error occurred');
        console.error('Error fetching stock data:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchBasicData();
  }, [symbol]);

  // Fetch chart data for different periods
  const fetchChartData = async (period: string) => {
    try {
      console.log(`Fetching chart data for ${symbol} - ${period}`);
      
      const chartResponse = await fetch(`/api/stocks/${symbol}/chart?period=${period}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(15000),
      });
      
      if (chartResponse.ok) {
        const chartData = await chartResponse.json();
        console.log(`Received chart data:`, chartData);
        
        if (Array.isArray(chartData) && chartData.length > 0) {
          const formattedData: OHLCVData[] = chartData.map((item: any) => ({
            time: item.date || item.time?.split('T')?.[0] || new Date().toISOString().split('T'),
            open: parseFloat(item.open) || 0,
            high: parseFloat(item.high) || 0,
            low: parseFloat(item.low) || 0,
            close: parseFloat(item.close) || 0,
            volume: item.volume ? parseInt(item.volume) : undefined
          }));
          
          console.log(`Setting ${formattedData.length} chart data points for ${period}`);
          setData(formattedData);
          setCurrentPeriod(period);
        } else {
          console.warn('Empty or invalid chart data received');
          setData([]);
        }
      } else {
        console.error(`Chart API returned ${chartResponse.status}`);
        setData([]);
      }
    } catch (chartError) {
      console.error('Chart data fetch error:', chartError);
      setData([]);
    }
  };

  // Handle period change
  const handlePeriodChange = (period: string) => {
    setCurrentPeriod(period);
    fetchChartData(period);
  };

  // Fetch tab-specific data
  useEffect(() => {
    if (!symbol || activeTab === 'chart' || tabLoading[activeTab]) return;

    const fetchTabData = async (tab: string) => {
      if (tab === 'news' && newsData.length > 0) return;
      if (tab === 'financials' && financialData) return;
      if (tab === 'recommendations' && recommendations) return;
      if (tab === 'analysis' && aiAnalysis) return;

      setTabLoading(prev => ({ ...prev, [tab]: true }));

      try {
        switch (tab) {
          case 'financials':
            const finResponse = await fetch(`/api/stocks/${symbol}/financials`);
            if (finResponse.ok) {
              const data = await finResponse.json();
              setFinancialData(data);
            } else {
              console.warn('Financials API failed');
            }
            break;

          case 'news':
            const newsResponse = await fetch(`/api/stocks/${symbol}/news`);
            if (newsResponse.ok) {
              const data = await newsResponse.json();
              console.log('News response:', data);
              
              if (data && Array.isArray(data.news)) {
                setNewsData(data.news);
              } else if (Array.isArray(data)) {
                setNewsData(data);
              } else {
                console.warn('News API returned unexpected data format:', data);
                setNewsData([]);
              }
            } else {
              console.warn('News API failed');
              setNewsData([]);
            }
            break;

          case 'recommendations':
            const recResponse = await fetch(`/api/stocks/${symbol}/recommendations`);
            if (recResponse.ok) {
              const data = await recResponse.json();
              setRecommendations(data);
            } else {
              console.warn('Recommendations API failed');
            }
            break;

          case 'analysis':
            const aiResponse = await fetch(`/api/stocks/${symbol}/ai-analysis`);
            if (aiResponse.ok) {
              const data = await aiResponse.json();
              setAiAnalysis(data);
            } else {
              setAiAnalysis({
                technical: {
                  analysis: 'AI technical analysis integration in progress.'
                },
                fundamental: {
                  analysis: 'AI fundamental analysis integration in progress.'
                },
                sentiment: 'Neutral',
                recommendation: 'AI-powered recommendations will be available once the OpenRouter API integration is complete.'
              });
            }
            break;
        }
      } catch (error) {
        console.error(`Error fetching ${tab} data:`, error);
      } finally {
        setTabLoading(prev => ({ ...prev, [tab]: false }));
      }
    };

    fetchTabData(activeTab);
  }, [activeTab, symbol]);

  // Utility functions
  const formatNumber = (value: any, decimals: number = 2) => {
    if (value === undefined || value === null || value === '') {
      return 'N/A';
    }
    if (typeof value === 'number') {
      return value.toFixed(decimals);
    }
    if (typeof value === 'string' && !isNaN(Number(value))) {
      return Number(value).toFixed(decimals);
    }
    return String(value);
  };

  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)}L`;
    } else {
      return `₹${value.toFixed(2)}`;
    }
  };

  // Watchlist functions
  const addToWatchlist = (symbol: string) => {
    const newWatchlist = [...watchlist, symbol];
    setWatchlist(newWatchlist);
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
  };

  const removeFromWatchlist = (symbol: string) => {
    const newWatchlist = watchlist.filter(item => item !== symbol);
    setWatchlist(newWatchlist);
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
  };

  const isInWatchlist = watchlist.includes(symbol);

  const tabs = [
    { id: 'chart', label: 'Chart', icon: '📈' },
    { id: 'recommendations', label: 'Recommendations', icon: '⭐' },
    { id: 'financials', label: 'Financials', icon: '💰' },
    { id: 'news', label: 'News', icon: '📰' },
    { id: 'analysis', label: 'AI Analysis', icon: '🤖' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-xl text-gray-300">Loading {symbol || 'stock'} data...</p>
          <p className="text-sm text-gray-500">Fetching real-time market information</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Error Loading {symbol}</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Enhanced Header Section with Real Data */}
      <StockHeader 
        symbol={symbol}
        quoteData={quoteData}
        stockInfo={stockInfo}
      />

      {/* Tab Navigation */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                {tabLoading[tab.id] && (
                  <span className="ml-2 inline-block animate-spin rounded-full h-3 w-3 border border-blue-500 border-t-transparent"></span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'chart' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <h2 className="text-xl font-semibold text-white">Price Chart</h2>
                  <div className="flex flex-wrap gap-2">
                    {['1D', '1W', '1M', '3M', '6M', '1Y'].map((period) => (
                      <button
                        key={period}
                        onClick={() => handlePeriodChange(period)}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                          period === currentPeriod
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                    <button
                      onClick={() => window.open(`/chart/${symbol}`, '_blank')}
                      className="px-3 py-1 text-sm font-medium rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800 border border-gray-600"
                    >
                      📊 Full Screen
                    </button>
                  </div>
                </div>
                
                <div className="w-full overflow-hidden rounded-lg">
                  {data.length > 0 ? (
                    <TradingViewChart 
                      data={data} 
                      symbol={symbol}
                      width={900}
                      height={500}
                      theme="dark"
                      period={currentPeriod}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-96 bg-gray-800 rounded-lg">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-400 mb-2">Loading {symbol} chart data...</p>
                        <p className="text-sm text-gray-500">Fetching {currentPeriod} historical data</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Key Information with Real Data */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-2xl">
                <h3 className="text-lg font-semibold text-white mb-4">Key Information</h3>
                <div className="space-y-4">
                  {quoteData && (
                    <>
                      <div className="flex justify-between items-center py-2 border-b border-gray-800">
                        <span className="text-sm font-medium text-gray-400">Exchange</span>
                        <span className="text-sm font-semibold text-white">{quoteData.stock.exchange}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-800">
                        <span className="text-sm font-medium text-gray-400">Market Cap</span>
                        <span className="text-sm font-semibold text-green-400">
                          {formatCurrency(quoteData.stock.marketCap)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-800">
                        <span className="text-sm font-medium text-gray-400">P/E Ratio</span>
                        <span className="text-sm font-semibold text-white">{formatNumber(quoteData.stock.pe)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-800">
                        <span className="text-sm font-medium text-gray-400">52W High</span>
                        <span className="text-sm font-semibold text-white">₹{formatNumber(quoteData.stock.high52Week)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-800">
                        <span className="text-sm font-medium text-gray-400">52W Low</span>
                        <span className="text-sm font-semibold text-white">₹{formatNumber(quoteData.stock.low52Week)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-medium text-gray-400">Volume</span>
                        <span className="text-sm font-semibold text-white">{quoteData.stock.volume.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Trading Status */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-2xl">
                <h3 className="text-lg font-semibold text-white mb-4">Trading Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-300">Market Open</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>

              {/* Enhanced Quick Actions */}
              <QuickActions
                symbol={symbol}
                isInWatchlist={isInWatchlist}
                onAddToWatchlist={addToWatchlist}
                onRemoveFromWatchlist={removeFromWatchlist}
                onViewFinancials={() => setActiveTab('financials')}
              />
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Analyst Recommendations</h2>
            <RecommendationsTab 
              recommendations={recommendations}
              loading={tabLoading.recommendations}
            />
          </div>
        )}

        {activeTab === 'financials' && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Financial Information</h2>
            <FinancialsTab 
              financialData={financialData}
              loading={tabLoading.financials}
            />
          </div>
        )}

        {activeTab === 'news' && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Latest News</h2>
            <NewsTab 
              newsData={newsData}
              loading={tabLoading.news}
            />
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">AI Analysis</h2>
            <AIAnalysisTab 
              aiAnalysis={aiAnalysis}
              loading={tabLoading.analysis}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StockPage;
