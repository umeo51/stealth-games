import React, { useEffect } from 'react';

interface AnalyticsProps {
  trackingId?: string;
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const Analytics: React.FC<AnalyticsProps> = ({ trackingId }) => {
  useEffect(() => {
    // 本番環境でのみGoogle Analyticsを読み込む
    if (process.env.NODE_ENV === 'production' && trackingId) {
      loadGoogleAnalytics(trackingId);
    }
  }, [trackingId]);

  const loadGoogleAnalytics = (id: string) => {
    // Google Analyticsスクリプトが既に読み込まれているかチェック
    if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${id}"]`)) {
      return;
    }

    // Google Analyticsスクリプトを読み込む
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);

    // dataLayerとgtagを初期化
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', id, {
      page_title: document.title,
      page_location: window.location.href,
    });
  };

  // カスタムイベント追跡関数
  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  // ゲーム関連のイベント追跡
  const trackGameEvent = (gameType: string, action: string, details?: any) => {
    trackEvent(action, 'Game', `${gameType}_${action}`, details?.score || details?.time);
  };

  // ユーザー行動の追跡
  const trackUserAction = (action: string, details?: any) => {
    trackEvent(action, 'User', details?.type, details?.value);
  };

  // 広告関連のイベント追跡
  const trackAdEvent = (action: string, adPosition: string) => {
    trackEvent(action, 'Advertisement', adPosition);
  };

  // コンポーネントをグローバルに公開（他のコンポーネントから使用可能）
  useEffect(() => {
    (window as any).analytics = {
      trackEvent,
      trackGameEvent,
      trackUserAction,
      trackAdEvent,
    };
  }, []);

  return null; // このコンポーネントは何もレンダリングしない
};

// ヘルパー関数をエクスポート
export const analytics = {
  trackEvent: (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.trackEvent(action, category, label, value);
    }
  },
  
  trackGameEvent: (gameType: string, action: string, details?: any) => {
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.trackGameEvent(gameType, action, details);
    }
  },
  
  trackUserAction: (action: string, details?: any) => {
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.trackUserAction(action, details);
    }
  },
  
  trackAdEvent: (action: string, adPosition: string) => {
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.trackAdEvent(action, adPosition);
    }
  },
};

export default Analytics;
