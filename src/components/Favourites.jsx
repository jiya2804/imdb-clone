import React, { useEffect, useState } from 'react';
import Pagination from "./Pagination";

function Favourites() {
  let [genres, setGenres] = useState([]);
  let [selectedGenre, setSelectedGenre] = useState("All Genres");
  let [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 2;

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  let [moviesState, setMoviesState] = useState([
    {
      "adult": false,
      "backdrop_path": "/ogFIG0fNXEYRQKrpnoRJcXQNX9n.jpg",
      "id": 619930,
      "title": "Narvik",
      "poster_path": "/gU4mmINWUF294Wzi8mqRvi6peMe.jpg",
      "genre_ids": [10752, 18, 36, 28],
      "popularity": 321.063,
      "vote_average": 7.406,
    },
    {
      "adult": false,
      "backdrop_path": "/6RCf9jzKxyjblYV4CseayK6bcJo.jpg",
      "id": 804095,
      "title": "The Fabelmans",
      "poster_path": "/d2IywyOPS78vEnJvwVqkVRTiNC1.jpg",
      "genre_ids": [18],
      "popularity": 163.3,
      "vote_average": 8.02,
    },
    {
      "adult": false,
      "backdrop_path": "/fTLMsF3IVLMcpNqIqJRweGvVwtX.jpg",
      "id": 1035806,
      "title": "Detective Knight: Independence",
      "poster_path": "/jrPKVQGjc3YZXm07OYMriIB47HM.jpg",
      "genre_ids": [28, 53, 80],
      "popularity": 119.407,
      "vote_average": 6.6,
    },
    {
      "adult": false,
      "backdrop_path": "/e782pDRAlu4BG0ahd777n8zfPzZ.jpg",
      "id": 555604,
      "title": "Guillermo del Toro's Pinocchio",
      "poster_path": "/vx1u0uwxdlhV2MUzj4VlcMB0N6m.jpg",
      "genre_ids": [16, 14, 18],
      "popularity": 754.642,
      "vote_average": 8.354,
    }
  ]);

  const genreids = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
    99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
    27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
    10770: 'TV', 53: 'Thriller', 10752: 'War', 37: 'Western'
  };

  useEffect(() => {
    let temp = moviesState.map((movie) => genreids[movie.genre_ids[0]]);
    temp = new Set(temp);
    setGenres(["All Genres", ...temp]);
  }, [moviesState]);

  // ---------------- Sorting ----------------
  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
    let sortedMovies = [...moviesState];
    sortedMovies.sort((a, b) => {
      if (direction === 'asc') return a[key] - b[key];
      if (direction === 'desc') return b[key] - a[key];
      return 0;
    });
    setMoviesState(sortedMovies);
  };

  // ---------------- Genre Filtering ----------------
  const filteredMovies = selectedGenre === "All Genres"
    ? moviesState
    : moviesState.filter(movie => movie.genre_ids.some(id => genreids[id] === selectedGenre));

  // ---------------- Pagination ----------------
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      {/* Genre Buttons */}
      <div className="mt-6 flex space-x-2 justify-center">
        {genres.map((genre) => (
          <button
            key={genre}
            className={`py-1 px-2 rounded-lg font-bold text-lg text-white ${selectedGenre === genre ? 'bg-blue-500' : 'bg-gray-400 hover:bg-blue-400'}`}
            onClick={() => { setSelectedGenre(genre); setCurrentPage(1); }}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Search & Page Number */}
      <div className="mt-4 flex justify-center space-x-2">
        <input type="text" placeholder='search' className="border-2 py-1 px-2 text-center" />
        <input type="number" className="border-2 py-1 px-2 text-center" value={1} />
      </div>

      {/* Movie Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-900">Name</th>
              <th className="px-6 py-4 font-medium text-gray-900">
                <div className='flex items-center'>
                  <img
                    src="https://img.icons8.com/external-those-icons-lineal-those-icons/24/000000/external-up-arrows-those-icons-lineal-those-icons-3.png"
                    className="mr-2 cursor-pointer"
                    onClick={() => handleSort('vote_average', 'asc')}
                  />
                  <div>Rating</div>
                  <img
                    src="https://img.icons8.com/external-those-icons-lineal-those-icons/24/000000/external-down-arrows-those-icons-lineal-those-icons-4.png"
                    className="ml-2 mr-2 cursor-pointer"
                    onClick={() => handleSort('vote_average', 'desc')}
                  />
                </div>
              </th>
              <th className="px-6 py-4 font-medium text-gray-900">
                <div className='flex items-center'>
                  <img
                    src="https://img.icons8.com/external-those-icons-lineal-those-icons/24/000000/external-up-arrows-those-icons-lineal-those-icons-3.png"
                    className="mr-2 cursor-pointer"
                    onClick={() => handleSort('popularity', 'asc')}
                  />
                  <div>Popularity</div>
                  <img
                    src="https://img.icons8.com/external-those-icons-lineal-those-icons/24/000000/external-down-arrows-those-icons-lineal-those-icons-4.png"
                    className="ml-2 mr-2 cursor-pointer"
                    onClick={() => handleSort('popularity', 'desc')}
                  />
                </div>
              </th>
              <th className="px-6 py-4 font-medium text-gray-900">Genre</th>
              <th className="px-6 py-4 font-medium text-gray-900">Remove</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {currentMovies.map((movie) => (
              <tr className="hover:bg-gray-50" key={movie.id}>
                <th className="flex items-center px-6 py-4 font-normal text-gray-900 space-x-2">
                  <img className="h-[6rem] w-[10rem] object-fit" src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt="" />
                  <div className="font-medium text-gray-700 text-sm">{movie.title || movie.name}</div>
                </th>
                <td className="px-6 pl-12 py-4">{movie.vote_average.toFixed(2)}</td>
                <td className="px-6 py-4 pl-12">{movie.popularity.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                      {genreids[movie.genre_ids[0]]}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-red-600 cursor-pointer"
                    onClick={() => setMoviesState(moviesState.filter((m) => m.id !== movie.id))}
                  >
                    Delete
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination with Next / Previous */}
      <div className="flex justify-center space-x-2 mt-4">
        <button
          className="px-3 py-1 rounded bg-gray-200"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`px-3 py-1 rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}

        <button
          className="px-3 py-1 rounded bg-gray-200"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      <Pagination />
    </>
  );
}

export default Favourites;
