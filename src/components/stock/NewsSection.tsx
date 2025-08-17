// src/components/stock/NewsSection.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Clock, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: Date;
  source: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  category: string;
  imageUrl?: string;
}

interface NewsSectionProps {
  symbol: string;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ symbol }) => {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock news data - In production, this would come from a news API
  const mockNews: NewsItem[] = [
    {
      id: '1',
      title: `${symbol} Reports Strong Q3 Earnings, Revenue Up 15% YoY`,
      summary: 'The company exceeded analyst expectations with robust revenue growth and improved profit margins in the third quarter.',
      url: '#',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      source: 'Economic Times',
      sentiment: 'positive',
      category: 'earnings',
      imageUrl: 'https://via.placeholder.com/100x60/10b981/ffffff?text=NEWS'
    },
    {
      id: '2',
      title: `Analysts Upgrade ${symbol} to Buy Rating on Growth Prospects`,
      summary: 'Leading brokerage firms have upgraded their ratings citing strong fundamentals and expansion plans.',
      url: '#',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      source: 'Business Standard',
      sentiment: 'positive',
      category: 'analyst',
    },
    {
      id: '3',
      title: `${symbol} Announces New Product Launch in AI Segment`,
      summary: 'The company unveiled its latest artificial intelligence solution targeting enterprise customers.',
      url: '#',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      source: 'Hindu BusinessLine',
      sentiment: 'positive',
      category: 'product',
    },
    {
      id: '4',
      title: `Market Volatility Affects ${symbol} Stock Performance`,
      summary: 'Broader market concerns and regulatory changes have impacted the stock price in recent trading sessions.',
      url: '#',
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      source: 'Mint',
      sentiment: 'negative',
      category: 'market',
    },
    {
      id: '5',
      title: `${symbol} Expands Operations to Southern India`,
      summary: 'The company announced plans to establish new manufacturing facilities in Tamil Nadu and Karnataka.',
      url: '#',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      source: 'Financial Express',
      sentiment: 'positive',
      category: 'expansion',
    }
  ];

  const [news] = useState<NewsItem[]>(mockNews);

  const categories = [
    { value: 'all', label: 'All News' },
    { value: 'earnings', label: 'Earnings' },
    { value: 'analyst', label: 'Analyst Reports' },
    { value: 'product', label: 'Products' },
    { value: 'market', label: 'Market News' },
    { value: 'expansion', label: 'Business Updates' }
  ];

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-3 w-3" />;
      case 'negative': return <AlertCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const refreshNews = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Latest News for {symbol}
            </CardTitle>
            <Button
              onClick={refreshNews}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* News List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-16 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredNews.length > 0 ? (
          filteredNews.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {item.imageUrl && (
                    <div className="flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="w-24 h-16 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-semibold text-lg leading-tight hover:text-blue-600 cursor-pointer">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge className={`text-xs ${getSentimentColor(item.sentiment)}`}>
                          <span className="flex items-center gap-1">
                            {getSentimentIcon(item.sentiment)}
                            {item.sentiment}
                          </span>
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.summary}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="font-medium">{item.source}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(item.publishedAt, { addSuffix: true })}
                        </span>
                      </div>
                      
                      <Button variant="ghost" size="sm" asChild>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Read More
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">No news found for the selected category.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* News Summary */}
      <Card>
        <CardHeader>
          <CardTitle>News Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">
                {news.filter(n => n.sentiment === 'positive').length}
              </div>
              <p className="text-sm text-gray-500">Positive</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-600">
                {news.filter(n => n.sentiment === 'neutral').length}
              </div>
              <p className="text-sm text-gray-500">Neutral</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-red-600">
                {news.filter(n => n.sentiment === 'negative').length}
              </div>
              <p className="text-sm text-gray-500">Negative</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 text-center">
              Overall sentiment for {symbol} news is currently{' '}
              <span className={`font-semibold ${
                news.filter(n => n.sentiment === 'positive').length > 
                news.filter(n => n.sentiment === 'negative').length 
                  ? 'text-green-600' : 'text-red-600'
              }`}>
                {news.filter(n => n.sentiment === 'positive').length > 
                 news.filter(n => n.sentiment === 'negative').length 
                  ? 'Positive' : 'Negative'}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
