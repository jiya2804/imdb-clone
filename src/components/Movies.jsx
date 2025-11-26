import React, { useEffect, useState } from 'react';
// import Image from "./image.jpg";
import axios from "axios";
import Pagination from './Pagination';
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom"; // <-- added

function Movies() {
    let [movies, setMovies] = useState([]);
    let [pageNum, setPage] = useState(1);
    let [hovered, setHovered] = useState("");
    let [favourites, setFavorites] = useState([]);
    const navigate = useNavigate(); // <-- added

    /* making api request */
    useEffect(function () {
        console.log("useEffect again");
        (function () {
            axios
                .get
                ("https://api.themoviedb.org/3/trending/all/week?api_key=565dda78aae2b75fafddbc4320a33b38&page=" + pageNum)
                .then((res) => {
                    // console.table(res.data.results);
                    setMovies(res.data.results);
                })
        })()
    }, [pageNum])
    /* Pagination handlers*/
    const onPrev = () => {
        if (pageNum > 1) {
            setPage(pageNum - 1);
        }
    }
    const onNext = () => {
        setPage(pageNum + 1);

    }
    /*emoji show and hide on hover*/
    const showEmoji = (id) => {
        setHovered(id);
    }
    const hideEmoji = () => {
        setHovered("");
    }
    /*adding / removeing emojis to fav*/

    const addEmoji = (e, id) => {
        e.stopPropagation(); // <-- important so clicking emoji doesn't open detail
        const newFav = [...favourites, id];
        setFavorites(newFav);
    }
    const removeEmoji = (e, id) => {
        e.stopPropagation(); // <-- important
        // whichever elem -> not equal to my id 
        const filteredFav = favourites.filter(elem => {
            return elem != id;
        })
        setFavorites(filteredFav);
    }

    // open detail route when card clicked
    const openDetail = (movie) => {
        navigate(`/movie/${movie.id}`, { state: { movie } });
    }

    return (
        <div className="mt-8">
            <div className="mb-8
            font-bold text-2xl text-center
            "
            >Trending Movies</div>
            <div className="flex 
            flex-wrap
            justify-center
            ">
                {
                    movies.length == 0 ? <Oval
                        height="80"
                        width="80"
                        radius="9"
                        color="gray"
                        secondaryColor='gray'
                        ariaLabel="loading"

                    /> : movies.map((movie) => {

                        return <div
                            onMouseOver={
                                () => { showEmoji(movie.id) }
                            }
                            onMouseLeave={
                                () => { hideEmoji(movie.id) }
                            }

                            key={movie.id}
                            className="
                bg-center bg-cover    
                w-[160px]
                h-[30vh]
                md: h-[40vh]
                md:w-[180px]
                m-4
                rounded-xl
                hover:scale-110
                duration-300
                 flex items-end 
                 relative
                "
                            style={{
                                backgroundImage:
                                    // fixed TMDB path (removed duplicate '/t/p')
                                    `url(https://image.tmdb.org/t/p/w500/${movie.poster_path})`
                            }}
                            onClick={() => openDetail(movie)} // <-- added
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === "Enter") openDetail(movie); }}
                        >
                            <div
                                className="p-2
 bg-gray-900
                                absolute top-2 right-2
                                rounded-xl
                               "
                                style={{
                                    display: hovered == movie.id ?
                                        "block" : "none"
                                }}
                            >
                                {favourites.includes(movie.id) == false ? <div className="
                                text-2xl
                                "
                                    onClick={(e) => { addEmoji(e, movie.id) }} // <-- pass event
                                >
                                    😍
                                </div> : <div className="
                                text-2xl
                                "
                                    onClick={(e) => { removeEmoji(e, movie.id) }} // <-- pass event

                                >
                                    ❌
                                </div>

                                }

                            </div>
                            <div
                                className="
                    font-bold text-white
                bg-gray-900 bg-opacity-60
                p-2
                text-center
                w-full
                rounded-b-xl
                "> {movie.title || movie.name}</div>
                        </div>
                    })
                }
            </div>
            <Pagination
                pageNum={pageNum}
                onPrev={onPrev}
                onNext={onNext}
            ></Pagination>
        </div >
    )
}

export default Movies;
