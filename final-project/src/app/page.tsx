"use client"

import Link from "next/link";
import { useSession, signOut, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import SpotifyPlayer from "react-spotify-web-playback";
import CardSpotify from "./components/Card";
import { spotifyAPI, SpotifyTrack } from "../lib/spotify";
import { usePlayer } from "../context/PlayerContext";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [songs, setSongs] = useState<SpotifyTrack[]>([]);
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use global player context
  const { currentTrackUris, setCurrentTrackUris, isPlaying, setIsPlaying } = usePlayer();


  // Always get the latest session with access token
  const [sessionWithToken, setSessionWithToken] = useState<{ accessToken?: string } & typeof session | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const s = await getSession();
      setSessionWithToken(s as { accessToken?: string } & typeof session);
    }
    fetchSession();
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated" && !sessionWithToken) {
      router.push('/login');
    }
  }, [sessionWithToken, status, router]);

  // Fetch initial songs when session is available
  useEffect(() => {
    const fetchInitialSongs = async () => {
      if (!sessionWithToken?.accessToken) return;

      try {
        setIsLoading(true);
        setError(null);
        const tracks = await spotifyAPI.getPopularTracks(sessionWithToken.accessToken as string, 20);
        setSongs(tracks);
        
        if (tracks.length === 0) {
          setError('No music found. Try searching for songs instead.');
        }
      } catch (error) {
        console.error('Error fetching songs:', error);
        setError('Failed to load songs. Please check your Spotify connection.');
        
        try {
          const fallbackTracks = await spotifyAPI.searchTracks('popular', sessionWithToken.accessToken as string, 20);
          setSongs(fallbackTracks);
          setError(null);
        } catch (fallbackError) {
          console.error('Fallback search also failed:', fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionWithToken?.accessToken) {
      fetchInitialSongs();
    }
  }, [sessionWithToken?.accessToken]);
  
  useEffect(() => {
    const searchTracks = async () => {
      if (!searchQuery.trim() || !sessionWithToken?.accessToken) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        setError(null);
        const results = await spotifyAPI.searchTracks(searchQuery, sessionWithToken.accessToken as string, 20);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching tracks:', error);
        setError('Search failed');
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchTracks, 500); // 500ms debounce
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, sessionWithToken?.accessToken]);

  // Function to handle song selection
  const handleSongSelect = (track: SpotifyTrack, trackList: SpotifyTrack[]) => {
    const uris = trackList.map(t => t.uri);
    const startIndex = trackList.findIndex(t => t.id === track.id);
    // Reorder the array to start with the selected track
    const reorderedUris = [
      ...uris.slice(startIndex),
      ...uris.slice(0, startIndex)
    ];
    setCurrentTrackUris(reorderedUris);
    setIsPlaying(true);
  };



  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-white">Loading...</div>
    </div>;
  }

  if (!sessionWithToken) {
    return <div className="flex items-center justify-center min-h-screen"><div className="text-white">Loading...</div></div>;
  }

  const displayedSongs = searchQuery.trim() ? searchResults : songs;
  const isDisplayLoading = searchQuery.trim() ? isSearching : isLoading;

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Spotify Web Player</title>
      <link
        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        rel="stylesheet"
      />
      <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <header className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-4 md:p-6 shadow-2xl">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img 
                src="/vibe-logo.svg" 
                alt="Vibe Logo" 
                className="w-10 h-10 md:w-12 md:h-12 drop-shadow-lg"
              />
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">Vibe</h1>
            </div>
            <nav>
              <ul className="flex space-x-4 items-center">
                <li>
                  <Link
                    href="/"
                    className="text-white font-semibold bg-white/20 px-3 py-2 rounded-full backdrop-blur-sm hover:bg-white/30 transition duration-300"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/liked"
                    className="text-white/90 hover:text-white hover:bg-white/20 px-3 py-2 rounded-full backdrop-blur-sm transition duration-300"
                  >
                    Liked Songs
                  </Link>
                </li>
                {session && (
                  <>
                    <li className="text-white/90 bg-white/10 px-3 py-2 rounded-full backdrop-blur-sm">
                      Welcome, {session.user?.name}!
                    </li>
                    <li>
                      <button
                        onClick={() => signOut()}
                        className="text-white/90 hover:text-white hover:bg-red-500/30 px-3 py-2 rounded-full backdrop-blur-sm transition duration-300"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </header>
        <main className="flex-grow overflow-y-auto p-4 md:p-8">
          <div className="container mx-auto">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-100">Search</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for songs, artists, or albums"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800/80 backdrop-blur-md text-gray-100 rounded-2xl py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:bg-gray-800 border border-gray-600/50 transition duration-300 placeholder-gray-400"
                />
                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-pink-400 border-t-transparent"></div>
                  </div>
                )}
              </div>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-100">
                {searchQuery.trim() ? `Search Results for "${searchQuery}"` : 'Top Hits'}
              </h2>
              
              {error && (
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-2xl mb-4 backdrop-blur-md shadow-xl">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {isDisplayLoading ? (
                  // Loading skeleton
                  Array.from({ length: 12 }).map((_, index) => (
                    <div key={`loading-${index}`} className="transform hover:scale-105 transition duration-300">
                      <CardSpotify isLoading={true} />
                    </div>
                  ))
                ) : displayedSongs.length > 0 ? (
                  // Display actual songs
                  displayedSongs.map((track) => (
                    <div key={track.id} className="transform hover:scale-105 transition duration-300">
                      <CardSpotify 
                        track={track} 
                        onClick={() => handleSongSelect(track, displayedSongs)}
                      />
                    </div>
                  ))
                ) : (
                  // No results message
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-400 text-lg">
                      {searchQuery.trim() ? 'No songs found' : 'No songs available'}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
        {/* The global SpotifyPlayer is now mounted at the root. Optionally, show a message if nothing is queued. */}
        {currentTrackUris.length === 0 && (
          <div className="text-center text-gray-400 p-4">
            <p>Click on a song to start playing</p>
            <p className="text-xs mt-2">Note: Spotify Premium is required for playback and volume control</p>
          </div>
        )}
      </div>
    </>
  );
}
