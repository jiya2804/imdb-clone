import React, { useEffect, useState } from 'react';
import axios from "axios";
import Pagination from './Pagination';
import { Oval } from "react-loader-spinner";
import { Link } from "react-router-dom";

function Movies() {
    const [movies, setMovies] = useState([]);
    const [pageNum, setPage] = useState(1);
    const [hovered, setHovered] = useState("");
    const [favourites, setFavourites] = useState(() => JSON.parse(localStorage.getItem("favorites")) || []);

    useEffect(() => {
        axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=565dda78aae2b75fafddbc4320a33b38&page=${pageNum}`)
            .then(res => setMovies(res.data.results))
            .catch(err => console.error(err));
    }, [pageNum]);

    const onPrev = () => { if (pageNum > 1) setPage(pageNum - 1); }
    const onNext = () => { setPage(pageNum + 1); }

    const showEmoji = (id) => setHovered(id);
    const hideEmoji = () => setHovered("");

    const addToFavourites = (movie) => {
        const exists = favourites.some(fav => fav.id === movie.id);
        if (!exists) {
            const newFav = [...favourites, movie];
            setFavourites(newFav);
            localStorage.setItem("favorites", JSON.stringify(newFav));
        }
    };

    const removeFromFavourites = (movie) => {
        const newFav = favourites.filter(fav => fav.id !== movie.id);
        setFavourites(newFav);
        localStorage.setItem("favorites", JSON.stringify(newFav));
    };

    return (
        <div className="mt-8">
            <div className="mb-8 font-bold text-2xl text-center">Trending Movies</div>
            <div className="flex flex-wrap justify-center">
                {movies.length === 0 ? <Oval height="80" width="80" radius="9" color="gray" ariaLabel="loading" /> :
                    movies.map((movie) => (
                        <Link key={movie.id} to={`/movie/${movie.id}`} state={{ media_type: movie.media_type }}>
                            <div
                                onMouseOver={() => showEmoji(movie.id)}
                                onMouseLeave={hideEmoji}
                                className="bg-center bg-cover w-[160px] h-[30vh] md:h-[40vh] md:w-[180px] m-4 rounded-xl hover:scale-110 duration-300 flex items-end relative"
                                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.poster_path})` }}
                            >
                                <div
                                    className="p-2 bg-gray-900 absolute top-2 right-2 rounded-xl"
                                    style={{ display: hovered === movie.id ? "block" : "none" }}
                                    onClick={(e) => e.preventDefault()}
                                >
                                    {favourites.some(fav => fav.id === movie.id) ?
                                        <div className="text-2xl" onClick={() => removeFromFavourites(movie)}>❌</div> :
                                        <div className="text-2xl" onClick={() => addToFavourites(movie)}>😍</div>
                                    }
                                </div>
                                <div className="font-bold text-white bg-gray-900 bg-opacity-60 p-2 text-center w-full rounded-b-xl">
                                    {movie.title || movie.name}
                                </div>
                            </div>
                        </Link>
                    ))}
            </div>
            <Pagination pageNum={pageNum} onPrev={onPrev} onNext={onNext} />
        </div>
    );
}

export default Movies;
