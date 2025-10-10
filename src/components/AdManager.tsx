import React from 'react';
import './AdManager.css';

interface AdManagerProps {
  position: 'sidebar' | 'header' | 'footer' | 'content' | 'game-area';
  size?: 'small' | 'medium' | 'large' | 'responsive';
  className?: string;
}

const AdManager: React.FC<AdManagerProps> = ({ position, size = 'responsive', className = '' }) => {
  const getAdSize = () => {
    switch (size) {
      case 'small':
        return { width: '300px', height: '250px' };
      case 'medium':
        return { width: '728px', height: '90px' };
      case 'large':
        return { width: '970px', height: '250px' };
      case 'responsive':
        return { width: '100%', height: 'auto', minHeight: '90px' };
      default:
        return { width: '300px', height: '250px' };
    }
  };

  const adStyle = getAdSize();

  return (
    <div className={`ad-container ad-${position} ad-${size} ${className}`}>
      <div 
        className="ad-placeholder"
        style={adStyle}
      >
        <div className="ad-label">広告</div>
        <div className="ad-content">
          {position === 'sidebar' && 'サイドバー広告'}
          {position === 'header' && 'ヘッダー広告'}
          {position === 'footer' && 'フッター広告'}
          {position === 'content' && 'コンテンツ広告'}
          {position === 'game-area' && 'ゲームエリア広告'}
        </div>
      </div>
    </div>
  );
};

export default AdManager;
