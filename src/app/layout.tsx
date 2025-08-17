import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import HeaderSearchBox from '@/src/components/search/HeaderSearchBox';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    default: 'Indian Stock Market App',
    template: '%s | Indian Stock Market App'
  },
  description: 'Real-time Indian stock market data with advanced charting and analysis tools',
  keywords: ['stocks', 'NSE', 'BSE', 'Indian market', 'trading', 'charts', 'finance'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  publisher: 'Your Company',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yourapp.com'),
  openGraph: {
    title: 'Indian Stock Market App',
    description: 'Real-time Indian stock market data with advanced charting and analysis tools',
    url: 'https://yourapp.com',
    siteName: 'Indian Stock Market App',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indian Stock Market App',
    description: 'Real-time Indian stock market data with advanced charting and analysis tools',
    creator: '@yourusername',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Viewport meta for proper mobile rendering */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#0f172a" />
        <meta name="msapplication-TileColor" content="#0f172a" />
        
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Favicons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className="font-sans antialiased bg-gray-950 text-gray-100 min-h-screen">
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Skip to main content
        </a>

        {/* Navigation Header */}
        <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Navigation */}
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-white">StockApp</span>
                    <span className="text-xs text-gray-400 -mt-1">Indian Markets</span>
                  </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-6">
                  <a
                    href="/"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </a>
                  <a
                    href="/markets"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Markets
                  </a>
                  <a
                    href="/stocks"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Stocks
                  </a>
                  <a
                    href="/watchlist"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Watchlist
                  </a>
                  <a
                    href="/screener"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Screener
                  </a>
                  <a
                    href="/ai-analysis"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    AI Analysis
                  </a>
                </nav>
              </div>

              {/* Search and User Actions */}
              <div className="flex items-center space-x-4">
                
                {/* ✅ FIXED: Working Search Bar Component */}
                <HeaderSearchBox />

                {/* Market Status */}
                <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-400">Market Open</span>
                </div>

                {/* Mobile Menu Button */}
                <button
                  type="button"
                  className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main id="main-content" className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900/50 border-t border-gray-800 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-white">StockApp</span>
                </div>
                <p className="text-gray-400 text-sm max-w-md">
                  Your comprehensive platform for Indian stock market analysis with real-time data, 
                  advanced charting, and professional-grade tools.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  <li><a href="/" className="text-gray-400 hover:text-white text-sm transition-colors">Dashboard</a></li>
                  <li><a href="/stocks" className="text-gray-400 hover:text-white text-sm transition-colors">Stock List</a></li>
                  <li><a href="/watchlist" className="text-gray-400 hover:text-white text-sm transition-colors">My Watchlist</a></li>
                  <li><a href="/screener" className="text-gray-400 hover:text-white text-sm transition-colors">Stock Screener</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  Support
                </h3>
                <ul className="space-y-2">
                  <li><a href="/help" className="text-gray-400 hover:text-white text-sm transition-colors">Help Center</a></li>
                  <li><a href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">Contact Us</a></li>
                  <li><a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center space-x-4">
                <p className="text-xs text-gray-400">
                  © 2025 StockApp. All rights reserved.
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>Data provided by NSE & BSE</span>
                  <span>•</span>
                  <span>15-min delayed</span>
                </div>
              </div>
              
              {/* Market Status */}
              <div className="mt-4 sm:mt-0 text-xs text-gray-500">
                Last updated: {new Date().toLocaleTimeString('en-IN', {
                  timeZone: 'Asia/Kolkata',
                  hour: '2-digit',
                  minute: '2-digit'
                })} IST
              </div>
            </div>
          </div>
        </footer>

        {/* Global Loading Overlay (if needed) */}
        <div id="loading-overlay" className="hidden fixed inset-0 bg-gray-950/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-white">Loading...</p>
          </div>
        </div>
      </body>
    </html>
  );
}
