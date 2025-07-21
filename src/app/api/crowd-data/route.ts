import { NextResponse } from 'next/server';

const places = [
  { name: 'City Palace, Udaipur', place_id: 'ChIJ1adZBmTlZzkRDqvq-navV5I' },
  { name: 'Saheliyon Ki Bari', place_id: 'ChIJd9K3fdflZzkRQeScJCCgYZ0' },
  { name: 'Jagdish Temple', place_id: 'ChIJ44SA0mXlZzkROFPFp4ABD_A' },
];

export async function GET() {
  const apiKey = process.env.Maps_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
  }

  try {
    const placesData = await Promise.all(
      places.map(async (place) => {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,place_id,current_opening_hours&key=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'OK' || !data.result) {
          return { 
            name: place.name, 
            error: data.error_message || `API error: ${data.status}` 
          };
        }
        
        const liveCrowdData = data.result.current_opening_hours?.popular_times?.find(
          (time: any) => time.time_of_day === new Date().getHours()
        );
        
        return {
          name: data.result.name,
          place_id: data.result.place_id,
          liveCrowdPercent: liveCrowdData ? liveCrowdData.occupancy_percent : null,
        };
      })
    );

    return NextResponse.json(placesData);

  } catch (error) {
    console.error('Catch block error:', error);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}