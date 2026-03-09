export interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  artists: Array<{
    name: string;
  }>;
  album: {
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  duration_ms: number;
  preview_url: string | null;
}

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
    total: number;
  };
}

export interface SpotifyPlaylistResponse {
  items: Array<{
    track: SpotifyTrack;
  }>;
}

class SpotifyAPI {
  // Fetch user's liked (saved) songs, fallback to top tracks or popular
  async getFeaturedPlaylists(accessToken: string, limit: number = 20): Promise<SpotifyTrack[]> {
    try {
      // Try to get user's saved tracks first
      const savedTracks = await this.getUserSavedTracks(accessToken, limit);
      if (savedTracks.length > 0) {
        return savedTracks;
      }
      // If no saved tracks, try user's top tracks
      return this.getTopTracks(accessToken, limit);
    } catch (error) {
      console.error('Error fetching featured playlists:', error);
      // Fallback to search for popular songs
      return this.getPopularTracks(accessToken, limit);
    }
  }

  async getUserSavedTracks(accessToken: string, limit: number = 20): Promise<SpotifyTrack[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/me/tracks?limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }

      const data = await response.json();
      return data.items.map((item: { track: SpotifyTrack }) => item.track).filter((track: SpotifyTrack | null) => track && track.id);
    } catch (error) {
      console.error('Error fetching saved tracks:', error);
      throw error;
    }
  }

  async getTopTracks(accessToken: string, limit: number = 20): Promise<SpotifyTrack[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/me/top/tracks?limit=${limit}&time_range=medium_term`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        // If user doesn't have top tracks, fall back to search for popular songs
        return this.getPopularTracks(accessToken, limit);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching top tracks:', error);
      // Fallback to search for popular songs
      return this.getPopularTracks(accessToken, limit);
    }
  }
  private baseUrl = 'https://api.spotify.com/v1';

  async searchTracks(query: string, accessToken: string, limit: number = 20): Promise<SpotifyTrack[]> {
    if (!query.trim()) return [];

    try {
      const response = await fetch(
        `${this.baseUrl}/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }

      const data: SpotifySearchResponse = await response.json();
      return data.tracks.items;
    } catch (error) {
      console.error('Error searching tracks:', error);
      throw error;
    }
  }

  





  async getPopularTracks(accessToken: string, limit: number = 20): Promise<SpotifyTrack[]> {
    const popularQueries = [
      'year:2024',
      'genre:pop',
      'genre:rock',
      'artist:Taylor Swift',
      'artist:Ed Sheeran',
      'artist:Adele'
    ];

    let allTracks: SpotifyTrack[] = [];
    const seenTrackIds = new Set<string>();

    for (const query of popularQueries) {
      try {
        const tracks = await this.searchTracks(query, accessToken, Math.min(limit, 20));
        for (const track of tracks) {
          if (!seenTrackIds.has(track.id)) {
            allTracks.push(track);
            seenTrackIds.add(track.id);
            if (allTracks.length >= limit) {
              return allTracks.slice(0, limit);
            }
          }
        }
      } catch (error) {
        console.error(`Error with query "${query}":`, error);
        continue;
      }
    }

    return allTracks.slice(0, limit);
  }

  async getPlaylistTracks(playlistId: string, accessToken: string, limit: number = 20): Promise<SpotifyTrack[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/playlists/${playlistId}/tracks?limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 404) {
        // Gracefully handle 404 and return empty array to trigger fallback
        console.warn('Playlist not found (404), falling back to popular tracks.');
        return [];
      }

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }

      const data = await response.json();
      return data.items.map((item: { track: SpotifyTrack }) => item.track).filter((track: SpotifyTrack | null) => track && track.id);
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
      // On error, return empty array to trigger fallback
      return [];
    }
  }

  getImageUrl(track: SpotifyTrack, size: 'small' | 'medium' | 'large' = 'medium'): string {
    const images = track.album.images;
    if (!images || images.length === 0) {
      return '/placeholder-album.png'; // You can add a placeholder image
    }

    // Sort by size and pick appropriate one
    const sortedImages = images.sort((a, b) => b.width - a.width);
    
    switch (size) {
      case 'small':
        return sortedImages[sortedImages.length - 1]?.url || sortedImages[0]?.url;
      case 'large':
        return sortedImages[0]?.url;
      case 'medium':
      default:
        return sortedImages[Math.floor(sortedImages.length / 2)]?.url || sortedImages[0]?.url;
    }
  }

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

export const spotifyAPI = new SpotifyAPI();