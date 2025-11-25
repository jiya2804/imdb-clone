import React, { useEffect, useMemo, useState } from "react";
import Pagination from "./Pagination";

function Favourites() {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [moviesState, setMoviesState] = useState([
    {
      adult: false,
      backdrop_path: "/ogFIG0fNXEYRQKrpnoRJcXQNX9n.jpg",
      id: 619930,
      title: "Narvik",
      original_language: "no",
      original_title: "Kampen om Narvik",
      poster_path: "/gU4mmINWUF294Wzi8mqRvi6peMe.jpg",
      media_type: "movie",
      genre_ids: [10752, 18, 36, 28],
      popularity: 321.063,
      release_date: "2022-12-25",
      video: true,
      vote_average: 7.406,
      vote_count: 53,
    },
    {
      adult: false,
      backdrop_path: "/6RCf9jzKxyjblYV4CseayK6bcJo.jpg",
      id: 804095,
      title: "The Fabelmans",
      original_language: "en",
      original_title: "The Fabelmans",
      poster_path: "/d2IywyOPS78vEnJvwVqkVRTiNC1.jpg",
      media_type: "movie",
      genre_ids: [18],
      popularity: 163.3,
      release_date: "2022-11-11",
      video: false,
      vote_average: 8.02,
      vote_count: 561,
    },
    {
      adult: false,
      backdrop_path: "/fTLMsF3IVLMcpNqIqJRweGvVwtX.jpg",
      id: 1035806,
      title: "Detective Knight: Independence",
      original_language: "en",
      original_title: "Detective Knight: Independence",
      poster_path: "/jrPKVQGjc3YZXm07OYMriIB47HM.jpg",
      media_type: "movie",
      genre_ids: [28, 53, 80],
      popularity: 119.407,
      release_date: "2023-01-20",
      video: false,
      vote_average: 6.6,
      vote_count: 10,
    },
    {
      adult: false,
      backdrop_path: "/e782pDRAlu4BG0ahd777n8zfPzZ.jpg",
      id: 555604,
      title: "Guillermo del Toro's Pinocchio",
      original_language: "en",
      original_title: "Guillermo del Toro's Pinocchio",
      poster_path: "/vx1u0uwxdlhV2MUzj4VlcMB0N6m.jpg",
      media_type: "movie",
      genre_ids: [16, 14, 18],
      popularity: 754.642,
      release_date: "2022-11-18",
      video: false,
      vote_average: 8.354,
      vote_count: 1694,
    },
  ]);

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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchTerm, setSearchTerm] = useState("");

  // Generate Genre List
  useEffect(() => {
    const found = moviesState
      .map((movie) =>
        movie.genre_ids.length ? genreids[movie.genre_ids[0]] : null
      )
      .filter(Boolean);

    const unique = Array.from(new Set(found));
    setGenres(["All Genres", ...unique]);
  }, [moviesState]);

  // Filtering + Searching + Sorting
  const filteredMovies = useMemo(() => {
    let result = moviesState;

    if (selectedGenre !== "All Genres") {
      result = result.filter((m) =>
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
      result = [...result].sort((a, b) =>
        direction === "asc" ? a[key] - b[key] : b[key] - a[key]
      );
    }

    return result;
  }, [moviesState, selectedGenre, searchTerm, sortConfig]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMovies.length / itemsPerPage)
  );

  const indexOfLastMovie = currentPage * itemsPerPage;
  const indexOfFirstMovie = indexOfLastMovie - itemsPerPage;
  const currentMovies = filteredMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );

  const handleDelete = (id) => {
    setMoviesState((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
  };

  return (
    <>
      {/* GENRE BUTTONS */}
      <div className="mt-6 flex space-x-2 justify-center flex-wrap">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => {
              setSelectedGenre(genre);
              setCurrentPage(1);
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
            setCurrentPage(1);
          }}
        />
        <input
          type="number"
          min={1}
          value={itemsPerPage}
          className="border-2 py-1 px-2 text-center"
          onChange={(e) =>
            setItemsPerPage(Number(e.target.value) || 1)
          }
        />
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-900">
                Name
              </th>

              {/* Rating Sort */}
              <th className="px-6 py-4 font-medium text-gray-900">
                <div className="flex items-center">
                  <img
                    src="https://img.icons8.com/external-those-icons-lineal-those-icons/24/000000/external-up-arrows-those-icons-lineal-those-icons-3.png"
                    className="mr-2 cursor-pointer"
                    onClick={() => handleSort("vote_average", "asc")}
                    alt="asc"
                  />
                  <div>Rating</div>
                  <img
                    src="https://img.icons8.com/external-those-icons-lineal-those-icons/24/000000/external-down-arrows-those-icons-lineal-those-icons-4.png"
                    className="ml-2 cursor-pointer"
                    onClick={() => handleSort("vote_average", "desc")}
                    alt="desc"
                  />
                </div>
              </th>

              {/* Popularity Sort */}
              <th className="px-6 py-4 font-medium text-gray-900">
                <div className="flex items-center">
                  <img
                    src="https://img.icons8.com/external-those-icons-lineal-those-icons/24/000000/external-up-arrows-those-icons-lineal-those-icons-3.png"
                    className="mr-2 cursor-pointer"
                    onClick={() => handleSort("popularity", "asc")}
                    alt="asc"
                  />
                  <div>Popularity</div>
                  <img
                    src="https://img.icons8.com/external-those-icons-lineal-those-icons/24/000000/external-down-arrows-those-icons-lineal-those-icons-4.png"
                    className="ml-2 cursor-pointer"
                    onClick={() => handleSort("popularity", "desc")}
                    alt="desc"
                  />
                </div>
              </th>

              <th className="px-6 py-4 font-medium text-gray-900">
                Genre
              </th>

              <th className="px-6 py-4 font-medium text-gray-900">
                Remove
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {currentMovies.map((movie) => (
              <tr key={movie.id} className="hover:bg-gray-50">
                <th className="flex items-center px-6 py-4 font-normal text-gray-900 space-x-2">
                  <img
                    className="h-[6rem] w-[10rem] object-cover"
                    src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                    alt={movie.title}
                  />
                  <div className="font-medium text-gray-700 text-sm">
                    {movie.title}
                  </div>
                </th>

                <td className="px-6 pl-12 py-4">
                  {movie.vote_average.toFixed(2)}
                </td>

                <td className="px-6 py-4 pl-12">
                  {movie.popularity.toFixed(2)}
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                    {genreids[movie.genre_ids[0]]}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    onClick={() => handleDelete(movie.id)}
                    className="inline-flex text-red-600 cursor-pointer font-semibold"
                  >
                    Delete
                  </span>
                </td>
              </tr>
            ))}

            {currentMovies.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No movies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={() =>
          setCurrentPage((p) => Math.max(1, p - 1))
        }
        onNext={() =>
          setCurrentPage((p) => Math.min(totalPages, p + 1))
        }
        onPageChange={setCurrentPage}
      />
    </>
  );
}

export default Favourites;
