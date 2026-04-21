import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import './Hero.css';

export default function Hero() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Elevate Your Screen</h1>
        <p className="hero-subtitle">Discover stunning high-resolution wallpapers tailored for every device.</p>
        
        <form className="hero-search" onSubmit={handleSearch}>
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search for 'cyberpunk', 'nature', 'amoled'..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary search-btn">Search</button>
        </form>
        
        <div className="hero-tags">
          <span>Popular:</span>
          <button onClick={() => navigate('/search?q=minimalist')} className="tag">Minimalist</button>
          <button onClick={() => navigate('/search?q=dark')} className="tag">Dark</button>
          <button onClick={() => navigate('/search?q=anime')} className="tag">Anime</button>
          <button onClick={() => navigate('/search?q=space')} className="tag">Space</button>
        </div>
      </div>
    </div>
  );
}
