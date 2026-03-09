import NextAuth from "next-auth/next"
import SpotifyProvider from "next-auth/providers/spotify"

/* eslint-disable @typescript-eslint/no-explicit-any */

const scopes = [
  "user-read-email",
  "user-read-private", 
  "user-library-read",
  "user-library-modify",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "streaming"
].join(" ")

const params = {
  scope: scopes
}

const LOGIN_URL = "https://accounts.spotify.com/authorize?" + new URLSearchParams(params).toString()

export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: LOGIN_URL,
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: any; account: any }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expires_at = account.expires_at
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      session.expires_at = token.expires_at
      return session
    },
  },
  pages: {
    signIn: '/login',
  }
}

export default NextAuth(authOptions)