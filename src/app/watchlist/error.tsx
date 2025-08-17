'use client';

export default function Error({ error }: { error: Error }) {
  console.error('Watchlist page error:', error);
  
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold text-red-600">Error in Watchlist</h2>
      <p>{error.message}</p>
    </div>
  );
}
