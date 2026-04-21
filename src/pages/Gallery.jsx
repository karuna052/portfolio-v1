import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Hero from '../components/Hero';
import MasonryGrid from '../components/MasonryGrid';
import Skeleton from '../components/Skeleton';
import ImageModal from '../components/ImageModal';
import { fetchCuratedWallpapers, searchWallpapers } from '../api/pexels';

export default function Gallery() {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
    setWallpapers([]);
    setPage(1);
    loadWallpapers(1);
  }, [location.pathname, query]);

  const loadWallpapers = async (pageNum) => {
    setLoading(true);
    try {
      let data;
      const isMobile = location.pathname === '/mobile';
      const isDesktop = location.pathname === '/desktop';
      
      let searchQuery = query;
      if (isMobile) searchQuery = 'mobile wallpaper amoled portrait 4k';
      else if (isDesktop) searchQuery = 'desktop wallpaper 4k pc';

      if (searchQuery) {
        data = await searchWallpapers(searchQuery, pageNum, 40);
      } else {
        data = await fetchCuratedWallpapers(pageNum, 40);
      }
      
      if (pageNum === 1) {
        setWallpapers(data.photos);
      } else {
        setWallpapers(prev => [...prev, ...data.photos]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPage(prev => {
      const next = prev + 1;
      loadWallpapers(next);
      return next;
    });
  };

  return (
    <div className="gallery-page">
      {location.pathname === '/' && !query && <Hero />}
      
      <div style={{ padding: location.pathname !== '/' || query ? '8rem 0 2rem' : '2rem 0' }}>
        {query && <h2 style={{textAlign: 'center', marginBottom: '2rem'}}>Results for "{query}"</h2>}
        {location.pathname === '/desktop' && <h2 style={{textAlign: 'center', marginBottom: '2rem'}}>Desktop Wallpapers</h2>}
        {location.pathname === '/mobile' && <h2 style={{textAlign: 'center', marginBottom: '2rem'}}>Mobile Wallpapers</h2>}
        
        <MasonryGrid wallpapers={wallpapers} onImageClick={setSelectedImage} />
        
        {loading && <Skeleton count={12} />}
        
        {!loading && wallpapers.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '3rem 0' }}>
            <button onClick={handleLoadMore} className="btn btn-primary">
              Load More
            </button>
          </div>
        )}
      </div>

      {selectedImage && (
        <ImageModal wallpaper={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
}
