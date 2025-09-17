import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";

function Favourites() {
  const [movies, setMovies] = useState([]);
  const [currGenre, setCurrGenre] = useState("All Genres");
  const [search, setSearch] = useState("");
  const [ratingOrder, setRatingOrder] = useState(0);
  const [popularityOrder, setPopularityOrder] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 2;

  const genreids = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
    99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
    27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
    10770: "TV", 53: "Thriller", 10752: "War", 37: "Western",
  };

  // Load favourites from localStorage on mount
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    setMovies(favs);

    // Listen for updates from Movies page
    const handleUpdate = () => {
      const updatedFavs = JSON.parse(localStorage.getItem("favorites")) || [];
      setMovies(updatedFavs);
    };

    window.addEventListener("favoritesUpdated", handleUpdate);
    return () => window.removeEventListener("favoritesUpdated", handleUpdate);
  }, []);

  // Delete a movie
  const handleDelete = (id) => {
    const newMovies = movies.filter(m => m.id !== id);
    setMovies(newMovies);
    localStorage.setItem("favorites", JSON.stringify(newMovies));
  };

  // Filter, search, sort
  let filteredMovies = currGenre === "All Genres" ? movies : movies.filter(m => genreids[m.genre_ids[0]] === currGenre);
  filteredMovies = filteredMovies.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));
  if (ratingOrder !== 0) filteredMovies.sort((a, b) => ratingOrder === 1 ? a.vote_average - b.vote_average : b.vote_average - a.vote_average);
  if (popularityOrder !== 0) filteredMovies.sort((a, b) => popularityOrder === 1 ? a.popularity - b.popularity : b.popularity - a.popularity);

  // Pagination
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  const onPrev = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const onNext = () => { if (indexOfLastMovie < filteredMovies.length) setCurrentPage(currentPage + 1); };

  // Generate genres dynamically
  const genres = ["All Genres", ...new Set(movies.map(m => genreids[m.genre_ids[0]]))];

  return (
    <>
      {/* Genre Buttons */}
      <div className="mt-6 flex space-x-2 justify-center">
        {genres.map((genre, idx) => (
          <button
            key={idx}
            className={`py-1 px-2 rounded-lg font-bold text-lg text-white ${currGenre === genre ? "bg-blue-600" : "bg-gray-400 hover:bg-blue-400"}`}
            onClick={() => { setCurrGenre(genre); setCurrentPage(1); }}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mt-4 flex justify-center space-x-2">
        <input
          type="text"
          placeholder="search"
          className="border-2 py-1 px-2 text-center"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {/* Movies Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-900">Name</th>
              <th className="px-6 py-4 font-medium text-gray-900">
                <span className="cursor-pointer" onClick={() => setRatingOrder(ratingOrder === 1 ? -1 : 1)}>
                  Rating {ratingOrder === 1 ? "↑" : ratingOrder === -1 ? "↓" : ""}
                </span>
              </th>
              <th className="px-6 py-4 font-medium text-gray-900">
                <span className="cursor-pointer" onClick={() => setPopularityOrder(popularityOrder === 1 ? -1 : 1)}>
                  Popularity {popularityOrder === 1 ? "↑" : popularityOrder === -1 ? "↓" : ""}
                </span>
              </th>
              <th className="px-6 py-4 font-medium text-gray-900">Genre</th>
              <th className="px-6 py-4 font-medium text-gray-900">Remove</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {currentMovies.map(movie => (
              <tr className="hover:bg-gray-50" key={movie.id}>
                <th className="flex items-center px-6 py-4 font-normal text-gray-900 space-x-2">
                  <img className="h-[6rem] w-[10rem] object-fit" src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt={movie.title} />
                  <div className="font-medium text-gray-700 text-sm">{movie.title}</div>
                </th>
                <td className="px-6 pl-12 py-4">{movie.vote_average.toFixed(2)}</td>
                <td className="px-6 py-4 pl-12">{movie.popularity.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                    {genreids[movie.genre_ids[0]]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span onClick={() => handleDelete(movie.id)} className="cursor-pointer text-red-600 font-semibold">Delete</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination pageNum={currentPage} onPrev={onPrev} onNext={onNext} />
    </>
  );
}

export default Favourites;
