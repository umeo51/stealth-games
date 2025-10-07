import React, { useEffect, useRef } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  adLayout?: string;
  adLayoutKey?: string;
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdSense: React.FC<AdSenseProps> = ({
  adSlot,
  adFormat = 'auto',
  adLayout,
  adLayoutKey,
  style = {},
  className = '',
  responsive = true
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    // AdSenseスクリプトが読み込まれているかチェック
    if (typeof window !== 'undefined') {
      // 本番環境でのみAdSenseを読み込む
      if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_ADSENSE_CLIENT_ID) {
        loadAdSenseScript();
      }
    }
  }, []);

  useEffect(() => {
    // 広告を表示
    if (adRef.current && !isAdLoaded.current && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isAdLoaded.current = true;
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [adSlot]);

  const loadAdSenseScript = () => {
    // AdSenseスクリプトが既に読み込まれているかチェック
    if (document.querySelector('script[src*="adsbygoogle.js"]')) {
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.REACT_APP_ADSENSE_CLIENT_ID}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  };

  // 開発環境では広告の代わりにプレースホルダーを表示
  if (process.env.NODE_ENV !== 'production' || !process.env.REACT_APP_ADSENSE_CLIENT_ID) {
    return (
      <div 
        className={`ad-placeholder ${className}`}
        style={{
          background: '#f8f9fa',
          border: '2px dashed #dee2e6',
          borderRadius: '4px',
          padding: '1rem',
          textAlign: 'center',
          color: '#6c757d',
          fontSize: '0.875rem',
          minHeight: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style
        }}
      >
        <div>
          <div>📢 広告スペース</div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
            本番環境では広告が表示されます
          </div>
        </div>
      </div>
    );
  }

  const adProps: any = {
    'data-ad-client': process.env.REACT_APP_ADSENSE_CLIENT_ID,
    'data-ad-slot': adSlot,
    'data-ad-format': adFormat,
  };

  if (adLayout) {
    adProps['data-ad-layout'] = adLayout;
  }

  if (adLayoutKey) {
    adProps['data-ad-layout-key'] = adLayoutKey;
  }

  if (responsive) {
    adProps['data-full-width-responsive'] = 'true';
  }

  return (
    <div className={className} style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          ...style
        }}
        {...adProps}
      />
    </div>
  );
};

export default AdSense;
