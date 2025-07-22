'use client';

import { useState, useEffect } from 'react';

// Define a type for our place data for better code quality
type Place = {
  name: string;
  place_id: string;
  liveCrowdPercent: number | null;
  error?: string;
};

export default function PlaceList() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This function fetches the data from our own backend API
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
  }, []); // The empty array means this effect runs once when the component loads

  if (isLoading) {
    return <p className="text-center">Loading tourist spots...</p>;
  }

  return (
    <div className="w-full max-w-2xl">
      <ul className="space-y-4">
        {places.map((place) => (
          <li key={place.place_id} className="p-4 bg-gray-800 rounded-lg shadow-md">
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