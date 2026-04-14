import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ favoritesCount, onShowFavorites }) {
  return (
    <nav className="bg-black/80 backdrop-blur-md border-b-2 border-red-600/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <div className="relative">
            <svg
              className="w-9 h-9 text-red-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            RACEFLEX
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-gray-300 hover:text-red-400 font-semibold uppercase tracking-wider text-sm transition-colors"
          >
            Home
          </Link>
          {favoritesCount > 0 && (
            <button
              onClick={onShowFavorites}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-red-500/30"
            >
              <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {favoritesCount}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;