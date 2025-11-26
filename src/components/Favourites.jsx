import React, { useEffect, useMemo, useState } from "react";
import Pagination from "./Pagination";

// LocalStorage key
const FAV_KEY = "favourites";

// Read favourites from localStorage
function getFavouritesFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
  } catch {
    return [];
  }
}

function Favourites() {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All Genres");

  // Load favourites from localStorage
  const [moviesState, setMoviesState] = useState(getFavouritesFromStorage());

  // When component loads, sync again
  useEffect(() => {
    setMoviesState(getFavouritesFromStorage());
  }, []);

  const genreids = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    10770: "TV",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };

  const [pageNum, setPageNum] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchTerm, setSearchTerm] = useState("");

  // Generate Genre List
  useEffect(() => {
    const found = moviesState
      .map((movie) => {
        const gid =
          movie.genre_ids && movie.genre_ids.length ? movie.genre_ids[0] : null;
        return gid ? genreids[gid] : null;
      })
      .filter(Boolean);

    const unique = Array.from(new Set(found));
    setGenres(["All Genres", ...unique]);
  }, [moviesState]);

  // Filtering + Searching + Sorting
  const filteredMovies = useMemo(() => {
    let result = moviesState;

    if (selectedGenre !== "All Genres") {
      result = result.filter((m) =>
        Array.isArray(m.genre_ids) &&
        m.genre_ids.some((id) => genreids[id] === selectedGenre)
      );
    }

    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      result = result.filter((m) =>
        (m.title || "").toLowerCase().includes(q)
      );
    }

    if (sortConfig.key) {
      const { key, direction } = sortConfig;
      result = [...result].sort((a, b) => {
        const av = a[key] ?? 0;
        const bv = b[key] ?? 0;
        return direction === "asc" ? av - bv : bv - av;
      });
    }

    return result;
  }, [moviesState, selectedGenre, searchTerm, sortConfig]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMovies.length / itemsPerPage)
  );

  const indexOfLastMovie = pageNum * itemsPerPage;
  const indexOfFirstMovie = indexOfLastMovie - itemsPerPage;
  const currentMovies = filteredMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );

  // Remove from favourites
  const handleDelete = (id) => {
    const updated = moviesState.filter((m) => m.id !== id);

    // Save updated list to storage
    localStorage.setItem(FAV_KEY, JSON.stringify(updated));

    // Update component state
    setMoviesState(updated);

    // Fix page number if out of range
    setPageNum((p) =>
      Math.min(p, Math.max(1, Math.ceil(updated.length / itemsPerPage)))
    );
  };

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
  };

  const onPrev = () => setPageNum((p) => Math.max(1, p - 1));
  const onNext = () => setPageNum((p) => Math.min(totalPages, p + 1));

  return (
    <>
      {/* GENRE BUTTONS */}
      <div className="mt-6 flex space-x-2 justify-center flex-wrap">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => {
              setSelectedGenre(genre);
              setPageNum(1);
            }}
            className={`py-1 px-2 rounded-lg font-bold text-lg text-white ${
              selectedGenre === genre
                ? "bg-blue-500"
                : "bg-gray-400 hover:bg-blue-400"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* SEARCH + ITEMS PER PAGE */}
      <div className="mt-4 flex justify-center space-x-2">
        <input
          type="text"
          placeholder="search"
          value={searchTerm}
          className="border-2 py-1 px-2 text-center"
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPageNum(1);
          }}
        />

        <input
          type="number"
          min={1}
          value={itemsPerPage}
          className="border-2 py-1 px-2 text-center"
          onChange={(e) => setItemsPerPage(Number(e.target.value) || 1)}
        />
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-900">Name</th>

              <th className="px-6 py-4 font-medium text-gray-900">
                Rating
                <span className="cursor-pointer ml-2" onClick={() => handleSort("vote_average", "asc")}>⬆️</span>
                <span className="cursor-pointer ml-1" onClick={() => handleSort("vote_average", "desc")}>⬇️</span>
              </th>

              <th className="px-6 py-4 font-medium text-gray-900">
                Popularity
                <span className="cursor-pointer ml-2" onClick={() => handleSort("popularity", "asc")}>⬆️</span>
                <span className="cursor-pointer ml-1" onClick={() => handleSort("popularity", "desc")}>⬇️</span>
              </th>

              <th className="px-6 py-4 font-medium text-gray-900">Genre</th>

              <th className="px-6 py-4 font-medium text-gray-900">Remove</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {currentMovies.map((movie) => (
              <tr key={movie.id} className="hover:bg-gray-50">
                <th className="flex items-center px-6 py-4 font-normal text-gray-900 space-x-2">
                  <img
                    className="h-[6rem] w-[10rem] object-cover"
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/original/${movie.poster_path}`
                        : "/placeholder.png"
                    }
                    alt={movie.title || movie.name}
                  />
                  <div className="font-medium text-gray-700 text-sm">
                    {movie.title || movie.name}
                  </div>
                </th>

                <td className="px-6 py-4">
                  {movie.vote_average?.toFixed(2) ?? "N/A"}
                </td>

                <td className="px-6 py-4">
                  {movie.popularity?.toFixed(2) ?? "N/A"}
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                    {movie.genre_ids?.length
                      ? genreids[movie.genre_ids[0]]
                      : "N/A"}
                  </span>
                </td>

                <td
                  className="px-6 py-4 text-red-600 cursor-pointer font-semibold"
                  onClick={() => handleDelete(movie.id)}
                >
                  Delete
                </td>
              </tr>
            ))}

            {currentMovies.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No movies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination pageNum={pageNum} onPrev={onPrev} onNext={onNext} />
    </>
  );
}

export default Favourites;
