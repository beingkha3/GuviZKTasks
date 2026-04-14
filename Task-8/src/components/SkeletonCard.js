import React from 'react';

function SkeletonCard() {
  return (
    <div className="racing-card rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[2/3] bg-gray-800"></div>
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-700 rounded w-1/4"></div>
        <div className="h-8 bg-gray-700 rounded mt-3"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;