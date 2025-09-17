import logo from './logo.svg';
import './App.css';
import NavBar from './components/NavBar';
import Banner from './components/Banner';
import Movies from './components/Movies';
import Pagination from './components/Pagination';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Favourites from './components/Favourites';
import PageNotFound from './components/PageNotFound';
import MovieDetails from './components/MovieDetails'; // New import

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />

        <Routes>
          {/* Home Page: Banner + Movies */}
          <Route path="/" element={
            <>
              <Banner />
              <Movies />
            </>
          } />

          {/* Movie Details Page */}
          <Route path="/movie/:id" element={<MovieDetails />} />

          {/* Favorites Page */}
          <Route path="/fav" element={<Favourites />} />

          {/* 404 Page */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
