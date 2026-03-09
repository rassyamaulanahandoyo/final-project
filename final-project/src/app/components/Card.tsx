import { SpotifyTrack } from "../../lib/spotify";

interface CardSpotifyProps {
  track?: SpotifyTrack;
  isLoading?: boolean;
  onClick?: () => void;
}

export default function CardSpotify({ track, isLoading, onClick }: CardSpotifyProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-800/90 backdrop-blur-md p-4 rounded-2xl animate-pulse border border-gray-600/50 shadow-xl">
        <div className="w-full h-32 bg-gray-700/80 rounded-xl mb-3"></div>
        <div className="h-4 bg-gray-700/80 rounded-full mb-2"></div>
        <div className="h-3 bg-gray-700/80 rounded-full w-3/4"></div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="bg-gray-800/90 backdrop-blur-md p-4 rounded-2xl hover:bg-gray-700/90 transition duration-300 cursor-pointer border border-gray-600/50 shadow-xl">
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80"
          alt="Album placeholder"
          className="w-full h-32 object-cover rounded-xl mb-3"
        />
        <p className="text-sm font-medium truncate text-gray-100">Loading...</p>
        <p className="text-xs text-gray-400">Please wait</p>
      </div>
    );
  }

  const imageUrl = track.album.images[0]?.url || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80';
  const artistNames = track.artists.map(artist => artist.name).join(', ');

  return (
    <div 
      className="bg-gray-800/90 backdrop-blur-md p-4 rounded-2xl hover:bg-gray-700/90 transition-all duration-300 cursor-pointer group border border-gray-600/50 shadow-xl hover:shadow-2xl hover:border-pink-400/50"
      onClick={() => {
        console.log('Card clicked:', track.name);
        onClick?.();
      }}
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={`${track.album.name} cover`}
          className="w-full h-32 object-cover rounded-xl mb-3 shadow-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl flex items-center justify-center">
          <button className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full w-12 h-12 flex items-center justify-center hover:scale-110 transform shadow-2xl">
            <i className="fas fa-play text-white ml-0.5"></i>
          </button>
        </div>
      </div>
      <p className="text-sm font-medium truncate text-gray-100" title={track.name}>
        {track.name}
      </p>
      <p className="text-xs text-gray-400 truncate" title={artistNames}>
        {artistNames}
      </p>
    </div>
  );
}