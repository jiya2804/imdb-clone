import React, { useEffect, useState } from 'react';
import axios from "axios";
import Pagination from './Pagination';
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

// LocalStorage helpers
const FAV_KEY = "favourites";

function getFavouritesFromStorage() {
    try {
        return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
    } catch {
        return [];
    }
}

function saveFavouritesToStorage(arr) {
    localStorage.setItem(FAV_KEY, JSON.stringify(arr));
}

function Movies() {

    let [movies, setMovies] = useState([]);
    let [pageNum, setPage] = useState(1);
    let [hovered, setHovered] = useState("");
    let [favourites, setFavorites] = useState(getFavouritesFromStorage().map(m => m.id));
    const navigate = useNavigate();

    // Fetch Trending Movies
    useEffect(function () {
        axios
            .get(
                `https://api.themoviedb.org/3/trending/all/week?api_key=565dda78aae2b75fafddbc4320a33b38&page=${pageNum}`
            )
            .then((res) => setMovies(res.data.results));
    }, [pageNum]);

    // Pagination
    const onPrev = () => pageNum > 1 && setPage(pageNum - 1);
    const onNext = () => setPage(pageNum + 1);

    // Hover
    const showEmoji = (id) => setHovered(id);
    const hideEmoji = () => setHovered("");

    // ADD / REMOVE FROM FAVOURITES + LOCALSTORAGE
    const toggleFavourite = (movie) => {
        const favList = getFavouritesFromStorage();
        const exists = favList.some((m) => m.id === movie.id);

        let updated;

        if (exists) {
            // Remove
            updated = favList.filter((m) => m.id !== movie.id);
        } else {
            // Add (normalize object to match Favourites.js)
            const normalizedMovie = {
                adult: movie.adult ?? false,
                backdrop_path: movie.backdrop_path || "",
                id: movie.id,
                title: movie.title || movie.name,
                original_language: movie.original_language || "",
                original_title: movie.original_title || movie.name || movie.title,
                poster_path: movie.poster_path || "",
                media_type: movie.media_type || "movie",
                genre_ids: movie.genre_ids || [],
                popularity: movie.popularity || 0,
                release_date: movie.release_date || movie.first_air_date || "",
                video: movie.video || false,
                vote_average: movie.vote_average || 0,
                vote_count: movie.vote_count || 0
            };
            updated = [normalizedMovie, ...favList];
        }

        // Save to localStorage
        saveFavouritesToStorage(updated);

        // Sync state (store only IDs for quick lookup)
        setFavorites(updated.map((m) => m.id));
    };

    return (
        <div className="mt-8">
            <div className="mb-8 font-bold text-2xl text-center">
                Trending Movies
            </div>

            <div className="flex flex-wrap justify-center">

                {movies.length === 0 ? (
                    <Oval height="80" width="80" color="gray" />
                ) : (
                    movies.map((movie) => (
                        <div
                            key={movie.id}
                            onMouseOver={() => showEmoji(movie.id)}
                            onMouseLeave={hideEmoji}
                            onClick={() =>
                                navigate(`/movie/${movie.id}`, {
                                    state: { movie },
                                })
                            }
                            className="
                                bg-center bg-cover    
                                w-[160px] h-[30vh]
                                md:h-[40vh] md:w-[180px]
                                m-4 rounded-xl
                                hover:scale-110 duration-300
                                flex items-end relative cursor-pointer
                            "
                            style={{
                                backgroundImage: `url(https://image.tmdb.org/t/p/w500/${movie.poster_path})`,
                            }}
                        >
                            {/* EMOJI BUTTON */}
                            <div
                                className="p-2 bg-gray-900 absolute top-2 right-2 rounded-xl"
                                style={{
                                    display: hovered === movie.id ? "block" : "none",
                                }}
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent navigation
                                    toggleFavourite(movie);
                                }}
                            >
                                {favourites.includes(movie.id) ? (
                                    <div className="text-2xl">❌</div>
                                ) : (
                                    <div className="text-2xl">😍</div>
                                )}
                            </div>

                            <div
                                className="
                                    font-bold text-white
                                    bg-gray-900 bg-opacity-60
                                    p-2 text-center w-full rounded-b-xl
                                "
                            >
                                {movie.title || movie.name}
                            </div>
                        </div>
                    ))
                )}

            </div>

            <Pagination
                pageNum={pageNum}
                onPrev={onPrev}
                onNext={onNext}
            />
        </div>
    );
}

export default Movies;
