'use client';

import React from 'react';

interface NewsItem {
  title: string;
  url: string;
  published: string | number;
  summary: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  source?: string;
  thumbnail?: string;
}

interface NewsTabProps {
  newsData: NewsItem[];
  loading: boolean;
}

const NewsTab: React.FC<NewsTabProps> = ({ newsData, loading }) => {
  const formatDate = (timestamp: string | number) => {
    const date = new Date(typeof timestamp === 'number' ? timestamp * 1000 : timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-400">Loading news...</span>
      </div>
    );
  }

  if (!newsData || newsData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-2">No news available</p>
        <p className="text-sm text-gray-500">Check if your Python backend has the news endpoint</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {newsData.map((article, index) => (
        <div key={index} className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800/70 transition-colors">
          <div className="flex items-start space-x-4">
            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
              article.sentiment === 'positive' ? 'bg-green-400' : 
              article.sentiment === 'negative' ? 'bg-red-400' : 'bg-gray-400'
            }`}></div>
            <div className="flex-1">
              <h3 className="font-medium text-white mb-2 hover:text-blue-400 transition-colors">
                {article.url && article.url !== '#' ? (
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                ) : (
                  article.title
                )}
              </h3>
              <p className="text-sm text-gray-400 mb-2 line-clamp-2">{article.summary}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  {article.source && (
                    <span>{article.source}</span>
                  )}
                  {article.source && <span>•</span>}
                  <span>{formatDate(article.published).date}</span>
                  <span>•</span>
                  <span>{formatDate(article.published).time}</span>
                </div>
                {article.sentiment && (
                  <span className={`text-xs px-2 py-1 rounded ${
                    article.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                    article.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {article.sentiment}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsTab;
