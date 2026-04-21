import React from 'react';
import WallpaperCard from './WallpaperCard';
import './MasonryGrid.css';

export default function MasonryGrid({ wallpapers, onImageClick }) {
  if (!wallpapers || wallpapers.length === 0) return null;

  return (
    <div className="masonry-grid">
      {wallpapers.map((wallpaper, index) => (
        <WallpaperCard 
          key={`${wallpaper.id}-${index}`} 
          wallpaper={wallpaper} 
          onClick={onImageClick}
        />
      ))}
    </div>
  );
}
