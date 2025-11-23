import React, { useState, useEffect } from 'react';
import { LevelConfig } from '../types';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  level: LevelConfig;
  isThumbnail?: boolean;
}

export const SmartImage: React.FC<SmartImageProps> = ({ 
  level, 
  isThumbnail = false, 
  className, 
  alt, 
  ...props 
}) => {
  // Path to local image
  const localSrc = `assets/images/level_${level.level}.jpg`;
  
  // Fallback online image
  // Thumbnails use smaller resolution to save bandwidth if fallback is needed
  // Full size uses 1600x1600 as requested
  const onlineSize = isThumbnail ? '400/300' : '1600/1600'; 
  const onlineSrc = `https://picsum.photos/seed/${level.imageKeyword}-v2/${onlineSize}`;

  const [currentSrc, setCurrentSrc] = useState(localSrc);
  const [errorCount, setErrorCount] = useState(0);

  // Reset state when the level prop changes
  useEffect(() => {
    setCurrentSrc(localSrc);
    setErrorCount(0);
  }, [level.level, localSrc]);

  const handleError = () => {
    // If local fails (errorCount 0), try online
    if (errorCount === 0) {
      // Quietly failover to online without console spam in production
      setCurrentSrc(onlineSrc);
      setErrorCount(1);
    } 
    // If online also fails, we stop (or could show a placeholder)
  };

  return (
    <img 
      src={currentSrc} 
      alt={alt || level.name.en} 
      className={className}
      onError={handleError}
      {...props} 
    />
  );
};