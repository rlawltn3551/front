import React, { createContext, useState } from 'react';

// 관심 영화 Context 생성
export const FavoriteMoviesContext = createContext();

export const FavoriteMoviesProvider = ({ children }) => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  // 관심 영화 추가
  const addToFavoriteMovies = (movie) => {
    setFavoriteMovies((prevFavorites) => [...prevFavorites, movie]);
  };

  // 관심 영화 제거
  const removeFromFavoriteMovies = (movieId) => {
    setFavoriteMovies((prevFavorites) =>
      prevFavorites.filter((movie) => movie.id !== movieId)
    );
  };

  return (
    <FavoriteMoviesContext.Provider
      value={{ favoriteMovies, addToFavoriteMovies, removeFromFavoriteMovies }}
    >
      {children}
    </FavoriteMoviesContext.Provider>
  );
};
