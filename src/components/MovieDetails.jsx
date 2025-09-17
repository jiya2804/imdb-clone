import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { movies } from "./Movies"; // Make sure Movies.jsx me export ho: export const movies = [...]

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Find movie from existing array
    const selectedMovie = movies.find(m => m.id === parseInt(id));
    setMovie(selectedMovie);

    // Check if already in favorites
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(favorites.some(fav => fav.id === selectedMovie.id));
  }, [id]);

  const handleAddToFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.some(fav => fav.id === movie.id)) {
      favorites.push(movie);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  if (!movie) return <div className="text-center mt-10 text-lg">Movie not found!</div>;

  return (
    <div className="max-w-4xl mx-auto p-5 mt-10 border rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-5">{movie.title}</h2>
      <img src={movie.poster} alt={movie.title} className="w-full max-w-md mx-auto mb-5 rounded" />
      <p className="mb-3">{movie.description}</p>
      <p className="font-semibold mb-5">Rating: {movie.rating}</p>
      <button
        onClick={handleAddToFavorites}
        disabled={isFavorite}
        className={`px-4 py-2 rounded ${isFavorite ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
      >
        {isFavorite ? "Added to Favorites" : "Add to Favorites"}
      </button>
    </div>
  );
};

export default MovieDetails;

