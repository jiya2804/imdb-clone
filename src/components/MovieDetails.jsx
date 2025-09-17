import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Fetch movie details by ID
    axios
      .get(`https://api.themoviedb.org/3/movie/${id}?api_key=565dda78aae2b75fafddbc4320a33b38&language=en-US`)
      .then(res => setMovie(res.data))
      .catch(err => console.error(err));

    // Check if already in favorites
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(favorites.some(fav => fav.id === parseInt(id)));
  }, [id]);

  const handleAddToFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.some(fav => fav.id === movie.id)) {
      favorites.push(movie);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  if (!movie) return <div className="text-center mt-10 text-lg">Loading movie details...</div>;

  return (
    <div className="max-w-4xl mx-auto p-5 mt-10 border rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-5">{movie.title || movie.name}</h2>
      <img 
        src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} 
        alt={movie.title || movie.name} 
        className="w-full max-w-md mx-auto mb-5 rounded" 
      />
      <p className="mb-3">{movie.overview}</p>
      <p className="font-semibold mb-5">Rating: {movie.vote_average}</p>
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
