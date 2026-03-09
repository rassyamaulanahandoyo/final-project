"use client"

import Link from "next/link";
import { useSession, signOut, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { spotifyAPI, SpotifyTrack } from "../../lib/spotify";
import CardSpotify from "../components/Card";
import { usePlayer } from "@/context/PlayerContext";
import GestureController from "../../components/GestureController";

export default function LikedSongs() {
  const { status } = useSession();
  const [sessionWithToken, setSessionWithToken] = useState<{ accessToken?: string } & { [key: string]: any } | null>(null);
  const [likedSongs, setLikedSongs] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Use global player context
  const { currentTrackUris, setCurrentTrackUris, isPlaying, setIsPlaying } = usePlayer();

  useEffect(() => {
    async function fetchSession() {
      const s = await getSession();
      setSessionWithToken(s as { accessToken?: string } & { [key: string]: any });
    }
    fetchSession();
  }, [status]);

  useEffect(() => {
    const fetchLikedSongs = async () => {
      if (!sessionWithToken?.accessToken) return;
      try {
        setIsLoading(true);
        setError(null);
        const tracks = await spotifyAPI.getFeaturedPlaylists(sessionWithToken.accessToken as string, 50);
        setLikedSongs(tracks);
      } catch (err) {
        setError("Failed to load liked songs.");
      } finally {
        setIsLoading(false);
      }
    };
    if (sessionWithToken?.accessToken) {
      fetchLikedSongs();
    }
  }, [sessionWithToken?.accessToken]);

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

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Liked Songs - Vibe</title>
      <link
        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        rel="stylesheet"
      />
      <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        {/* Gesture controller for liked songs */}
        {likedSongs.length > 0 && (
          <GestureController trackUris={likedSongs.map(t => t.uri)} />
        )}
        <header className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 p-4 md:p-6 shadow-2xl">
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
                  <Link href="/" className="text-white/90 hover:text-white hover:bg-white/20 px-3 py-2 rounded-full backdrop-blur-sm transition duration-300">Home</Link>
                </li>
                <li>
                  <Link href="/liked" className="text-white font-semibold bg-white/20 px-3 py-2 rounded-full backdrop-blur-sm hover:bg-white/30 transition duration-300">Liked Songs</Link>
                </li>
                {sessionWithToken && sessionWithToken.user && (
                  <>
                    <li className="text-white/90 bg-white/10 px-3 py-2 rounded-full backdrop-blur-sm">Welcome, {sessionWithToken.user?.name}!</li>
                    <li>
                      <button onClick={() => signOut()} className="text-white/90 hover:text-white hover:bg-red-500/30 px-3 py-2 rounded-full backdrop-blur-sm transition duration-300">Logout</button>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </header>
        <div className="flex flex-grow overflow-hidden">
          {/* Gesture Controls Sidebar */}
          {likedSongs.length > 0 && (
            <aside className="w-80 bg-gradient-to-b from-purple-900/40 to-pink-900/40 backdrop-blur-md border-r border-white/10 p-6 overflow-y-auto">
              <div className="sticky top-0">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                  <i className="fas fa-hand-paper mr-2 text-purple-400"></i>
                  Gesture Controls
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-xl">🖐️</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Open Palm</p>
                      <p className="text-xs text-gray-300">Play Music</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                    <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                      <span className="text-xl">✊</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Closed Fist</p>
                      <p className="text-xs text-gray-300">Pause Music</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-xl">👉</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Point Right</p>
                      <p className="text-xs text-gray-300">Next Track</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <span className="text-xl">✌️</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Peace Sign</p>
                      <p className="text-xs text-gray-300">Previous Track</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-3 bg-gray-800/40 rounded-xl border border-gray-700/30">
                  <p className="text-xs text-gray-400 text-center leading-relaxed">
                    Hold gestures steady for 1-2 seconds. Camera feed appears in bottom-right corner.
                  </p>
                </div>
              </div>
            </aside>
          )}
          <main className="flex-grow overflow-y-auto p-4 md:p-8">
            <div className="container mx-auto">
              <section className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-56 h-56 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mr-6 shadow-2xl backdrop-blur-md border border-white/20">
                    <i className="fas fa-heart text-6xl text-white drop-shadow-lg"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300 mb-2 font-medium">PLAYLIST</p>
                    <h1 className="text-5xl font-bold mb-4 text-gray-100">Liked Songs</h1>
                    <p className="text-gray-300">Your favorite tracks • {likedSongs.length} songs</p>
                  </div>
                </div>
                {error && <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-2xl mb-4 backdrop-blur-md shadow-xl">{error}</div>}
                {isLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {Array.from({ length: 12 }).map((_, idx) => (
                      <div key={`loading-${idx}`} className="transform hover:scale-105 transition duration-300">
                        <CardSpotify isLoading={true} />
                      </div>
                    ))}
                  </div>
                ) : likedSongs.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {likedSongs.map((track) => (
                      <div key={track.id} className="transform hover:scale-105 transition duration-300">
                        <CardSpotify track={track} onClick={() => handleSongSelect(track, likedSongs)} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-8">No liked songs found.</div>
                )}
              </section>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}