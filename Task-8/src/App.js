import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchPage from './pages/SearchPage';
import MovieDetailsPage from './pages/MovieDetailsPage';

function App() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const navigate = useNavigate();
  const [showFavoritesFromNav, setShowFavoritesFromNav] = useState(false);

  React.useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Could not save favorites to localStorage');
    }
  }, [favorites]);

  const addToFavorites = (movie) => {
    setFavorites((prev) => {
      if (prev.find((m) => m.imdbID === movie.imdbID)) {
        return prev;
      }
      return [...prev, movie];
    });
  };

  const removeFromFavorites = (imdbID) => {
    setFavorites((prev) => prev.filter((m) => m.imdbID !== imdbID));
  };

  const isFavorite = (imdbID) => {
    return favorites.some((m) => m.imdbID === imdbID);
  };

  const handleShowFavorites = () => {
    navigate('/');
    setTimeout(() => {
      setShowFavoritesFromNav(true);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar 
        favoritesCount={favorites.length} 
        onShowFavorites={handleShowFavorites}
      />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route
            path="/"
            element={
              <SearchPage
                favorites={favorites}
                addToFavorites={addToFavorites}
                removeFromFavorites={removeFromFavorites}
                isFavorite={isFavorite}
                externalShowFavorites={showFavoritesFromNav}
                onFavoritesShown={() => setShowFavoritesFromNav(false)}
              />
            }
          />
          <Route
            path="/movie/:imdbID"
            element={
              <MovieDetailsPage
                addToFavorites={addToFavorites}
                removeFromFavorites={removeFromFavorites}
                isFavorite={isFavorite}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;