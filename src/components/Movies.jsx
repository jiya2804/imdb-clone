import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import { Oval } from "react-loader-spinner";
import { Link } from "react-router-dom";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [pageNum, setPage] = useState(1);
  const [hovered, setHovered] = useState("");
  const [favourites, setFavourites] = useState(
    JSON.parse(localStorage.getItem("favorites"))?.map(m => m.id) || []
  );

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/trending/all/week?api_key=565dda78aae2b75fafddbc4320a33b38&page=${pageNum}`)
      .then(res => setMovies(res.data.results));
  }, [pageNum]);

  const onPrev = () => pageNum > 1 && setPage(pageNum - 1);
  const onNext = () => setPage(pageNum + 1);

  const showEmoji = (id) => setHovered(id);
  const hideEmoji = () => setHovered("");

  const addToFav = (movie) => {
    let favs = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favs.find(m => m.id === movie.id)) {
      favs.push(movie);
      localStorage.setItem("favorites", JSON.stringify(favs));
      setFavourites(favs.map(m => m.id));
      window.dispatchEvent(new Event("favoritesUpdated"));
    }
  };

  const removeFromFav = (movie) => {
    let favs = JSON.parse(localStorage.getItem("favorites")) || [];
    favs = favs.filter(m => m.id !== movie.id);
    localStorage.setItem("favorites", JSON.stringify(favs));
    setFavourites(favs.map(m => m.id));
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  return (
    <div className="mt-8">
      <div className="mb-8 font-bold text-2xl text-center">Trending Movies</div>
      <div className="flex flex-wrap justify-center">
        {movies.length === 0 ? (
          <Oval height="80" width="80" radius="9" color="gray" secondaryColor="gray" ariaLabel="loading" />
        ) : (
          movies.map(movie => (
            <Link key={movie.id} to={`/movie/${movie.id}`}>
              <div
                onMouseOver={() => showEmoji(movie.id)}
                onMouseLeave={hideEmoji}
                className="bg-center bg-cover w-[160px] h-[30vh] md:h-[40vh] md:w-[180px] m-4 rounded-xl hover:scale-110 duration-300 flex items-end relative"
                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.poster_path})` }}
              >
                <div
                  className="p-2 bg-gray-900 absolute top-2 right-2 rounded-xl"
                  style={{ display: hovered === movie.id ? "block" : "none" }}
                  onClick={(e) => e.preventDefault()} // stop link click
                >
                  {favourites.includes(movie.id) ? (
                    <div className="text-2xl" onClick={() => removeFromFav(movie)}>❌</div>
                  ) : (
                    <div className="text-2xl" onClick={() => addToFav(movie)}>😍</div>
                  )}
                </div>
                <div className="font-bold text-white bg-gray-900 bg-opacity-60 p-2 text-center w-full rounded-b-xl">
                  {movie.title || movie.name}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
      <Pagination pageNum={pageNum} onPrev={onPrev} onNext={onNext} />
    </div>
  );
}

export default Movies;
