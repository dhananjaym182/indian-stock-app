'use client';

import React, { useState, useEffect } from 'react';
import { StockSearch } from '@/components/search/StockSearch';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Star, 
  Settings, 
  Menu,
  X,
  Bell,
  User,
  Brain,
  BarChart3
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onStockSelect: (symbol: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  onStockSelect
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      // Auto-close sidebar on mobile when screen resizes
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarOpen && isMobile) {
        const sidebar = document.getElementById('mobile-sidebar');
        if (sidebar && !sidebar.contains(event.target as Node)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, isMobile]);

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/', current: true },
    { name: 'Markets', icon: TrendingUp, href: '/markets', current: false },
    { name: 'Watchlist', icon: Star, href: '/watchlist', current: false },
    { name: 'AI Analysis', icon: Brain, href: '/ai-analysis', current: false },
    { name: 'Portfolio', icon: User, href: '/portfolio', current: false },
  ];

  const marketIndices = [
    { name: 'NIFTY 50', value: '24,653.90', change: '+34.55', changePercent: '+0.14%', positive: true },
    { name: 'SENSEX', value: '80,617.48', change: '+77.57', changePercent: '+0.10%', positive: true },
    { name: 'NIFTY BANK', value: '50,238.15', change: '-156.78', changePercent: '-0.31%', positive: false },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="dashboard-container">
      {/* ✅ FIXED: Mobile sidebar overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="sidebar-overlay lg:hidden" 
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* ✅ FIXED: Sidebar with proper responsive positioning */}
      <div 
        id="mobile-sidebar"
        className={`sidebar-fixed ${sidebarOpen ? 'sidebar-open' : ''}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold text-blue-600">StockAnalyzer</h1>
          </div>
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={closeSidebar}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  onClick={closeSidebar}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.current
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Market Indices */}
        <div className="mt-8 px-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            Market Indices
          </h3>
          <div className="space-y-3">
            {marketIndices.map((index) => (
              <div key={index.name} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{index.name}</span>
                  <span className={`text-xs font-medium ${index.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {index.changePercent}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-lg font-semibold">{index.value}</span>
                  <span className={`text-sm ${index.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {index.positive ? '+' : ''}{index.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            © 2024 StockAnalyzer India
          </div>
        </div>
      </div>

      {/* ✅ FIXED: Main content area with proper responsive margins */}
      <div className="content-with-sidebar">
        {/* ✅ FIXED: Top header bar with responsive design */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* ✅ FIXED: Mobile menu button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden"
                  aria-label="Open sidebar"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                
                {/* ✅ FIXED: Responsive search bar */}
                <div className="hidden sm:block w-full max-w-md">
                  <StockSearch onSelect={onStockSelect} />
                </div>
              </div>

              {/* Header actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <Settings className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                {/* Mobile profile button */}
                <Button variant="ghost" size="icon" className="sm:hidden">
                  <User className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* ✅ FIXED: Mobile search bar */}
            <div className="mt-4 sm:hidden">
              <StockSearch onSelect={onStockSelect} />
            </div>
          </div>
        </header>

        {/* ✅ FIXED: Main content with proper responsive padding */}
        <main className="min-h-screen bg-gray-50">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-full mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
