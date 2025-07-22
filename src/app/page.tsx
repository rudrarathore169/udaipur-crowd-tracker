import PlaceList from "./components/PlaceList";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">Udaipur Crowd Tracker</h1>
        <p className="text-lg text-gray-400 mt-2">Find the most peaceful spots right now.</p>
      </div>
      <PlaceList />
    </main>
  );
}