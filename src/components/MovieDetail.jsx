import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function MovieDetail() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // If movie was passed via state → use directly
    const [movie, setMovie] = useState(location.state?.movie || null);
    const [loading, setLoading] = useState(!movie);

    useEffect(() => {
        // If movie came from Movies.jsx → no need to fetch
        if (movie) return;

        // Otherwise fetch detail from TMDB
        const fetchMovieDetail = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=565dda78aae2b75fafddbc4320a33b38`
                );
                setMovie(res.data);
            } catch (err) {
                console.error("Error fetching detail:", err);
            }
            setLoading(false);
        };

        fetchMovieDetail();
    }, [id, movie]);

    if (loading) {
        return <div className="p-6 text-center text-xl">Loading...</div>;
    }

    if (!movie) {
        return <div className="p-6 text-center text-xl">Movie not found.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6">

            {/* Back btn */}
            <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-800 text-white rounded mb-4"
            >
                ← Back
            </button>

            <div className="flex flex-col md:flex-row gap-6">

                {/* Poster */}
                <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full md:w-80 rounded shadow-lg"
                />

                {/* Text content */}
                <div>
                    <h1 className="text-4xl font-bold mb-2">
                        {movie.title || movie.name}
                    </h1>

                    <p className="text-gray-400 mb-4">
                        {movie.release_date} • ⭐ {movie.vote_average}
                    </p>

                    <p className="leading-7 text-lg mb-4">
                        {movie.overview}
                    </p>

                    <div className="space-y-2 text-sm">
                        <div>
                            <b>Language:</b>{" "}
                            {movie.original_language?.toUpperCase()}
                        </div>

                        <div>
                            <b>Genres:</b>{" "}
                            {movie.genres?.map((g) => g.name).join(", ") || "N/A"}
                        </div>

                        <div>
                            <b>Runtime:</b> {movie.runtime || "N/A"} min
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieDetail;
