import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetch(`/movies.json`) // ya tumhari existing movies data source
      .then(res => res.json())
      .then(data => {
        const selectedMovie = data.find(m => m.id === parseInt(id));
        setMovie(selectedMovie);

        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setIsFavorite(favorites.some(fav => fav.id === selectedMovie.id));
      });
  }, [id]);

  const handleAddToFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.some(fav => fav.id === movie.id)) {
      favorites.push(movie);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="movie-details">
      <h2>{movie.title}</h2>
      <img src={movie.poster} alt={movie.title} />
      <p>{movie.description}</p>
      <p>Rating: {movie.rating}</p>
      <button onClick={handleAddToFavorites} disabled={isFavorite}>
        {isFavorite ? "Added to Favorites" : "Add to Favorites"}
      </button>
    </div>
  );
};

export default MovieDetails;
