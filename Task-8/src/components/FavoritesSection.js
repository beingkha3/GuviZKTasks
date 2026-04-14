import React from 'react';
import MovieList from './MovieList';

function FavoritesSection({ favorites, onToggleFavorite, isFavorite, onReturnHome }) {
  if (!favorites || favorites.length === 0) {
    return (
      <div className="text-center py-16">
        <button
          onClick={onReturnHome}
          className="inline-flex items-center text-red-400 hover:text-red-300 mb-6 transition-colors font-bold uppercase tracking-wider text-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>
        <div className="w-20 h-20 mx-auto mb-4 text-gray-600">
          <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <p className="text-white text-xl font-bold mb-2">No Favorites Yet</p>
        <p className="text-gray-400 text-sm">Start adding movies to your favorites!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="w-2 h-8 bg-gradient-to-b from-red-500 to-red-700 rounded-full"></span>
          <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            MY FAVORITES
          </span>
          <span className="text-gray-400 text-lg">({favorites.length})</span>
        </h2>
        <button
          onClick={onReturnHome}
          className="px-4 py-2 bg-gray-800 border-2 border-gray-700 hover:border-red-500 text-white font-bold rounded-lg transition-all text-sm uppercase"
        >
          ← Back
        </button>
      </div>
      <MovieList
        movies={favorites}
        onToggleFavorite={onToggleFavorite}
        isFavorite={isFavorite}
      />
    </div>
  );
}

export default FavoritesSection;