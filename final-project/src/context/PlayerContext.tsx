"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface PlayerContextType {
  currentTrackUris: string[];
  setCurrentTrackUris: (uris: string[]) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  setIsPlayingFromGesture: (playing: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrackUris, setCurrentTrackUris] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const setIsPlayingFromGesture = (playing: boolean) => {
    setIsPlaying(playing);
    // Notify any listeners that this was a gesture-initiated change
    window.dispatchEvent(new CustomEvent('gesturePlayStateChange', { detail: { isPlaying: playing } }));
  };

  return (
    <PlayerContext.Provider value={{ currentTrackUris, setCurrentTrackUris, isPlaying, setIsPlaying, setIsPlayingFromGesture }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within a PlayerProvider");
  return context;
}
