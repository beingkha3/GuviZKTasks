# Movie Search Application

A ReactJS movie search application that uses the OMDB API to search for movies, browse results, view detailed information, and manage a favorites list.

## Features

- Search movies by keyword
- Filter results by type (movie, TV series, episode) using OMDB API
- Paginate through search results
- View detailed movie information
- Add/remove movies from favorites
- Persistent favorites (saved to localStorage)
- Responsive design for mobile and desktop
- Loading, error, and empty states

## Tech Stack

- ReactJS (JavaScript)
- React Router v6
- Tailwind CSS
- OMDB API

## Project Structure

```
Task-8/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── FavoritesSection.js
│   │   ├── MovieCard.js
│   │   ├── MovieList.js
│   │   ├── Navbar.js
│   │   ├── Pagination.js
│   │   ├── SearchBar.js
│   │   └── TypeFilter.js
│   ├── pages/
│   │   ├── MovieDetailsPage.js
│   │   └── SearchPage.js
│   ├── services/
│   │   └── omdbService.js
│   ├── App.js
│   ├── index.css
│   └── index.js
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Navigate to the project directory:
   ```bash
   cd Task-8
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
```

## Routing

- `/` - Search page (home)
- `/movie/:imdbID` - Movie details page

## API Key

The application uses a demo OMDB API key (`4a3b711b`) for demonstration purposes. For production use, you should obtain your own free API key from [omdbapi.com](https://www.omdbapi.com/apikey.aspx).

## Basic Hints to Solve

### How OMDB Search Works with Query Parameters

The OMDB API requires these parameters for search:
- `apikey` - Your API key
- `s` - Search query (movie title)
- `page` - Page number for pagination
- `type` - Optional filter (movie, series, episode)

```javascript
// Example API call
fetch('https://www.omdbapi.com/?apikey=YOUR_KEY&s=avatar&page=1&type=movie')
```

### How Pagination Works in OMDB

OMDB returns 10 results per page. The response includes:
- `Search` - Array of movie objects
- `totalResults` - Total number of results

```javascript
const totalPages = Math.ceil(parseInt(totalResults) / 10);
```

### How to Use the Type Parameter from API

The type filter is passed directly to the OMDB API, not filtered locally:

```javascript
// Fetch movies with type parameter
const result = await searchMovies(searchTerm, 'movie', page);

// In the API service
if (type && type !== 'all') {
  params.append('type', type);
}
```

### Why Search Results and Movie Details Should Be Fetched Separately

1. **Efficiency**: Search results return limited data (title, year, poster). Details need full plot, cast, ratings, etc.
2. **API Design**: OMDB uses different endpoints:
   - Search: `?s=query` - Returns list
   - Details: `?i=imdbID` - Returns full object
3. **User Experience**: Faster initial search results, lazy load detailed data on demand

### How React Router Fits into the Flow

```javascript
// App.js - Setup routes
<Routes>
  <Route path="/" element={<SearchPage />} />
  <Route path="/movie/:imdbID" element={<MovieDetailsPage />} />
</Routes>

// Navigate to movie details
<Link to={`/movie/${movie.imdbID}`}>View Details</Link>

// In details page, get the ID
const { imdbID } = useParams();
```

## State Management

- `searchTerm` - Current search query
- `selectedType` - Type filter (all/movie/series/episode)
- `movies` - Search results array
- `currentPage` - Current pagination page
- `totalResults` - Total results count from API
- `loading` - Loading state boolean
- `error` - Error message string
- `favorites` - Array of favorite movies

## License

MIT