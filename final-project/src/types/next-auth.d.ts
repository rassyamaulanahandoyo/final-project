declare module "next-auth" {
  interface Session {
    accessToken?: string
    refreshToken?: string
    expires_at?: number
  }
}