import React from 'react';
import { X, Download, Monitor, Smartphone, Maximize } from 'lucide-react';
import './ImageModal.css';

export default function ImageModal({ wallpaper, onClose }) {
  if (!wallpaper) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="modal-body">
          <div className="modal-image-container">
            <img 
              src={wallpaper.src.large2x} 
              alt={wallpaper.alt} 
              className="modal-image"
            />
          </div>
          
          <div className="modal-sidebar">
            <h2 className="modal-author">{wallpaper.photographer}</h2>
            <p className="modal-alt">{wallpaper.alt || 'High Resolution Wallpaper'}</p>
            
            <div className="modal-dimensions">
              <span>{wallpaper.width} &times; {wallpaper.height}</span>
            </div>

            <div className="download-options">
              <h3 className="download-title">Download Options</h3>
              
              <a href={wallpaper.src.original} download target="_blank" rel="noreferrer" className="dl-btn">
                <Maximize size={20} />
                <div className="dl-info">
                  <span className="dl-type">Original Size</span>
                  <span className="dl-desc">{wallpaper.width}x{wallpaper.height}</span>
                </div>
                <Download size={18} className="dl-icon" />
              </a>

              <a href={wallpaper.src.landscape} download target="_blank" rel="noreferrer" className="dl-btn">
                <Monitor size={20} />
                <div className="dl-info">
                  <span className="dl-type">Desktop</span>
                  <span className="dl-desc">Landscape optimized</span>
                </div>
                <Download size={18} className="dl-icon" />
              </a>

              <a href={wallpaper.src.portrait} download target="_blank" rel="noreferrer" className="dl-btn">
                <Smartphone size={20} />
                <div className="dl-info">
                  <span className="dl-type">Mobile</span>
                  <span className="dl-desc">Portrait optimized</span>
                </div>
                <Download size={18} className="dl-icon" />
              </a>
            </div>
            
            <a 
              href={wallpaper.url} 
              target="_blank" 
              rel="noreferrer"
              className="btn btn-primary pexels-link"
            >
              View on Pexels
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
