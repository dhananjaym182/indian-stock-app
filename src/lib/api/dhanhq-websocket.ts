'use client';

import { Stock } from '../types/stock';

export class DhanHQWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second

  constructor(
    private onMessage: (data: any) => void,
    private onError: (error: Event) => void = () => {},
    private onClose: () => void = () => {}
  ) {}

  connect(symbols: string[]) {
    try {
      const wsUrl = `wss://api.dhan.co/v2/websocket`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('DhanHQ WebSocket connected');
        this.reconnectAttempts = 0;
        
        // Subscribe to symbols
        const subscribeMessage = {
          action: 'subscribe',
          mode: 'LTP', // Last Traded Price
          exchangeSegment: 'NSE_EQ',
          securityIds: symbols.map(symbol => this.getSecurityId(symbol)).filter(Boolean)
        };
        
        this.ws?.send(JSON.stringify(subscribeMessage));
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('DhanHQ WebSocket error:', error);
        this.onError(error);
      };

      this.ws.onclose = () => {
        console.log('DhanHQ WebSocket disconnected');
        this.onClose();
        this.handleReconnect(symbols);
      };

    } catch (error) {
      console.error('Failed to connect to DhanHQ WebSocket:', error);
    }
  }

  private handleReconnect(symbols: string[]) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(symbols);
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private getSecurityId(symbol: string): number | null {
    // This should match your SECURITY_ID_MAP from dhanhq-api.ts
    const securityIds: { [key: string]: number } = {
      'RELIANCE': 500325,
      'TCS': 532540,
      'HDFCBANK': 500180,
      // Add more mappings
    };
    
    return securityIds[symbol] || null;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
