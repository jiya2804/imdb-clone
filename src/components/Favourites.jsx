import React, { useEffect, useState } from 'react';
import Pagination from "./Pagination";

function Favourites() {
  let [genres, setGenres] = useState([]);
  let genreids = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Sci-Fi',
    10770: 'TV',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
  };

  let movies = [
    {
      "adult": false,
      "backdrop_path": "/ogFIG0fNXEYRQKrpnoRJcXQNX9n.jpg",
      "id": 619930,
      "title": "Narvik",
      "original_language": "no",
      "original_title": "Kampen om Narvik",
      "overview": "April, 1940...",
      "poster_path": "/gU4mmINWUF294Wzi8mqRvi6peMe.jpg",
      "media_type": "movie",
      "genre_ids": [10752, 18, 36, 28],
      "popularity": 321.063,
      "release_date": "2022-12-25",
      "video": true,
      "vote_average": 7.406,
      "vote_count": 53
    },
    {
      "adult": false,
      "backdrop_path": "/6RCf9jzKxyjblYV4CseayK6bcJo.jpg",
      "id": 804095,
      "title": "The Fabelmans",
      "original_language": "en",
      "original_title": "The Fabelmans",
      "overview": "Growing up in post-World War II era Arizona...",
      "poster_path": "/d2IywyOPS78vEnJvwVqkVRTiNC1.jpg",
      "media_type": "movie",
      "genre_ids": [18],
      "popularity": 163.3,
      "release_date": "2022-11-11",
      "video": false,
      "vote_average": 8.02,
      "vote_count": 561
    },
    {
      "adult": false,
      "backdrop_path": "/fTLMsF3IVLMcpNqIqJRweGvVwtX.jpg",
      "id": 1035806,
      "title": "Detective Knight: Independence",
      "original_language": "en",
      "original_title": "Detective Knight: Independence",
      "overview": "Detective James Knight’s last-minute assignment...",
      "poster_path": "/jrPKVQGjc3YZXm07OYMriIB47HM.jpg",
      "media_type": "movie",
      "genre_ids": [28, 53, 80],
      "popularity": 119.407,
      "release_date": "2023-01-20",
      "video": false,
      "vote_average": 6.6,
      "vote_count": 10
    },
    {
      "adult": false,
      "backdrop_path": "/e782pDRAlu4BG0ahd777n8zfPzZ.jpg",
      "id": 555604,
      "title": "Guillermo del Toro's Pinocchio",
      "original_language": "en",
      "original_title": "Guillermo del Toro's Pinocchio",
      "overview": "During the rise of fascism in Mussolini's Italy...",
      "poster_path": "/vx1u0uwxdlhV2MUzj4VlcMB0N6m.jpg",
      "media_type": "movie",
      "genre_ids": [16, 14, 18],
      "popularity": 754.642,
      "release_date": "2022-11-18",
      "video": false,
      "vote_average": 8.354,
      "vote_count": 1694
    }
  ];

  useEffect(() => {
    let temp = movies.map((movie) => genreids[movie.genre_ids[0]]);
    temp = new Set(temp);
    setGenres(["All Genres", ...temp]);
  }, []);

  return (
    <>
      {/* Genres Filter Buttons */}
      <div className="mt-6 flex space-x-2 justify-center">
        {genres.map((genre, idx) => {
          return (
            <button
              key={idx}
              className="py-1 px-2 bg-gray-400 rounded-lg font-bold text-lg text-white hover:bg-blue-400"
            >
              {genre}
            </button>
          );
        })}
      </div>

      {/* Search + Number Inputs */}
      <div className="mt-4 flex justify-center space-x-2">
        <input
          type="text"
          placeholder="search"
          className="border-2 py-1 px-2 text-center"
        />
        <input
          type="number"
          className="border-2 py-1 px-2 text-center"
          value={1}
        />
      </div>

      {/* Movies Table */}
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
                    alt="up"
                  />
                  <div>Rating</div>
                  <img
                    src="https://img.icons8.com/external-those-icons-lineal-those-icons/24/000000/external-down-arrows-those-icons-lineal-those-icons-4.png"
                    className="ml-2 mr-2"
                    alt="down"
                  />
                </div>
              </th>
              <th className="px-6 py-4 font-medium text-gray-900">
                <div className="flex">
                  <img
                    src="https://img.icons8.com/external-those-icons-lineal-those-icons/24/000000/external-up-arrows-those-icons-lineal-those-icons-3.png"
                    className="mr-2 cursor-pointer"
                    alt="up"
                  />
                  <div>Popularity</div>
                  <img
                    src="https://img.icons8.com/external-those-icons-lineal-those-icons/24/000000/external-down-arrows-those-icons-lineal-those-icons-4.png"
                    className="ml-2 mr-2"
                    alt="down"
                  />
                </div>
              </th>
              <th className="px-6 py-4 font-medium text-gray-900">Genre</th>
              <th className="px-6 py-4 font-medium text-gray-900">Remove</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {movies.map((movie) => {
              return (
                <tr className="hover:bg-gray-50" key={movie.id}>
                  <th className="flex items-center px-6 py-4 font-normal text-gray-900 space-x-2">
                    <img
                      className="h-[6rem] w-[10rem] object-fit"
                      src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                      alt={movie.title}
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
                    <div className="flex gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                        {genreids[movie.genre_ids[0]]}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-red-600 cursor-pointer">
                      Delete
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination />
    </>
  );
}

export default Favourites;
