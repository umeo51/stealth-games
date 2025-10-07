import React from 'react';
import AdSense from './AdSense';
import './AdManager.css';

interface AdManagerProps {
  position: 'sidebar' | 'header' | 'footer' | 'content' | 'game-area';
  size?: 'small' | 'medium' | 'large' | 'responsive';
  className?: string;
}

const AdManager: React.FC<AdManagerProps> = ({ position, size = 'responsive', className = '' }) => {
  // 広告スロットIDの設定（実際の本番環境では適切なスロットIDを設定）
  const getAdSlot = (position: string): string => {
    switch (position) {
      case 'sidebar':
        return '1234567890'; // サイドバー用スロットID
      case 'header':
        return '1234567891'; // ヘッダー用スロットID
      case 'footer':
        return '1234567892'; // フッター用スロットID
      case 'content':
        return '1234567893'; // コンテンツ内用スロットID
      case 'game-area':
        return '1234567894'; // ゲームエリア用スロットID
      default:
        return '1234567890';
    }
  };

  // 広告サイズの設定
  const getAdStyle = (size: string, position: string): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      margin: '1rem 0',
    };

    switch (size) {
      case 'small':
        return {
          ...baseStyle,
          width: '300px',
          height: '250px',
        };
      case 'medium':
        return {
          ...baseStyle,
          width: '336px',
          height: '280px',
        };
      case 'large':
        return {
          ...baseStyle,
          width: '728px',
          height: '90px',
        };
      case 'responsive':
      default:
        if (position === 'sidebar') {
          return {
            ...baseStyle,
            width: '100%',
            maxWidth: '300px',
            height: '250px',
          };
        } else if (position === 'header' || position === 'footer') {
          return {
            ...baseStyle,
            width: '100%',
            height: '90px',
          };
        } else {
          return {
            ...baseStyle,
            width: '100%',
            minHeight: '250px',
          };
        }
    }
  };

  // 広告フォーマットの設定
  const getAdFormat = (position: string): 'auto' | 'rectangle' | 'vertical' | 'horizontal' => {
    switch (position) {
      case 'sidebar':
        return 'rectangle';
      case 'header':
      case 'footer':
        return 'horizontal';
      case 'content':
      case 'game-area':
      default:
        return 'auto';
    }
  };

  const adSlot = getAdSlot(position);
  const adStyle = getAdStyle(size, position);
  const adFormat = getAdFormat(position);

  return (
    <div className={`ad-manager ad-manager-${position} ${className}`}>
      {position === 'game-area' && (
        <div className="ad-label">
          <span>スポンサー</span>
        </div>
      )}
      
      <AdSense
        adSlot={adSlot}
        adFormat={adFormat}
        style={adStyle}
        className={`ad-${position}`}
        responsive={size === 'responsive'}
      />
      
      {position === 'content' && (
        <div className="ad-disclaimer">
          <small>※ この広告は外部サービスによって配信されています</small>
        </div>
      )}
    </div>
  );
};

export default AdManager;
