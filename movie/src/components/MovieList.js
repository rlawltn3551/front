import React from 'react';
import MovieCard from './MovieCard'; // MovieCard가 별도로 정의되어 있다고 가정
import { Link } from 'react-router-dom';

const MovieList = ({ movies }) => {
  return (
    <div
      className="movie-list"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        textAlign: 'center',
      }}
    >
      {movies.map((movie) => (
        <Link
          to={`/movie/${movie.id}`}
          className="nav-link"
          key={movie.id}
          style={{
            width: '150px',
            textAlign: 'center',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <MovieCard key={movie.id} movie={movie} />
        </Link>
      ))}
    </div>
  );
};

export default MovieList;
