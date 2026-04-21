import React from 'react';
import './Skeleton.css';

export default function Skeleton({ count = 12 }) {
  return (
    <div className="masonry-grid skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="skeleton-card"
          style={{ height: `${Math.floor(Math.random() * 200) + 250}px` }}
        >
        </div>
      ))}
    </div>
  );
}
