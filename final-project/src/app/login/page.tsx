"use client"

import Link from "next/link";
import { signIn } from "next-auth/react";

export default function Login() {
  const handleSpotifyLogin = () => {
    signIn("spotify", { callbackUrl: "/" });
  };

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Login - Vibe</title>
      <link
        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        rel="stylesheet"
      />
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-black bg-opacity-80 rounded-3xl p-8 md:p-12 w-full max-w-md backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Vibe</h1>
            <p className="text-gray-300">Connect with your music</p>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleSpotifyLogin}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-full transition duration-300 flex items-center justify-center space-x-3 transform hover:scale-105"
            >
              <i className="fab fa-spotify text-xl"></i>
              <span>Continue with Spotify</span>
            </button>

            <div className="pt-6 border-t border-gray-700">
              <p className="text-xs text-gray-500 text-center">
                By continuing, you agree to Vibe&apos;s{" "}
                <a href="#" className="underline hover:text-gray-400">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline hover:text-gray-400">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}