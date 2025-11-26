import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_KEY = "565dda78aae2b75fafddbc4320a33b38"; // keep your key here or use env var

function MovieDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // If Movies.jsx passed the movie object via navigate(..., { state: { movie } })
  const initial = location.state?.movie || null;

  const [movie, setMovie] = useState(initial);
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState(null);
  const placeholder = "/placeholder.png";

  useEffect(() => {
    // If we already have a full object (with useful fields), skip fetching
    // but still try to fetch full details if some fields are missing (optional)
    if (movie && movie.overview && (movie.genres || movie.runtime || movie.episode_run_time)) {
      setLoading(false);
      return;
    }

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);

      // Decide type: prefer type from passed state if available
      const preferredType = initial?.media_type; // "movie" or "tv" from trending API
      const tryFetch = async (type) => {
        const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`;
        const res = await axios.get(url);
        return { data: res.data, type };
      };

      try {
        if (preferredType) {
          // If we know the type (movie/tv) from the list, fetch that directly
          const { data } = await tryFetch(preferredType === "tv" ? "tv" : "movie");
          setMovie({ ...initial, ...data, _tmdb_type: preferredType });
        } else {
          // No preferred type: try movie first, then tv as fallback
          try {
            const { data } = await tryFetch("movie");
            setMovie({ ...initial, ...data, _tmdb_type: "movie" });
          } catch (movieErr) {
            // movie fetch failed — try tv
            try {
              const { data } = await tryFetch("tv");
              setMovie({ ...initial, ...data, _tmdb_type: "tv" });
            } catch (tvErr) {
              throw new Error("Not found as movie or TV show");
            }
          }
        }
      } catch (err) {
        console.error("Error fetching detail:", err);
        setError("Could not fetch details for this item.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-xl text-red-400">{error}</div>;
  }

  if (!movie) {
    return <div className="p-6 text-center text-xl">Movie not found.</div>;
  }

  // Normalise fields between movie & tv
  const isTV = movie._tmdb_type === "tv" || movie.media_type === "tv";
  const title = movie.title || movie.name || "Untitled";
  const date = movie.release_date || movie.first_air_date || "Unknown date";
  // runtime: movie.runtime or tv.episode_run_time (array — take first) or "N/A"
  const runtime =
    movie.runtime ||
    (Array.isArray(movie.episode_run_time) && movie.episode_run_time[0]) ||
    null;
  const runtimeLabel = runtime ? `${runtime} min` : "N/A";

  const genres =
    movie.genres && movie.genres.length
      ? movie.genres.map((g) => g.name).join(", ")
      : "N/A";

  // TV-specific fields
  const seasons = movie.number_of_seasons ?? null;
  const episodes = movie.number_of_episodes ?? null;

  // Poster path fallback
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    : placeholder;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-800 text-white rounded mb-4"
      >
        ← Back
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={posterUrl}
          alt={title}
          className="w-full md:w-80 rounded shadow-lg object-cover"
        />

        <div>
          <h1 className="text-4xl font-bold mb-2">{title}</h1>

          <p className="text-gray-400 mb-4">
            {date} • ⭐ {movie.vote_average ?? "N/A"}
          </p>

          <p className="leading-7 text-lg mb-4">
            {movie.overview || "No description available."}
          </p>

          <div className="space-y-2 text-sm">
            <div>
              <b>Language:</b>{" "}
              {(movie.original_language || "N/A").toString().toUpperCase()}
            </div>

            <div>
              <b>Genres:</b> {genres}
            </div>

            <div>
              <b>Runtime:</b> {runtimeLabel}
            </div>

            {isTV && (
              <>
                <div>
                  <b>Seasons:</b> {seasons ?? "N/A"}
                </div>
                <div>
                  <b>Episodes:</b> {episodes ?? "N/A"}
                </div>
              </>
            )}

            {movie.homepage && (
              <div>
                <b>Homepage:</b>{" "}
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 underline"
                >
                  Visit
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
