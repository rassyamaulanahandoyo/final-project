"use client";
import SpotifyPlayer from "react-spotify-web-playback";
import { useSession, getSession } from "next-auth/react";
import { usePlayer } from "../context/PlayerContext";
import { useEffect, useState, useRef } from "react";

export default function GlobalSpotifyPlayer() {
  const { currentTrackUris, isPlaying, setIsPlaying } = usePlayer();
  const { data: session, status } = useSession();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToken() {
      const s: any = await getSession();
      setAccessToken(s?.accessToken || null);
    }
    fetchToken();
  }, [status]);

  if (!accessToken) return null;

  return (
    <div style={{
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 50,
    }}>
      <SpotifyPlayer
        token={accessToken}
        uris={currentTrackUris}
        play={isPlaying}
        showSaveIcon
        magnifySliderOnHover
        persistDeviceSelection
        autoPlay
        initialVolume={0.5}
        styles={{
          activeColor: '#1db954',
          bgColor: '#111827',
          color: '#fff',
          loaderColor: '#1db954',
          sliderColor: '#1db954',
          trackArtistColor: '#9ca3af',
          trackNameColor: '#fff',
        }}
      />
    </div>
  );
}