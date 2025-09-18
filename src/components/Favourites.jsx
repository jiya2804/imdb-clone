import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { genreids } from "./genreids"; // <-- make sure this file exists

// ✅ Fixer function for old favourites
function fixOldFavourites() {
  let favs = JSON.parse(localStorage.getItem("imdb") || "[]");

  favs = favs.map((movie) => {
    // If movie already has genre_ids, keep it
    if (movie.genre_ids && movie.genre_ids.length > 0) return movie;

    // If genre name exists, try to map it back to ID
    if (movie.genre && Object.values(genreids).includes(movie.genre)) {
      const genreKey = Object.keys(genreids).find(
        (key) => genreids[key] === movie.genre
      );
      if (genreKey) {
        return { ...movie, genre_ids: [parseInt(genreKey)] };
      }
    }

    // Otherwise leave unchanged
    return movie;
  });

  localStorage.setItem("imdb", JSON.stringify(favs));
}

export default function Favourites() {
  const [movies, setMovies] = useState([]);
  const [currGenre, setCurrGenre] = useState("All Genres");
  const [search, setSearch] = useState("");
  const [currPage, setCurrPage] = useState(1);

  // ✅ Load and fix favourites on mount
  useEffect(() => {
    fixOldFavourites();
    let fav = JSON.parse(localStorage.getItem("imdb") || "[]");
    setMovies(fav);
  }, []);

  // ✅ Delete movie from favourites
  const removeFromFavourites = (movie) => {
    let updated = movies.filter((m) => m.id !== movie.id);
    setMovies(updated);
    localStorage.setItem("imdb", JSON.stringify(updated));
  };

  // ✅ Build genre list dynamically
  const genres = [
    "All Genres",
    ...new Set(
      movies
        .map((m) => genreids[m.genre_ids?.[0]]) // safe access
        .filter(Boolean) // remove invalid
    ),
  ];

  // ✅ Filter by genre
  let filteredMovies =
    currGenre === "All Genres"
      ? movies
      : movies.filter((m) => genreids[m.genre_ids?.[0]] === currGenre);

  // ✅ Search filter
  filteredMovies = filteredMovies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Pagination
  let maxPerPage = 4;
  let totalPages = Math.ceil(filteredMovies.length / maxPerPage);
  let startIndex = (currPage - 1) * maxPerPage;
  let endIndex = startIndex + maxPerPage;
  let moviesToShow = filteredMovies.slice(startIndex, endIndex);

  return (
    <div className="p-5">
      {/* Genre filter buttons */}
      <div className="flex space-x-2 mb-4">
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => {
              setCurrGenre(g);
              setCurrPage(1); // reset page when switching genre
            }}
            className={`px-3 py-1 rounded-lg ${
              currGenre === g
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrPage(1); // reset page when searching
        }}
        placeholder="Search..."
        className="border border-gray-300 px-3 py-2 rounded-lg w-full mb-4"
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Poster</th>
              <th className="border border-gray-300 p-2">Title</th>
              <th className="border border-gray-300 p-2">Genre</th>
              <th className="border border-gray-300 p-2">Rating</th>
              <th className="border border-gray-300 p-2">Popularity</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {moviesToShow.map((movie) => (
              <tr key={movie.id}>
                <td className="border border-gray-300 p-2 text-center">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    className="h-20 mx-auto"
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {movie.title}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {genreids[movie.genre_ids?.[0]] || "N/A"}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {movie.vote_average}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {movie.popularity}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => removeFromFavourites(movie)}
                    className="bg-red-500 text-white px-2 py-1 rounded-lg"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}

            {moviesToShow.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center text-gray-500 p-4 italic"
                >
                  No movies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currPage={currPage}
          setCurrPage={setCurrPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
