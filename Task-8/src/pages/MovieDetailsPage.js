import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails, getPosterUrl } from '../services/omdbService';

function MovieDetailsPage({ addToFavorites, removeFromFavorites, isFavorite }) {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);
      const result = await getMovieDetails(imdbID);
      setLoading(false);

      if (result.Error) {
        setError(result.Error);
      } else {
        setMovie(result.data);
      }
    };

    fetchMovieDetails();
  }, [imdbID]);

  const handleToggleFavorite = () => {
    if (!movie) return;
    
    if (isFavorite(imdbID)) {
      removeFromFavorites(imdbID);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-red-400 font-bold uppercase tracking-wider">Loading details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 text-red-500">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-red-400 font-bold text-lg mb-1 uppercase">Error</p>
        <p className="text-gray-500 text-sm mb-6">{error}</p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-lg hover:from-red-500 hover:to-red-400 transition-all uppercase tracking-wider"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Search
        </Link>
      </div>
    );
  }

  if (!movie) {
    return null;
  }

  const posterUrl = getPosterUrl(movie.Poster);
  const isFav = isFavorite(imdbID);

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center text-gray-400 hover:text-red-400 mb-6 transition-colors font-bold uppercase tracking-wider text-sm"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Search
      </Link>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 order-2 md:order-1">
          <div className="racing-card rounded-xl overflow-hidden shadow-2xl">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={movie.Title}
                className="w-full"
              />
            ) : (
              <div className="w-full aspect-[2/3] flex items-center justify-center text-gray-600 bg-gray-800">
                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
                </svg>
              </div>
            )}
            <div className="p-3">
              <button
                onClick={handleToggleFavorite}
                className={`w-full py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs ${
                  isFav
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white'
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill={isFav ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isFav ? 'Remove' : 'Add Favorite'}
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 order-1 md:order-2">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">{movie.Title}</h1>
          
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {movie.Year && movie.Year !== 'N/A' && (
              <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-white text-xs font-bold">
                {movie.Year}
              </span>
            )}
            {movie.Type && movie.Type !== 'N/A' && (
              <span className="px-3 py-1 bg-red-600 rounded-full text-white text-xs font-bold uppercase">
                {movie.Type}
              </span>
            )}
            {movie.Runtime && movie.Runtime !== 'N/A' && (
              <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-white text-xs font-medium">
                {movie.Runtime}
              </span>
            )}
            {movie.imdbRating && movie.imdbRating !== 'N/A' && (
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 text-xs font-bold">
                ★ IMDb {movie.imdbRating}
              </span>
            )}
          </div>

          {movie.Genre && movie.Genre !== 'N/A' && (
            <div className="mb-4">
              <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Genre</h3>
              <div className="flex flex-wrap gap-1.5">
                {movie.Genre.split(', ').map((genre, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-800 border border-gray-700 text-white text-xs font-medium rounded"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {movie.Plot && movie.Plot !== 'N/A' && (
            <div className="mb-4">
              <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Plot</h3>
              <p className="text-gray-300 leading-relaxed text-sm">{movie.Plot}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {movie.Director && movie.Director !== 'N/A' && (
              <div className="racing-card p-3 rounded-lg">
                <p className="text-gray-500 text-xs font-bold uppercase mb-1">Director</p>
                <p className="text-white text-sm">{movie.Director}</p>
              </div>
            )}
            {movie.Actors && movie.Actors !== 'N/A' && (
              <div className="racing-card p-3 rounded-lg">
                <p className="text-gray-500 text-xs font-bold uppercase mb-1">Cast</p>
                <p className="text-white text-sm">{movie.Actors}</p>
              </div>
            )}
            {movie.Writer && movie.Writer !== 'N/A' && (
              <div className="racing-card p-3 rounded-lg sm:col-span-2">
                <p className="text-gray-500 text-xs font-bold uppercase mb-1">Writer</p>
                <p className="text-white text-sm">{movie.Writer}</p>
              </div>
            )}
          </div>

          {movie.Ratings && movie.Ratings.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Ratings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {movie.Ratings.map((rating, index) => (
                  <div
                    key={index}
                    className="racing-card px-3 py-2 rounded-lg flex items-center justify-between"
                  >
                    <span className="text-gray-400 text-xs font-medium">{rating.Source}</span>
                    <span className="text-red-500 font-bold text-sm">{rating.Value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {movie.Language && movie.Language !== 'N/A' && (
              <div className="racing-card p-2 rounded-lg">
                <p className="text-gray-500 text-xs font-bold uppercase">Language</p>
                <p className="text-white text-xs">{movie.Language}</p>
              </div>
            )}
            {movie.Country && movie.Country !== 'N/A' && (
              <div className="racing-card p-2 rounded-lg">
                <p className="text-gray-500 text-xs font-bold uppercase">Country</p>
                <p className="text-white text-xs">{movie.Country}</p>
              </div>
            )}
            {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
              <div className="racing-card p-2 rounded-lg col-span-2">
                <p className="text-gray-500 text-xs font-bold uppercase">Box Office</p>
                <p className="text-white text-xs">{movie.BoxOffice}</p>
              </div>
            )}
            {movie.imdbVotes && movie.imdbVotes !== 'N/A' && (
              <div className="racing-card p-2 rounded-lg">
                <p className="text-gray-500 text-xs font-bold uppercase">IMDb Votes</p>
                <p className="text-white text-xs">{movie.imdbVotes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsPage;