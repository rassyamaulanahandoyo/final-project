"use client"

import Image from "next/image";

export default function Home() {
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
      <div className="flex flex-col h-screen">
        <header className="bg-gradient-to-r from-green-400 to-blue-500 p-4 md:p-6">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold">Vibe</h1>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <a
                    href="#"
                    className="hover:text-green-300 transition duration-300"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-300 transition duration-300"
                  >
                    Liked Songs
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="flex-grow overflow-y-auto p-4 md:p-8">
          <div className="container mx-auto">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Search</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for songs, artists, or albums"
                  className="w-full bg-gray-800 text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <i className="fas fa-search absolute left-3 top-3 text-gray-400" />
              </div>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Songs</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition duration-300 cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80"
                    alt="Album 1"
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  <p className="text-sm font-medium truncate">Imagine Dragons</p>
                  <p className="text-xs text-gray-400">Believer</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition duration-300 cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80"
                    alt="Album 2"
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  <p className="text-sm font-medium truncate">The Weeknd</p>
                  <p className="text-xs text-gray-400">Blinding Lights</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition duration-300 cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80"
                    alt="Album 3"
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  <p className="text-sm font-medium truncate">Dua Lipa</p>
                  <p className="text-xs text-gray-400">Levitating</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition duration-300 cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80"
                    alt="Album 4"
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  <p className="text-sm font-medium truncate">Ed Sheeran</p>
                  <p className="text-xs text-gray-400">Shape of You</p>
                </div>
              </div>
            </section>
          </div>
        </main>
        <footer className="bg-gray-900 p-4">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img
                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&q=80"
                alt="Now Playing"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="font-medium">Levitating</p>
                <p className="text-sm text-gray-400">Dua Lipa</p>
              </div>
            </div>
            <div className="flex flex-col items-center mb-4 md:mb-0">
              <div className="flex items-center space-x-4 mb-2">
                <button className="text-gray-400 hover:text-white transition duration-300">
                  <i className="fas fa-step-backward" />
                </button>
                <button className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition duration-300">
                  <i className="fas fa-play" />
                </button>
                <button className="text-gray-400 hover:text-white transition duration-300">
                  <i className="fas fa-step-forward" />
                </button>
              </div>
              <div className="w-full max-w-md flex items-center">
                <span className="text-xs mr-2">1:23</span>
                <div className="flex-grow bg-gray-700 rounded-full h-1">
                  <div className="bg-green-500 w-1/3 h-full rounded-full" />
                </div>
                <span className="text-xs ml-2">3:45</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-white transition duration-300">
                <i className="fas fa-volume-up" />
              </button>
              <button className="text-gray-400 hover:text-white transition duration-300">
                <i className="fas fa-random" />
              </button>
              <button className="text-gray-400 hover:text-white transition duration-300">
                <i className="fas fa-redo-alt" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
