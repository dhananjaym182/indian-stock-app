'use client';

import React from 'react';

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

interface FinancialsTabProps {
  financialData: FinancialData | null;
  loading: boolean;
}

const FinancialsTab: React.FC<FinancialsTabProps> = ({ financialData, loading }) => {
  const formatNumber = (value: any, decimals: number = 2) => {
    if (value === undefined || value === null || isNaN(value)) {
      return 'N/A';
    }
    return Number(value).toFixed(decimals);
  };

  const formatCurrency = (value: any) => {
    if (value === undefined || value === null || isNaN(value)) {
      return 'N/A';
    }
    
    const numValue = Number(value);
    if (numValue >= 10000000) {
      return `₹${(numValue / 10000000).toFixed(2)}Cr`;
    } else if (numValue >= 100000) {
      return `₹${(numValue / 100000).toFixed(2)}L`;
    } else {
      return `₹${numValue.toFixed(2)}`;
    }
  };

  const formatLargeNumber = (value: any) => {
    if (value === undefined || value === null || isNaN(value)) {
      return 'N/A';
    }
    
    const numValue = Number(value);
    return numValue.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-400">Loading financial data...</span>
      </div>
    );
  }

  if (!financialData) {
    return (
      <div className="text-center py-12">
        <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-400 mb-2">No financial data available</p>
        <p className="text-sm text-gray-500">Check if your Python backend has the financials endpoint</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Financial Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Market Cap</div>
          <div className="text-lg font-semibold text-white">
            {formatCurrency(financialData.marketCap)}
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">P/E Ratio</div>
          <div className="text-lg font-semibold text-white">{formatNumber(financialData.peRatio)}</div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Volume</div>
          <div className="text-lg font-semibold text-white">{formatLargeNumber(financialData.volume)}</div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Dividend Yield</div>
          <div className="text-lg font-semibold text-white">
            {formatNumber(financialData.dividendYield)}%
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">EPS</div>
          <div className="text-lg font-semibold text-white">
            ₹{formatNumber(financialData.eps)}
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Book Value</div>
          <div className="text-lg font-semibold text-white">
            ₹{formatNumber(financialData.bookValue)}
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Debt-to-Equity</div>
          <div className="text-lg font-semibold text-white">{formatNumber(financialData.debtToEquity)}</div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">ROE</div>
          <div className="text-lg font-semibold text-white">{formatNumber(financialData.roe)}%</div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">ROA</div>
          <div className="text-lg font-semibold text-white">{formatNumber(financialData.roa)}%</div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Current Ratio</div>
          <div className="text-lg font-semibold text-white">{formatNumber(financialData.currentRatio)}</div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Quick Ratio</div>
          <div className="text-lg font-semibold text-white">{formatNumber(financialData.quickRatio)}</div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Beta</div>
          <div className="text-lg font-semibold text-white">{formatNumber(financialData.beta)}</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-3">Margins</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Gross Margin</span>
              <span className="text-sm text-white">{formatNumber(financialData.grossMargin)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Operating Margin</span>
              <span className="text-sm text-white">{formatNumber(financialData.operatingMargin)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Net Margin</span>
              <span className="text-sm text-white">{formatNumber(financialData.netMargin)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-3">Growth</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Revenue Growth</span>
              <span className={`text-sm ${
                financialData.revenueGrowth && financialData.revenueGrowth > 0 ? 'text-green-400' : 
                financialData.revenueGrowth && financialData.revenueGrowth < 0 ? 'text-red-400' : 'text-white'
              }`}>
                {financialData.revenueGrowth ? 
                  `${financialData.revenueGrowth > 0 ? '+' : ''}${formatNumber(financialData.revenueGrowth)}%` : 
                  'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Earnings Growth</span>
              <span className={`text-sm ${
                financialData.earningsGrowth && financialData.earningsGrowth > 0 ? 'text-green-400' : 
                financialData.earningsGrowth && financialData.earningsGrowth < 0 ? 'text-red-400' : 'text-white'
              }`}>
                {financialData.earningsGrowth ? 
                  `${financialData.earningsGrowth > 0 ? '+' : ''}${formatNumber(financialData.earningsGrowth)}%` : 
                  'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-3">Company Info</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Employees</span>
              <span className="text-sm text-white">
                {formatLargeNumber(financialData.fullTimeEmployees)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Industry</span>
              <span className="text-sm text-white truncate ml-2" title={financialData.industry}>
                {financialData.industry || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Sector</span>
              <span className="text-sm text-white">
                {financialData.sector || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Statements Preview */}
      {financialData.financialStatements && (
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-3">Financial Statements Available</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {financialData.financialStatements.income_statement && (
              <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                <div className="text-green-400 font-medium">Income Statement</div>
                <div className="text-sm text-gray-400 mt-1">Available</div>
              </div>
            )}
            {financialData.financialStatements.balance_sheet && (
              <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                <div className="text-blue-400 font-medium">Balance Sheet</div>
                <div className="text-sm text-gray-400 mt-1">Available</div>
              </div>
            )}
            {financialData.financialStatements.cashflow && (
              <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                <div className="text-purple-400 font-medium">Cash Flow</div>
                <div className="text-sm text-gray-400 mt-1">Available</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialsTab;
