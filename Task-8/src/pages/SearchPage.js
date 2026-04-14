import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from '../components/SearchBar';
import TypeFilter from '../components/TypeFilter';
import MovieList from '../components/MovieList';
import Pagination from '../components/Pagination';
import SkeletonCard from '../components/SkeletonCard';
import FavoritesSection from '../components/FavoritesSection';
import { searchMovies } from '../services/omdbService';

function SearchPage({ favorites, addToFavorites, removeFromFavorites, isFavorite, externalShowFavorites, onFavoritesShown }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState('0');
  const [loading, setLoading] = useState(false);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    if (externalShowFavorites) {
      setShowFavorites(true);
      onFavoritesShown();
    }
  }, [externalShowFavorites, onFavoritesShown]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  const TRENDING_SEARCH_TERMS = [
    'action 2026',
    'thriller 2026',
    'sci-fi 2026',
    'horror 2026',
    'comedy 2026',
    'drama 2026',
    'avatar',
    'marvel',
    'star wars',
    'batman',
    'superhero',
    'avengers',
    'transformers',
    'fast and furious',
    'mission impossible',
    'james bond',
    'jurassic',
    'harry potter',
    'lord of the rings',
    'hunger games'
  ];

  const getRandomSearchTerm = () => {
    const randomIndex = Math.floor(Math.random() * TRENDING_SEARCH_TERMS.length);
    return TRENDING_SEARCH_TERMS[randomIndex];
  };

  const loadTrendingMovies = async () => {
    setLoadingTrending(true);
    const searchTerm = getRandomSearchTerm();
    const result = await searchMovies(searchTerm, 'movie', 1);
    if (!result.Error && result.Search) {
      setTrendingMovies(result.Search.slice(0, 8));
    }
    setLoadingTrending(false);
  };

  const refreshTrending = async () => {
    setLoadingTrending(true);
    const searchTerm = getRandomSearchTerm();
    const result = await searchMovies(searchTerm, 'movie', 1);
    if (!result.Error && result.Search) {
      setTrendingMovies(result.Search.slice(0, 8));
    }
    setLoadingTrending(false);
  };

  const fetchMovies = useCallback(async (term, type, page) => {
    if (!term.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const result = await searchMovies(term, type, page);

      if (result.Error) {
        setError(result.Error);
        setMovies([]);
        setTotalResults('0');
      } else {
        setMovies(result.Search || []);
        setTotalResults(result.totalResults);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setMovies([]);
      setTotalResults('0');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    setShowFavorites(false);
    fetchMovies(term, selectedType, 1);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setCurrentPage(1);
    if (searchTerm) {
      fetchMovies(searchTerm, type, 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchMovies(searchTerm, selectedType, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    if (searchTerm) {
      fetchMovies(searchTerm, selectedType, currentPage);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setMovies([]);
    setHasSearched(false);
    setError(null);
    setTotalResults('0');
    setShowFavorites(false);
  };

  const handleToggleFavorite = (movie) => {
    if (isFavorite(movie.imdbID)) {
      removeFromFavorites(movie.imdbID);
    } else {
      addToFavorites({
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Type: movie.Type,
        Poster: movie.Poster,
      });
    }
  };

  const renderTrendingSection = () => {
    if (loadingTrending) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }

    if (trendingMovies.length === 0) return null;

    return (
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-red-500 to-red-700 rounded-full"></span>
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              TRENDING NOW
            </span>
          </h2>
          <button
            onClick={refreshTrending}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-gray-700 hover:border-red-500 text-gray-400 hover:text-red-400 rounded-lg transition-all text-xs font-bold uppercase"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
        <MovieList
          movies={trendingMovies}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
        />
      </div>
    );
  };

  const handleReturnHome = () => {
    setShowFavorites(false);
    setSearchTerm('');
    setMovies([]);
    setHasSearched(false);
    setError(null);
  };

  const renderContent = () => {
    if (showFavorites) {
      return (
        <FavoritesSection
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
          onReturnHome={handleReturnHome}
        />
      );
    }

    if (loading) {
      return (
        <div className="space-y-4" role="status" aria-label="Loading movies">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-red-400 font-bold uppercase tracking-wider">Searching...</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-16" role="alert">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-400 font-bold text-lg mb-2 uppercase">Error: {error}</p>
          <p className="text-gray-500 text-sm mb-6">Please try again or adjust your search.</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={handleRetry}
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold rounded-lg transition-all uppercase tracking-wider text-sm"
            >
              Retry
            </button>
            <button 
              onClick={handleClear}
              className="px-6 py-2.5 bg-gray-800 border-2 border-gray-700 hover:border-red-500 text-white font-bold rounded-lg transition-all uppercase tracking-wider text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      );
    }

    if (!hasSearched) {
      return (
        <div>
          <div className="text-center py-12 mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                DISCOVER MOVIES
              </span>
            </h2>
            <p className="text-gray-400">Search for your favorite movies, TV shows, and more</p>
          </div>
          {renderTrendingSection()}
        </div>
      );
    }

    if (movies.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-600">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-white font-bold text-lg mb-1">No Movies Found</p>
          <p className="text-gray-500 text-sm">Try a different search term or type</p>
        </div>
      );
    }

return (
      <>
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            <span className="text-red-500 font-bold">{totalResults}</span> results found
            {searchTerm && <span> for "<span className="text-white font-bold">{searchTerm}</span>"</span>}
          </p>
        </div>
        <MovieList
          movies={movies}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
        />
        <Pagination
          currentPage={currentPage}
          totalResults={totalResults}
          onPageChange={handlePageChange}
        />
      </>
    );
  };

  return (
    <div>
      <div className="mb-6 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          <div className="flex-1">
            <SearchBar
              onSearch={handleSearch}
              initialValue={searchTerm}
            />
          </div>
          <div className="md:w-40">
            <TypeFilter
              selectedType={selectedType}
              onTypeChange={handleTypeChange}
            />
          </div>
        </div>
      </div>

      {favorites.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`px-5 py-2.5 rounded-lg font-bold transition-all uppercase tracking-wider text-sm ${
              showFavorites
                ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                : 'bg-gray-800 border-2 border-gray-700 text-white hover:border-red-500 hover:text-red-400'
            }`}
          >
            ★ My Favorites ({favorites.length})
          </button>
        </div>
      )}

      <div aria-live="polite">
        {renderContent()}
      </div>
    </div>
  );
}

export default SearchPage;