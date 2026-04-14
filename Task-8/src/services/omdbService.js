const API_KEY = '9ca1be38';
const BASE_URL = 'https://www.omdbapi.com/';

export const searchMovies = async (searchTerm, type = '', page = 1) => {
  try {
    const params = new URLSearchParams({
      apikey: API_KEY,
      s: searchTerm,
      page: page.toString(),
    });

    if (type && type !== 'all') {
      params.append('type', type);
    }

    const response = await fetch(`${BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data.Response === 'False') {
      if (data.Error === 'Too many results.') {
        return { Search: [], totalResults: '0', Error: 'Too many results. Try adding more keywords.' };
      }
      return { Search: [], totalResults: '0', Error: data.Error || 'No results found' };
    }

    return {
      Search: data.Search || [],
      totalResults: data.totalResults || '0',
      Error: null,
    };
  } catch (error) {
    return {
      Search: [],
      totalResults: '0',
      Error: error.message || 'Failed to fetch movies',
    };
  }
};

export const getMovieDetails = async (imdbID) => {
  try {
    const params = new URLSearchParams({
      apikey: API_KEY,
      i: imdbID,
      plot: 'full',
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data.Response === 'False') {
      return { Error: data.Error || 'Movie not found', data: null };
    }

    return { data, Error: null };
  } catch (error) {
    return {
      Error: error.message || 'Failed to fetch movie details',
      data: null,
    };
  }
};

export const getPosterUrl = (poster) => {
  if (poster && poster !== 'N/A') {
    return poster;
  }
  return null;
};