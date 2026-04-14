import React from 'react';

const MOVIE_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'movie', label: 'Movies' },
  { value: 'series', label: 'TV Series' },
  { value: 'episode', label: 'Episodes' },
];

function TypeFilter({ selectedType, onTypeChange }) {
  return (
    <select
      value={selectedType}
      onChange={(e) => onTypeChange(e.target.value)}
      className="w-full px-4 py-3.5 bg-gray-900/80 border-2 border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 cursor-pointer font-medium"
    >
      {MOVIE_TYPES.map((type) => (
        <option key={type.value} value={type.value} className="bg-gray-900">
          {type.label}
        </option>
      ))}
    </select>
  );
}

export default TypeFilter;