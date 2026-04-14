import React from 'react';
import { Link } from 'react-router-dom';
import { getPosterUrl } from '../services/omdbService';

function MovieCard({ movie, onToggleFavorite, isFavorite }) {
  const posterUrl = getPosterUrl(movie.Poster);
  const isFav = isFavorite(movie.imdbID);

  return (
    <article className="racing-card rounded-xl overflow-hidden transition-all duration-300">
      <Link 
        to={`/movie/${movie.imdbID}`} 
        className="block"
        aria-label={`View details for ${movie.Title}`}
      >
        <div className="relative aspect-[2/3] bg-gray-800 overflow-hidden">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.Title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600" aria-label="No poster available">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
              </svg>
            </div>
          )}
          <div className="absolute top-2 right-2" aria-hidden="true">
            <span className="px-2 py-1 bg-red-600/90 text-white text-xs font-bold rounded uppercase">
              {movie.Type}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        </div>
      </Link>
      <div className="p-3 relative z-10 -mt-4">
        <Link to={`/movie/${movie.imdbID}`}>
          <h3 className="text-white font-bold text-sm mb-1 hover:text-red-400 transition-colors line-clamp-2 leading-tight">
            {movie.Title}
          </h3>
        </Link>
        <p className="text-gray-400 text-xs mb-3 font-medium">{movie.Year}</p>
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite(movie);
          }}
          aria-pressed={isFav}
          className={`w-full py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            isFav
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-800 text-gray-300 hover:bg-red-600 hover:text-white'
          }`}
        >
          <svg
            className="w-4 h-4"
            fill={isFav ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          {isFav ? 'REMOVE' : 'FAVORITE'}
        </button>
      </div>
    </article>
  );
}

export default MovieCard;