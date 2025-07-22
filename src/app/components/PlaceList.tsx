'use client';

import { useState, useEffect } from 'react';

type Place = {
  name: string;
  place_id?: string; // Made optional as it won't exist on error
  liveCrowdPercent: number | null;
  error?: string;
};

export default function PlaceList() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/crowd-data');
        const data = await response.json();
        setPlaces(data);
      } catch (error) {
        console.error("Failed to fetch places data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return <p className="text-center">Loading tourist spots...</p>;
  }

  return (
    <div className="w-full max-w-2xl">
      <ul className="space-y-4">
        {/* CORRECTED: Using place.name as the key for stability */}
        {places.map((place) => (
          <li key={place.name} className="p-4 bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{place.name}</h2>
            {place.error ? (
              <p className="text-red-400">Error: {place.error}</p>
            ) : (
              <p>
                Current Crowd: 
                <span className={
                  place.liveCrowdPercent === null ? 'text-gray-400' :
                  place.liveCrowdPercent < 40 ? 'text-green-400' :
                  place.liveCrowdPercent < 70 ? 'text-yellow-400' : 'text-red-400'
                }>
                  {place.liveCrowdPercent === null ? ' Not available' : ` ${place.liveCrowdPercent}%`}
                </span>
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}