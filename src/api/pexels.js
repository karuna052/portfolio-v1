const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const BASE_URL = 'https://api.pexels.com/v1';

export const fetchCuratedWallpapers = async (page = 1, perPage = 30) => {
  const res = await fetch(`${BASE_URL}/curated?page=${page}&per_page=${perPage}`, {
    headers: { Authorization: API_KEY },
  });
  if (!res.ok) throw new Error('Failed to fetch curated wallpapers');
  return res.json();
};

export const searchWallpapers = async (query, page = 1, perPage = 30) => {
  const res = await fetch(`${BASE_URL}/search?query=${query}&page=${page}&per_page=${perPage}`, {
    headers: { Authorization: API_KEY },
  });
  if (!res.ok) throw new Error('Failed to search wallpapers');
  return res.json();
};
