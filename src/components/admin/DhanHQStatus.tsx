'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dhanHQAPI } from '@/lib/api/dhanhq-api';
import { Activity, Server, Database } from 'lucide-react';

export const DhanHQStatus: React.FC = () => {
  const [config, setConfig] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'failed'>('testing');

  useEffect(() => {
    const checkStatus = async () => {
      const configInfo = dhanHQAPI.getConfigInfo();
      setConfig(configInfo);

      // Test connection if in sandbox mode
      if (configInfo.mode === 'SANDBOX') {
        try {
          const isConnected = await dhanHQAPI.testSandboxConnection();
          setConnectionStatus(isConnected ? 'connected' : 'failed');
        } catch (error) {
          setConnectionStatus('failed');
        }
      } else {
        setConnectionStatus('connected'); // Assume live is working
      }
    };

    checkStatus();
  }, []);

  if (!config) return null;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          DhanHQ API Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Environment:</span>
          <Badge variant={config.mode === 'SANDBOX' ? 'secondary' : 'default'}>
            {config.mode}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span>Historical API:</span>
          <Badge variant={config.historicalApiEnabled ? 'default' : 'secondary'}>
            {config.historicalApiEnabled ? 'ENABLED' : 'DISABLED'}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span>Connection:</span>
          <div className="flex items-center gap-2">
            <Activity className={`h-4 w-4 ${
              connectionStatus === 'connected' ? 'text-green-500' : 
              connectionStatus === 'failed' ? 'text-red-500' : 'text-yellow-500'
            }`} />
            <span className="text-sm">{connectionStatus.toUpperCase()}</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 pt-2 border-t">
          Base URL: {config.baseUrl}
        </div>
      </CardContent>
    </Card>
  );
};
