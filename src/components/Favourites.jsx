import React, { useEffect, useState } from 'react';
import Pagination from "./Pagination";

function Favourites() {
  let [genres, setGenres] = useState([]);
  let [searchText, setSearchText] = useState("");   // 🔹 search ke liye
  let [ratingOrder, setRatingOrder] = useState(0);  // 🔹 sorting ke liye
  let [popularityOrder, setPopularityOrder] = useState(0);

  let genreids = { /* ... tumhara genre object same rakho ... */ };

  let movies = [ /* ... tumhara dummy data same rakho ... */ ];

  useEffect(() => {
    let temp = movies.map((movie) => genreids[movie.genre_ids[0]]);
    temp = new Set(temp);
    setGenres(["All Genres", ...temp]);
  }, []);

  // 🔹 Search filter
  let filteredMovies = movies.filter((movie) =>
    (movie.title || movie.name).toLowerCase().includes(searchText.toLowerCase())
  );

  // 🔹 Sorting logic
  if (ratingOrder !== 0) {
    filteredMovies = [...filteredMovies].sort((a, b) =>
      ratingOrder === 1
        ? a.vote_average - b.vote_average
        : b.vote_average - a.vote_average
    );
  }

  if (popularityOrder !== 0) {
    filteredMovies = [...filteredMovies].sort((a, b) =>
      popularityOrder === 1
        ? a.popularity - b.popularity
        : b.popularity - a.popularity
    );
  }

  return (
    <>
      {/* Genre buttons */}
      <div className="mt-6 flex space-x-2 justify-center">
        {genres.map((genre) => (
          <button
            key={genre}
            className="py-1 px-2 bg-gray-400 rounded-lg font-bold text-lg text-white hover:bg-blue-400"
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Search box */}
      <div className="mt-4 flex justify-center space-x-2">
        <input
          type="text"
          placeholder="search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)} // 🔹 ab state update hogi
          className="border-2 py-1 px-2 text-center"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-900">Name</th>
              <th className="px-6 py-4 font-medium text-gray-900">
                <div className="flex">
                  <img
                    src="https://img.icons8.com/external-those-icons-lineal-those-icons/24/000000/external-up-arrows-those-icons-lineal-those-icons-3.png"
                    className="mr-2 cursor-pointer"
                    onClick={() => setRatingOrder(1)} // 🔹 ascending
                  />
                  <div>Rating</div>
                  <img
                    src="https://img.icons8.com/external-those-icons-lineal-those-icons/24/000000/external-down-arrows-those-icons-lineal-those-icons-4.png"
                    className="ml-2 mr-2 cursor-pointer"
                    onClick={() => setRatingOrder(-1)} // 🔹 descending
                  />
                </div>
              </th>

              <th className="px-6 py-4 font-medium text-gray-900">
                <div className="flex">
                  <img
                    src="https://img.icons8.com/external-those-icons-lineal-those-icons/24/000000/external-up-arrows-those-icons-lineal-those-icons-3.png"
                    className="mr-2 cursor-pointer"
                    onClick={() => setPopularityOrder(1)}
                  />
                  <div>Popularity</div>
                  <img
                    src="https://img.icons8.com/external-those-icons-lineal-those-icons/24/000000/external-down-arrows-those-icons-lineal-those-icons-4.png"
                    className="ml-2 mr-2 cursor-pointer"
                    onClick={() => setPopularityOrder(-1)}
                  />
                </div>
              </th>
              <th className="px-6 py-4 font-medium text-gray-900">Genre</th>
              <th className="px-6 py-4 font-medium text-gray-900">Remove</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {filteredMovies.map((movie) => (
              <tr className="hover:bg-gray-50" key={movie.id}>
                <th className="flex items-center px-6 py-4 font-normal text-gray-900 space-x-2">
                  <img
                    className="h-[6rem] w-[10rem] object-fit"
                    src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                    alt=""
                  />
                  <div className="font-medium text-gray-700 text-sm">
                    {movie.title || movie.name}
                  </div>
                </th>
                <td className="px-6 pl-12 py-4">
                  {movie.vote_average.toFixed(2)}
                </td>
                <td className="px-6 py-4 pl-12">
                  {movie.popularity.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                    {genreids[movie.genre_ids[0]]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-red-600">
                    Delete
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination />
    </>
  );
}

export default Favourites;

