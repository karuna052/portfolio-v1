import React from 'react';
import { Maximize2, Download } from 'lucide-react';
import './WallpaperCard.css';

export default function WallpaperCard({ wallpaper, onClick }) {
  return (
    <div className="wallpaper-card" onClick={() => onClick(wallpaper)}>
      <img 
        src={wallpaper.src.medium} 
        alt={wallpaper.alt} 
        className="wallpaper-img"
        loading="lazy"
      />
      <div className="wallpaper-overlay">
        <div className="wallpaper-info">
          <span className="photographer">{wallpaper.photographer}</span>
        </div>
        <div className="wallpaper-actions">
          <button 
            className="action-btn" 
            onClick={(e) => { e.stopPropagation(); onClick(wallpaper); }}
            title="Expand"
          >
            <Maximize2 size={18} />
          </button>
          <a 
            href={wallpaper.src.original} 
            download
            target="_blank"
            rel="noreferrer"
            className="action-btn"
            onClick={(e) => e.stopPropagation()}
            title="Download Original"
          >
            <Download size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}
