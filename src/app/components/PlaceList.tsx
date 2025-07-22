'use client';

import { useState, useEffect } from 'react';

type Place = {
  name: string;
  place_id?: string;
  liveCrowdPercent: number | null;
  error?: string;
};

export default function PlaceList() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/crowd-data');
        if (!response.ok) {
          // Handle server errors (like 500)
          throw new Error('Failed to fetch data from the server.');
        }
        const data = await response.json();

        // Check if the received data is an array before setting it
        if (Array.isArray(data)) {
          setPlaces(data);
        } else {
          // If it's not an array, it's an unexpected response
          throw new Error('Received invalid data format from the server.');
        }

      } catch (err) {
        console.error("Failed to fetch places data:", err);
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return <p className="text-center">Loading tourist spots...</p>;
  }

  if (error) {
    return <p className="text-center text-red-400">Error: {error}</p>;
  }

  return (
    <div className="w-full max-w-2xl">
      <ul className="space-y-4">
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