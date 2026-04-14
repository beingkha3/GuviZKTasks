import React from 'react';

function Pagination({ currentPage, totalResults, onPageChange }) {
  const totalPages = Math.min(Math.ceil(parseInt(totalResults) / 10), 100);

  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center flex-wrap gap-2 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-800 border-2 border-gray-700 rounded-lg text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:border-red-500 hover:text-red-400 transition-all"
      >
        PREV
      </button>

      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 bg-gray-800 border-2 border-gray-700 rounded-lg text-white text-sm font-bold hover:border-red-500 hover:text-red-400 transition-all"
          >
            1
          </button>
          {pageNumbers[0] > 2 && <span className="px-2 text-red-400 font-bold">...</span>}
        </>
      )}

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            page === currentPage
              ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
              : 'bg-gray-800 border-2 border-gray-700 text-white hover:border-red-500 hover:text-red-400'
          }`}
        >
          {page}
        </button>
      ))}

      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="px-2 text-red-400 font-bold">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 bg-gray-800 border-2 border-gray-700 rounded-lg text-white text-sm font-bold hover:border-red-500 hover:text-red-400 transition-all"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-800 border-2 border-gray-700 rounded-lg text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:border-red-500 hover:text-red-400 transition-all"
      >
        NEXT
      </button>
    </div>
  );
}

export default Pagination;