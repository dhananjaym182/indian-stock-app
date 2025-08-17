'use client';

import React from 'react';

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

interface AIAnalysisTabProps {
  aiAnalysis: AIAnalysisData | null;
  loading: boolean;
}

const AIAnalysisTab: React.FC<AIAnalysisTabProps> = ({ aiAnalysis, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-400">Loading AI analysis...</span>
      </div>
    );
  }

  if (!aiAnalysis) {
    return (
      <div className="text-center py-12">
        <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <p className="text-gray-400 mb-2">AI analysis not available</p>
        <p className="text-sm text-gray-500">Check if your Python backend has the AI analysis endpoint</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="font-medium text-white mb-3">Technical Analysis</h3>
          <div className="text-gray-300 text-sm space-y-2">
            <p>{aiAnalysis.technical.analysis}</p>
            {aiAnalysis.technical.signals && (
              <div className="mt-3">
                <h4 className="font-medium text-white text-xs mb-2">Key Signals:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  {aiAnalysis.technical.signals.map((signal, index) => (
                    <li key={index}>{signal}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="font-medium text-white mb-3">Fundamental Analysis</h3>
          <div className="text-gray-300 text-sm space-y-2">
            <p>{aiAnalysis.fundamental.analysis}</p>
            {aiAnalysis.fundamental.score && (
              <div className="mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Health Score:</span>
                  <span className={`text-sm font-bold ${
                    aiAnalysis.fundamental.score > 70 ? 'text-green-400' :
                    aiAnalysis.fundamental.score > 50 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {aiAnalysis.fundamental.score}/100
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="font-medium text-white mb-3">Market Sentiment</h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-300">Overall Sentiment:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            aiAnalysis.sentiment.toLowerCase() === 'positive' ? 'bg-green-500/20 text-green-400' :
            aiAnalysis.sentiment.toLowerCase() === 'negative' ? 'bg-red-500/20 text-red-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {aiAnalysis.sentiment}
          </span>
        </div>
        {aiAnalysis.confidence && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Confidence:</span>
            <span className="text-gray-300 text-sm">{aiAnalysis.confidence}%</span>
          </div>
        )}
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="font-medium text-white mb-3">AI Recommendation</h3>
        <p className="text-gray-300 leading-relaxed">{aiAnalysis.recommendation}</p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-blue-400 font-medium text-sm mb-1">Disclaimer</h4>
            <p className="text-blue-300 text-xs leading-relaxed">
              This AI analysis is for informational purposes only and should not be considered as financial advice. 
              Always conduct your own research and consult with financial advisors before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisTab;
